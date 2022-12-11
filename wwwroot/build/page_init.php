<?php /*Standard Page Loading Package for this App:*/
    $appFolder = explode('/', $_SERVER['REQUEST_URI'])[1];
    include_once($_SERVER['DOCUMENT_ROOT'] . '/login/inc/sec.php');
    include_once($_SERVER['DOCUMENT_ROOT'] . '/'. $appFolder .'/inc/sec.php');
    include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/inc/utility.php'); //general - php utility funcs for page building
?>