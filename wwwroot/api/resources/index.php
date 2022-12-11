<?php
# define datasource
include('c:/tools/adminscripts/PDO_config.php');
$odbcName = '??';
$credentials = $GLOBALS['PDO_config'][$odbcName];//uses the $GLOBALS superglobal to access the $PDO_config 2D array loaded above, then the interior array for connection-specific credentials           
$PDO = new PDO('odbc:'.$odbcName, $credentials['username'], $credentials['password']);//references an odbc connection on the web server
$datasource = new dbQueries($PDO, $logTable = null);//references a class from /meta/inc/utility.php | passes in PDO connection && Schema.Table name for where to log database actions
