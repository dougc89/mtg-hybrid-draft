<!-- Template Bottom -->
<?php 
//SECURITY (only actually gets included once, and should have been earlier; this is here "just-in-case")
    require_once($_SERVER['DOCUMENT_ROOT'] . '/login/inc/sec.php'); //general - login security
    require_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/inc/sec.php"); //app specific - security
?>

<?php 
//Javascript includes:
    include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/js/standard_js-package.php'); # standard JS 

    echo "<script type='text/javascript' src='/meta/vue/v2/vue.dev.js'></script>";
    echo "<script type='text/javascript' src='/meta/vue/vuetify/vuetify.min.js'></script>";

    include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/components/templates.php"); # app specific components templates
    echo "<script type='module' src='/{$appDirectory}/components/scripts.js'></script>"; # app-specific initial event handlers (initialize)
    echo "<script type='module' src='/{$appDirectory}/js/ui.js'></script>"; # app-specific initial event handlers (initialize)
?>

<?php
    if(!isDeveloper($local=true)) include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/inc/footerLinks.php'); //legacy
?>