<?php #### consumes and responds with json 
    $app_dir = explode('/', $_SERVER['REQUEST_URI'])[1];

    require_once($_SERVER['DOCUMENT_ROOT'] . '/meta/api/v1.php');
    require_once($_SERVER['DOCUMENT_ROOT'] . '/'. $app_dir . '/api/resources/index.php');
    # include_once("c:/tools/adminscripts/api_tokens/" . $app_dir . ".php"); # our tokens are stored in env file
   
    # # # # # # # # # # # # 
    # initialize api handler
    $api = new API_Handler();
    # # # # # # # # # # # # 
    
    # # # # # # # # # #
    # build endpoints:
    # # # # # # # # # #

    # example: $api->endpoints()->add('endpoint', new Resource($datasource))->accept(['GET']);


    # # # # # # # # #
    # set auth roles: 
    # # # # # # # # #

    # $api->authentication()->token_role(getenv('app_token'), 'admin');

    # # # # # # # # # # # 
    # execute the request
    $api->processRequest();
    # # # # # # # # # # # 



?>