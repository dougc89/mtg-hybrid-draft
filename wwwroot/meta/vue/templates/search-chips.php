<script type='text/x-template' id='search-chips-template'>

    <v-combobox class='mx-4' label="Search:" multiple  hide-selected :hide-no-data='false' 
      deletable-chips  :items="search_suggestions"
      :menu-props ="{closeOnContentClick:true}" :clearable='true'
      small-chips  validate-on-blur  @change="do_search" ref='the_combobox'>
    </v-combobox>
    
</script>

<!-- include the component's script module -->
<script type='module' src='/meta/vue/components/search-chips.js'></script>