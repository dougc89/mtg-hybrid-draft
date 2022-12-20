<?php

class Packs extends Resource{

    # Pass the contruction up to the parent (Resource)
    function __construct($datasource = null){
        parent::__construct($datasource);
    }

    function get(){
        if(!$this->access('view') and !$this->access('admin')) $this->error(401, ['roles'=>$this->authentication->roles()]);


        # prepare sql query
        $qry = 'table_name where not(removed = 1)';

        # read the db
        $records = $this->datasource->select($qry);

        # 404 if no records found
        if(!count($records)) $this->error(404, ['records'=>$records]);
        
        # return the results
        $this->success(['records'=>$records]);

    }

    function post(){
        
        # check permissions:
        # if(!$this->access('admin')) $this->error(401, ['roles'=>$this->authentication->roles()]);

        # map out expected/accepted fields
        $field_map = [
            'required'=>['user'=>'user id of the user making the change'], 
            'optional'=>[]
        ];

        $vals = $this->request_fields($field_map);

        $new_pack = shell_exec(escapeshellcmd('py c:\\github\\mtg-hybrid-draft\\data\\add_pack.py -u '.$vals['user']));
        # $new_pack = shell_exec('py -v 2>&1');
        $this->success(['pack'=>$new_pack]);
    }

    function patch(){
        
        # check permissions:
        if(!$this->access('admin')) $this->error(401, ['roles'=>$this->authentication->roles()]);

        # read request path for target
        $id = $this->request_path(['path_to', 'id'])['id'];

        # map out expected/accepted fields
        $field_map = [
            'required'=>[], 
            'optional'=>[]
        ];

        # read the json fields incoming
        $vals = $this->request_fields($field_map);

        # filter by for target record
        $where = " where id = :id ";
        $where_vals = ['id'=> $id];

        # write to the database
        $updated = $this->datasource->update("update record #{$id}", 'table_name', $vals, $where, $where_vals);

        # return the inserted
        if($updated){
            $this->success(['updated'=>$updated]);
        }else{
            $this->error(500, ['error'=>'db update failed']);
        }

    }

    function delete(){
        
        # check permissions:
        if(!$this->access('admin')) $this->error(401, ['roles'=>$this->authentication->roles()]);

        # read request path for target
        $id = $this->request_path(['path_to', 'id'])['id'];

        # setting the record as removed
        $vals = ['removed'=>1];

        # filter by for target record
        $where = " where id = :id ";
        $where_vals = ['id'=> $id];

        # write to the database
        $removed = $this->datasource->update("Deleting Record #{$id}", 'table_name', $vals, $where, $where_vals);

        # return the successful db change
        if($removed){
            $this->success(['removed'=>$removed]);
        }else{
            $this->error(500, ['error'=>'db update failed']);
        }

    }

}

?>