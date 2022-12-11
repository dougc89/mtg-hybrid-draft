<?php /*****  App specific security  *****/
if (isset($_SESSION["LCSO_WEB"])){//These security variables are simply not set in the $_SESSION variable if they are not a part of that AD security group
    $view = true;
    if(isset($_SESSION["LCSO_IT"])){
        $admin = true;//might not need to know who is an admin, but recording it here...
    }else{
        $admin = false;
    }
}else{
    $view = false;
    $admin = false;
    die("Access denied. You may need to <a class='transition-to-modern mx-1' href='/'>log back in</a> to view this page, if your session has expired.");
}

?>