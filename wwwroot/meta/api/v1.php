<?php

class API_Handler{
    protected $authentication;
    protected $request;
    protected $endpoints;

    function __construct(){
        # instantiate the properties which are based on the request to the script
        $this->authentication = new Authentication();
        $this->request = new Request();
        $this->endpoints = new Endpoint(); # creates a blank endpoint as the root for other endpointst
    }

    function authentication(){
        return $this->authentication;
    }

    function request(){
        return $this->request;
    }

    function endpoints($path = null){
        # optional find target endpoint operation built in
        if(isset($path)) return $this->endpoints->find($path); 
        # otherwise just return the root endpoint
        return $this->endpoints;
    }

    function processRequest(){
        try{
            $request_path = $this->request->path();

            $endpoint = $this->endpoints->find($request_path);
            $endpoint->do($this->authentication, $this->request);
        }catch(Exception $err){
            http_response_code(500);
            echo $err->getMessage();
        }
    }
  
}

class Authentication{

    protected $auth_type; # 'secret' => by trusted machine bearing the client_secret; 'session' => users authenticated web session
    private $user_token;
    private $session_updated = false; # if assigning roles by ad group membership, we will bump the last modified time of the web session, to keep it alive
    protected $user; # the authenticated user
    protected $roles = []; # list of roles the authenticated user is assigned

    function __construct(){
        $bearer_token = $this->getBearerToken();
        if(isset($bearer_token)){
          $this->auth_type = 'secret';
          $this->user_token = $bearer_token;
          $this->user = $_SERVER['REMOTE_ADDR']; # ip since user is not set
        }else{
          $this->auth_type = 'session';
          session_start(['read_and_close' => true]); # read session - no file lock
          $this->user = isset($_SESSION['LOGINID']) ? $_SESSION['LOGINID'] : $_SERVER['REMOTE_ADDR']; # lcso id or ip fallback
        }
    }

    // function isDeveloper($local=false){
        
    //     if((isset($_SESSION['LOGINID']) and ($_SESSION['LOGINID'] == '2790' or $_SESSION['LOGINID'] == '2979') and !$local) or (strtolower($_SERVER['HTTP_ORIGIN'])=='http://localhost:20189')){
    //         //enable error reporting for web developer account specifically, on all pages that include this security file
    //         // ini_set('display_errors', 1);
    //         // ini_set('display_startup_errors', 1);
    //         // error_reporting(E_ALL);
    //         return true;//used to show some script execution time logs, etc. on web app pages
    //     }else{
    //         return false;
    //     }
    // }//end: isDeveloper


    function getBearerToken() {
        $headers = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    function auth_type(){
        return $this->auth_type;
    }

    function user(){
        return $this->user;
    }

    function roles(){
        return $this->roles;
    }

    function ad_role($AD_group, $role_assigned){
      if(isset($_SESSION[$AD_group]) and !in_array($role_assigned, $this->roles)){
        # grant the role 
        $this->roles[] = $role_assigned;
        # bump the last modified time on the session, if we haven't already done so on this particular auth handler
        if(!$this->session_updated){
            # touch the session with a read-and-close, to keep session activity alive
            session_start();//We only really need to read the session data. But we are going to open it for writing, then write to it IMMEDIATELY (to prevent session locking)
            session_write_close();//We are writing NOW, in order to remove the write lock on this session file AND to update the session file's modify time 
       
            # mark the session as having been bumped, so we don't unnecessarily bump it multiple times
            $this->session_updated = true;
        }
      } 
    }

    function token_role($auth_token, $role_assigned){
      if($auth_token == $this->user_token and !in_array($role_assigned, $this->roles)) $this->roles[] = $role_assigned;
    }

    // function dev_role($role_assigned){
    //     // used for a dev testing backdoor, with existing isDeveloper
    //     if($this->isDeveloper($local = true) and !in_array($role_assigned, $this->roles)) $this->roles[] = $role_assigned;  
    // }

    function user_token(){
      # dev only
      return $this->user_token;
    }
}

class Request{
  protected $method; # string
  protected $path; # string
  protected $json; # converted to associative array
  protected $params; # converted to associative array

