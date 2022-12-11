<?php

# include the x-template html for meta components
include_once($_SERVER['DOCUMENT_ROOT'].'/meta/vue/templates/app-navigation-bar.php');

# include the x-template html for app-specific components
include_once(__DIR__.'/examples/example-card/template.php');
include_once(__DIR__.'/examples/example-modal/template.php');


include_once(__DIR__.'/mtg-card/template.php');