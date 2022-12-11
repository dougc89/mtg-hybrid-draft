<?php

class Vue_Templates{
    protected $templates_list = [];
    function __construct(Array $templates_list){
        # $templates_list: array of component names, to match vue templates (.php) files for inclusion
        $this->templates_list = $templates_list;
        $this->get_templates();
    }

    function get_templates(){
        foreach($this->templates_list as $template_name){
            # check if this template has any dependencies that were not included in the specified list
            $this->check_dependency($template_name);
            # echo $_SERVER['DOCUMENT_ROOT'] . "/meta/vue/templates/{$template_name}.php";
            include_once($_SERVER['DOCUMENT_ROOT'] . "/meta/vue/templates/{$template_name}.php");
        }
    }

    function add_dependency($dependency_name){
        # check that this dependency was not already listed in templates to be added, include it now
        if(!in_array($dependency_name, $this->templates_list)) include_once($_SERVER['DOCUMENT_ROOT'] . "/meta/vue/templates/{$dependency_name}.php");
        # recursively check if there are nested dependencies for this dependency
        $this->check_dependency($dependency_name);
    }

    function check_dependency($template_name){
        # if certain components have dependent components, ensure that their template <script type='x-template'> gets included, or vue will not know how to register that component
        switch($template_name){
            case 'vue-datatable':
                $this->add_dependency('search-chips');
                break;
        }
    }
}

?>