  function __construct(){

    # allow for backend init of Request objects by using the server request method only when defined
    if(isset($_SERVER['REQUEST_METHOD']) and isset($_SERVER['REQUEST_URI'])){
      $this->method = $_SERVER['REQUEST_METHOD'];
      $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
      $uri_segments = explode('/',$uri);
      $api_index = array_search('api', $uri_segments);
      $this->path = implode('/', array_slice($uri_segments, $api_index + 1)); 

      # parse the request body into json, if possible
      $body = file_get_contents('php://input');
      $this->json = json_decode($body, true);

      # params are only meaningful if the GET method, but we can capture them in all cases via superglobal $_GET
      $this->params = $_GET;
    }
    
  }

  function method($val = null){
    if(isset($val)) $this->method = $val;
    return $this->method;
  }

  function path($val = null){
    if(isset($val)) $this->path = $val;
    return $this->path;
  }

  function json($val = null){
    if(isset($val)) $this->json = $val;
    return $this->json;
  }

  function params($val = null){
    if(isset($val)) $this->params = $val;
    return $this->params;
  }
}

class Endpoint{
  protected $resource;
  protected $children = [];


  function __construct($resource = null){
    # all children paths will end up with a resource object from a class extension of the Resource class (below)
    # the root endpoint (not actionable) will not have a resource object attached to it, though
    $this->resource = $resource;
  }

  function accept($verbs){
    # @verbs (array): ['verb_name'=>format]
    $valid = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    if(!is_array($verbs)) throw new Exception(" Accepted verbs must be an array. Use method name keyname and example request format as value.");

    foreach($verbs as $verb){
      if(in_array(strtoupper($verb), $valid)){
        $this->resource->accept_methods(strtoupper($verb));
      }else{
        throw new Exception($verb." is not a valid http verb.");
      }
    }
    
    return $this; # for chaining
  }

  function add($name, $resource = null){
    # creates a child endpoint
    if(array_key_exists($name, $this->children)) throw new Exception($name." child path already exists on this endpoint.");
    $this->children[$name] = new Endpoint($resource);
    # return the newly added child endpoint
    return $this->children[$name];
  }

  function children(){
    return $this->children;
  }

  # traverse the endpoint tree to find the target endpoint
  function find($path){
    # @path (string): path/to/endpoint => relative path to endpoint from this endpoint

    if(!is_string($path)){
      throw new Exception('endpoint path must be a string');
    } 

    # remove leading/trailing '/' from path
    $path = trim($path,'/'); 

    # identify segments
    $segments = explode('/', $path);

    # examine children paths for anything in the capture format {capture_var}
    $captures =[];
    foreach($this->children as $key=>$child){
      if(preg_match("/^{(.+)}$/" , $key, $captures) ) break; # if we find a child path matching {whatever} format, we will capture
    }

    # try to find first segment in path as a child of this endpoint
    if(array_key_exists($segments[0], $this->children)){
      $endpoint = $this->children[$segments[0]];
      # pop the first element off of segments
      array_shift($segments);

      if(count($segments) > 0){
        # echo "found next step of $path\n";

        # concat the remaining $segments array into a new $path string
        $path = implode('/', $segments);

        # call the child's find method, recursively
        return $endpoint->find($path);
      }else{
        # we have found the last endpoint segment, return this endpoint
        return $endpoint;
      }
    }else if(count($captures) > 0){
      # we have a capture point saved in this endpoint path
      $endpoint = $this->children[$captures[0]];
      # pop the first element off of segments
      array_shift($segments);

      if(count($segments) > 0){
        # echo "found next step of $path\n";

        # concat the remaining $segments array into a new $path string
        $path = implode('/', $segments);

        # call the child's find method, recursively
        return $endpoint->find($path);
      }else{
        # we have found the last endpoint segment, return this endpoint
        return $endpoint;
      }
    }else{
      http_response_code(404); # path not found
      exit("endpoint path not found");
    }
  }

