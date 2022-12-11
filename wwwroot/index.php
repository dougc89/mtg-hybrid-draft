<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="author" content="Lake County Florida Sheriffs Office"/>
    <meta name="description" content="LCSO Intranet"/>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title> Template Title Here</title>
    <?php /*Template Version 4.2.2*/?>
    <?php $appDirectory = explode('/', $_SERVER['REQUEST_URI'])[1]; //will apply to all the app-specific includes ?>
    <?php require($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/top.php");//require security files therein ?>
</head>
<body class="thrColFixHdr transition-to-modern dark">
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/middle.php"); ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/bottom.php"); ?>
</body>
</html>