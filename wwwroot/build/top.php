<?php /*Template Top*/
    require_once($_SERVER['DOCUMENT_ROOT'] . '/login/inc/sec.php'); //general - login security
    require_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/inc/sec.php"); //app specific - security
    include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/css/styles.php"); //app specific - stylesheets
    include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/inc/utility.php'); //general - php utility funcs for page building
    include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/inc/modals.php'); //general - modals, toasts, etc.
    # reportUsageStats('AppName');//executes func in the meta utility.php to record user usage of this app
?>