  function do(Authentication $authentication, Request $request){
      $method = $request->method();
      if(!in_array($method, $this->resource->accept_methods())){
        if(strtolower($method) == 'options') {
            http_response_code(200);
        }else{
            http_response_code(405); #  method not allowed
        }
        exit("method {$method} not allowed");
        # throw new Exception('Http method attempted is not allowed by this endpoint.'); 
      }

      # pass the authentication on the resource that will be processing the request
      $this->resource->authentication($authentication);

      # pass the request to the resource that will be processing
      $this->resource->request($request);

      switch($method){
        case 'GET':
          $this->resource->get();
          break;
        case 'POST':
          $this->resource->post();
          break;
        case 'PUT':
          $this->resource->put();
          break;
        case 'PATCH':
          $this->resource->patch();
          break;
        case 'DELETE':
          $this->resource->delete();
          break;
        default:
          $this->resource->error(404, ['info'=>'requested operation not found']);
          break;
      }
  }

}

class Resource{
    protected $datasource;
    protected $authentication;
    protected $request;
    protected $accept_methods = []; # acceptable http methods for this endpoint
    protected $cache_dir = 'c:/tools/adminscripts/api_cache/';
    protected $show_cache = false;

    function __construct($datasource = null){
      # the datasource will often be a dbQueries object for interacting with databases, but this could reference AD or other datasources
      if(isset($datasource)) $this->datasource = $datasource;

      # extend the default cache path for the app we are working with
      $app_dir = explode('/', $_SERVER['REQUEST_URI'])[1].'/';
      $this->cache_dir .= $app_dir;
    }
 
    function accept_methods($new_method = null){
      $valid = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

      if(isset($new_method)){
          if(is_array($new_method)){
           # loop through array
           foreach($new_method as $verb){
            $verb = strtoupper($verb); # force uppercase
            if(in_array($verb, $valid) and !in_array($verb, $this->accept_methods)) $this->accept_methods[] = $verb;
           }
          }else{
            # or add singleton
            $verb = strtoupper($new_method);#force uppercase
            if(in_array($verb, $valid) and !in_array($verb, $this->accept_methods)) $this->accept_methods[] = $verb;
          }
      }

      return $this->accept_methods;
    }

    function authentication($authentication = null){
      # simple get/setter 
      if(isset($authentication)) $this->authentication = $authentication;
      # returns an array representation of the auth data
      $auth_array = [
        'auth_type'=>$this->authentication->auth_type(),
        'user'=>$this->authentication->user(),
        'roles'=>$this->authentication->roles()
      ];
      return $auth_array; 
    }

    function request($request = null){
      # simple get/setter 
      if(isset($request)) $this->request = $request;
      return $this->request; 
    }

    function request_path($key_names = []){
      # @key_names: (array) ['step1', 'step2', 'step3']
      # returns array of the request path components: ['path', 'to', 'endpoint'] or with keynames: ['path', 'to', 'endpoint', 'step1'=>'path', 'step2'=>'to', 'step3'=>'endpoint'] 

      # blow path string into array
      $path_array = explode('/', trim(strtolower($this->request->path()), '/') );

      # map the val in $key_names into keys for corresponding index on the path, if specified
      foreach($key_names as $index => $key){
        # the keyname needs to be a string, and the index in path array needs to exist
        if(is_string($key) and isset($path_array[$index])) $path_array[$key] = $path_array[$index]; 
      }
      
      return $path_array;
    }

    function request_fields($field_map){
      # used for reading request json into a array, based on field_map
      # field_map: (array 2D) ['required'=>['field_name'=>'description...'], 'optional'=>['field_name'=>'description...']]
      $fields = [];

      # required fields, look for each and add them if set, throw error if expected not found
      if(isset($field_map['required'])){
        foreach($field_map['required'] as $field_name=>$description){
          if(isset($this->request->json()[$field_name])){
            $fields[$field_name] = $this->request->json()[$field_name];
          }else{
            # a required field was not set
            $this->error(400, $field_map);
          }
        }
      }

      # optional fields, loop through all fields that were given, accept those we expect and throw an error if found not expected
        if(is_countable($this->request->json())){
            
            foreach($this->request->json() as $field_name=>$val){
                if(isset($field_map['optional']) and isset($field_map['optional'][$field_name])){
                # this is an expected field name, store its value
                $fields[$field_name] = $val;
                }else if(!(isset($field_map['required']) and isset($field_map['required'][$field_name]))){
                # we found a field that was not expected as an optional field, nor in the required fields
                $this->error(400, $field_map); 
                }
            }

        }
        
      return $fields;
    }

