<?php

class Cards extends Resource{

    # Pass the contruction up to the parent (Resource)
    function __construct($datasource = null){
        parent::__construct($datasource);
    }

    function get(){

        # read request path for target
        $req_path = $this->request_path(['drafts', 'draft_id', 'players', 'player_id', 'packs']);

        $draft_id = $req_path['draft_id'] ?? null;
        $player_id = $req_path['player_id'] ?? null;

        if(!isset($draft_id) or !isset($player_id)) $this->error(400, ['req_path'=>['drafts', 'draft_id', 'players', 'player_id', 'packs']]);

        $cmd = "py c:\\github\\mtg-hybrid-draft\\data\\get_cards.py -u {$player_id} -d {$draft_id} ";
        $cards = shell_exec(escapeshellcmd($cmd));
        $this->success(['cards'=>json_decode($cards, true)]);

    }

    function post(){
        
        # check permissions:
        if(!$this->access('admin')) $this->error(401, ['roles'=>$this->authentication->roles()]);

        # map out expected/accepted fields
        $field_map = [
            'required'=>[], 
            'optional'=>[]
        ];

        # read the json fields incoming
        $vals = $this->request_fields($field_map);

        # write to the database
        $inserted = $this->datasource->insert('add a new record', 'table_name', $vals);

        # return the inserted
        if($inserted){
            $this->success(['inserted'=>$inserted]);
        }else{
            $this->error(500, ['error'=>'db insert failed']);
        }

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