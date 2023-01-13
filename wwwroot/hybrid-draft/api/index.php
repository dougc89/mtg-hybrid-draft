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

    # example: 
    # $api->endpoints()->add('packs', new Packs())->accept(['GET', 'POST']);

    $drafts = $api->endpoints()->add('drafts', new Drafts())->accept(['GET']); // search by set code
    $draft_id = $drafts->add('{id}', null);

    $player = $draft_id->add('players', null)->add('{id}', null); # specific to the draft
    # packs by a player in the draft
    $packs = $player->add('packs', new Packs())->accept(['GET', 'POST']); # for listing packs and opening packs
    $pack_id = $packs->add('{id}', new Packs())->accept(['PATCH']); # for picking cards

    # cards by a player in the draft
    $cards = $player->add('cards', new Cards())->accept(['GET']); # for listing cards owned by this player

    # # # # # # # # #
    # set auth roles: 
    # # # # # # # # #

    # $api->authentication()->token_role(getenv('app_token'), 'admin');

    # # # # # # # # # # # 
    # execute the request
    $api->processRequest();
    # # # # # # # # # # # 



?>