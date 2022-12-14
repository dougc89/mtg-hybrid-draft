<?php

class Packs extends Resource{

    # Pass the contruction up to the parent (Resource)
    function __construct($datasource = null){
        parent::__construct($datasource);
    }

    function get(){

        # map out expected/accepted fields
        $params = $this->request_params();
        # $this->success(['params'=>$params]);

        if(!isset($params['draft'])) $this->error(400, ['?draft={draft_id} is a required param']);
        if(!isset($params['user'])) $this->error(400, ['?user={user_id} is a required param']);

        $cmd = "py c:\\github\\mtg-hybrid-draft\\data\\get_packs.py -u {$params['user']} -d {$params['draft']} ";
        $packs = shell_exec(escapeshellcmd($cmd));
        # $new_pack = shell_exec('py -v 2>&1');
        $this->success(['packs'=>json_decode($packs, true)]);
    }

    function post(){

        # map out expected/accepted fields
        $field_map = [
            'required'=>[
                'draft_id'=>'_id for the target draft',
                'user'=>'user id of person opening pack',
                'cards'=>'list of multiverse_ids'], 
            'optional'=>[]
        ];

        $vals = $this->request_fields($field_map);

        $new_pack = shell_exec(escapeshellcmd("py c:\\github\\mtg-hybrid-draft\\data\\add_pack.py -u {$vals['user']} -d {$vals['draft_id']} -c ".json_encode($vals['cards'])));
        # $new_pack = shell_exec('py -v 2>&1');
        $this->success(['pack'=>json_decode($new_pack, true)]);
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