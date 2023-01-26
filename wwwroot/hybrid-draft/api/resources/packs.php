<?php

class Packs extends Resource{

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

        $cmd = "py c:\\github\\mtg-hybrid-draft\\data\\get_packs.py -u {$player_id} -d {$draft_id} ";
        $packs = shell_exec(escapeshellcmd($cmd));
        # $new_pack = shell_exec('py -v 2>&1');
        $this->success(['packs'=>json_decode($packs, true)]);
    }

    function post(){

        # read request path for target
        $req_path = $this->request_path(['drafts', 'draft_id', 'players', 'player_id', 'packs']);

        $draft_id = $req_path['draft_id'] ?? null;
        $player_id = $req_path['player_id'] ?? null;

        if(!isset($draft_id) or !isset($player_id)) $this->error(400, ['req_path'=>['drafts', 'draft_id', 'players', 'player_id', 'packs']]);

        # map out expected/accepted fields
        $field_map = [
            'required'=>[
                'cards'=>'list of multiverse_ids'], 
            'optional'=>[]
        ];

        $vals = $this->request_fields($field_map);
        $temp_id = sha1(time());
        file_put_contents("c:\\github\\mtg-hybrid-draft\\data\\hybrid-draft\\pack_cards_temp\\{$temp_id}", json_encode($vals['cards']));
        $cmd = escapeshellcmd("py c:\\github\\mtg-hybrid-draft\\data\\add_pack.py -u {$player_id} -d {$draft_id} -c {$temp_id}");
        $new_pack = shell_exec($cmd);
        # $new_pack = shell_exec('py -v 2>&1');
        $this->success(['pack'=>json_decode($new_pack, true), 'cmd'=>$cmd, 'cmd_length', strlen($cmd)]);
    }

    function patch(){
        
        # read request path for target
        $req_path = $this->request_path(['drafts', 'draft_id', 'players', 'player_id', 'packs', 'pack_id']);

        $draft_id = $req_path['draft_id'] ?? null;
        $player_id = $req_path['player_id'] ?? null;
        $pack_id = $req_path['pack_id'] ?? null;

        if(!isset($draft_id) or !isset($player_id) or !isset($pack_id)) $this->error(400, ['req_path'=>['drafts', 'draft_id', 'players', 'player_id', 'packs', 'pack_id']]);

        # map out expected/accepted fields
        $field_map = [
            'required'=>[
                'card'=>'multiverse_id of selected card'], 
            'optional'=>[]
        ];

        $vals = $this->request_fields($field_map);

        $cmd = "py c:\\github\\mtg-hybrid-draft\\data\\pick_card.py -u {$player_id} -p {$pack_id} -c {$vals['card']}";
        $updated_pack = shell_exec(escapeshellcmd($cmd));
        $this->success(['pack'=>json_decode($updated_pack, true), 'cmd'=>$cmd]);
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