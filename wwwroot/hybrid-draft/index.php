<!DOCTYPE html>
<html>
<head>
    <title> MTG Hybrid Draft</title>
    <?php $appDirectory = explode('/', $_SERVER['REQUEST_URI'])[1]; //will apply to all the app-specific includes ?>
    <?php require($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/top.php");//require security files therein ?>
</head>
<body class="thrColFixHdr transition-to-modern dark">
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/middle.php"); ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/build/bottom.php"); ?>
</body>
</html>