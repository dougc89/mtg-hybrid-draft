<script type='text/x-template' id='vue-datatable-template'>
<!-- https://vuetifyjs.com/en/components/data-tables/ -->

    <v-data-table 
        :loading='table_loading' 
        :items='filtered_rows' 
        :headers='cols' 
        :itemsPerPage='items_per_page'
        :multiSort='true'
        :footerProps='{itemsPerPageOptions:[10,50,-1]}'
        :class="{'rows_clickable': rows_clickable}"
        >

    <template v-slot:top>
        <search-chips v-if='searching' @filter='update_filter' v-bind="$props" class='mt-2'></search-chips>
        <div v-if="show_slide">
            <p v-if='slide_info_text' :class='slide_info_class'> {{slide_info_text}}</p>
            <v-slide-group 
                v-model='search_model'
                multiple show-arrows
            >
            <v-slide-item
                v-for="(slide_item, index) in slide_items"
                :key="'slide_item_'+index"
                :value="typeof slide_item == 'string' ? slide_item : slide_item[slide_item_value]"
                v-slot="{ active, toggle }"
            >
                <v-btn
                    @click="toggle"
                    :input-value="active"
                    class="mx-2"
                    :active-class="slide_btn_active_class"
                    depressed rounded        
                >
                    <span v-if="typeof slide_item == 'string'">
                        {{slide_item}}
                    </span>
                    <span v-else>
                        {{ slide_item[slide_item_display] }}  
                    </span>
                </v-btn>
            </v-slide-item>
                </v-slide-group>
        </div>
    </template>

    <template v-slot:item='{item, headers, index}'>
        <tr @click='row_clicked(item)'>
            <td v-for='(header, header_index) in headers' :key="index+'_row_col_'+header_index">

                <div v-if="header.value != 'actions'" v-html='item[header.value]'></div>
                <div v-else>
                    <v-btn fab x-small             
                        v-if='item.actions'
                        v-for='(action, action_index) in item.actions' 
                        :key="'datatable_custom_action'+action_index" 
                        :color="action.color ? action.color: 'primary'"             
                        :class="action.class ? action.class : 'ml-2'"
                        :title="action.help" 
                        @click.stop='event_bubble({do: action.emit, payload: item})' 
                    >
                        <v-icon  
                            v-text="custom_icons[action.icon] ? custom_icons[action.icon]: action.icon"
                        ></v-icon>
                    </v-btn>
                </div>

            </td>
        </tr>
    </template>

        
    </v-data-table>
</script>

<!-- include the component's script module -->
<script type='module' src='/meta/vue/components/vue-datatable.js'></script>