    function request_params(){
        return $this->request->params();
    }

    function access($roles){
      # @role (string or array): needs to be granted in $this->authorization()->roles() array
      # returns: bool if the accessing user has been granted at least one of the required role(s)
      if(is_array($roles)){
        foreach($roles as $role){
          # true as long as one of the allowed roles exists
          if(in_array($role, $this->authentication()['roles'])) return true;
        }
      }else{
        return in_array($roles, $this->authentication()['roles']); # bool
      }
    }

    function success(array $response){
        header('Content-type: application/json');//prepare to return json array
        http_response_code(200);
        echo json_encode($response); 
        exit();
    }
 
    function show_cache_info($show = true){
      # set whether we will show the cache info when getting cache
      $this->show_cache = $show;
      return $this; # for chaining
    }

    function set_cache(string $filepath, array $response){
      # filepath: (str) where we want to save the response (enforced .json filetype)
      # cache the response, json-encoded, so that we can retrieve it later without doing fresh data lookup/computations
      $path_info = pathinfo($filepath);
      $extension = $path_info['extension'] ?? null;
      if(strtolower($extension) !== 'json') throw new Exception ('invalid cache extension on path: '.$filepath);

      # set the cache filepath as the filename appended to the cache_dir for this app, if we referred to the cache as just a filename
      if($path_info['dirname'] == '.') $filepath = $this->cache_dir.$path_info['basename'];

      # set the file contents, as json encoded string
      return file_put_contents($filepath, json_encode($response));
    }

    function get_cache(string $filepath, int $time_limit = null){
      # filepath: (str) where to look for that cache json file
      # time_limit: (int) seconds that we want to consider this cache valid
      # return: (array) json decoded info (associative array)
      $path_info = pathinfo($filepath);
      $extension = $path_info['extension'] ?? null;
      if(strtolower($extension) !== 'json') throw new Exception ('invalid cache extension on path: '.$filepath);

      # set the cache filepath as the filename appended to the cache_dir for this app, if we referred to the cache as just a filename
      if($path_info['dirname'] == '.') $filepath = $this->cache_dir.$path_info['basename'];

      if(!file_exists($filepath)) return false; # the cache does not exist

      # check if the file is within alotted time limit
      $cache_age = time() - filemtime($filepath);
      if(isset($time_limit) and ($cache_age > $time_limit)){
        # remove the cache 
        unlink($filepath);
        # return cache unusable
        return false;
      } 

      # get decoded into associative array
      $cache_contents = json_decode(file_get_contents($filepath), true);

      if($this->show_cache) $cache_contents['cache'] = ['cache_age'=>$cache_age, 'max_age'=>$time_limit];

      return $cache_contents;
    }

    function clear_cache(string $filepath){
      # filepath: (str) where to look for that cache json file. We are going to unset the file
      $path_info = pathinfo($filepath);
      $extension = $path_info['extension'] ?? null;
      if(strtolower($extension) !== 'json') throw new Exception ('invalid cache extension on path: '.$filepath);

      # set the cache filepath as the filename appended to the cache_dir for this app, if we referred to the cache as just a filename
      if($path_info['dirname'] == '.') $filepath = $this->cache_dir.$path_info['basename'];

      # remove the cache file
      if(file_exists($filepath)){
        return unlink($filepath);
      }
      # if the file does not exist, then we did not remove it
      return false;
    }


    function error(int $code, array $info){
        header('Content-type: application/json');//prepare to return json array
        http_response_code($code);
        echo json_encode($info);
        exit();
    }

  # we will then extend this class with the get, post, patch, put, and/or delete methods as appropriate
}

?>
