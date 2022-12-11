<!-- Template Middle -->
<?php //SECURITY (only actually gets included once, and should have been earlier; this is here "just-in-case")
    require_once($_SERVER['DOCUMENT_ROOT'] . '/login/inc/sec.php'); //general - login security
    require_once($_SERVER['DOCUMENT_ROOT'] . "/{$appDirectory}/inc/sec.php"); //app specific - security
    include_once($_SERVER['DOCUMENT_ROOT'] . '/meta/inc/IEwarning.php');/*warns that this app contains features not supported in IE, container is positioned relative to hold the IE warning inside it*/    
?>


<div class="modern appName-page"><!-- Note: this class for the appName is relevant to css styling (children of this .appName-page -->
    <div id="header"><!--legacy id while we have the legacy dropdown menu-->
        <?php if(!isDeveloper($local=true)) include_once($_SERVER['DOCUMENT_ROOT'] . '/inc/ddmenu.php'); ?>
    </div>

    <v-app class="app-container card dark pb-5">

    <app-navigation-bar
        home_url='/app_name'
        v-model='tab'
        :tabs='tabs'
        :help_articles='help_articles' v-cloak
        >APP NAME</app-navigation-bar>

    <div class='mx-3 sub-content my-4'>

    <v-tabs-items v-model="tab" dark>
        <v-tab-item key="example_1">

        </v-tab-item>
        <v-tab-item key="example_2">

        </v-tab-item>
    </v-tabs-items>

    </div><!-- end .sub-content -->

    </v-app><!-- end .app-container -->
</div><!-- end #container -->