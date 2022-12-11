import {search_chips} from '/meta/vue/components/search-chips.js';

export const vue_datatable = Vue.component('vue-datatable', {
    template: '#vue-datatable-template',
    props: {
        search_suggestions:{
            // ['Example1', 'Example2'...]
            type: Array,
            default: function(){return []}
        }, 
        rows:{
            // Array of objects [{id: 0, first: 'Steve', last:'Spears'}, {id: 1, first: 'Doug', last:'Clelland'}, ]
            // row[i].actions: {'edit': bool, 'delete': bool, 'custom': [{'do': {{action-verb}}_item, 'icon':{{material-design-icons-id}} }] }
            type: Array,
            default: function(){return []}
        },
        rows_clickable: {
            type: Boolean,
            default: false
        },
        cols: {
            type: Array,
            default: function(){return []}
            /* cols: [
                {text: 'Mnemonic', align: 'start', value: 'mnemonic'},
                {text: 'ORI', value: 'ori'},
                {text: 'Role', value: 'role'},
                {text: 'Terminal', value: 'assigned_computer_name'},
                {text: 'Actions', value: 'actions', sortable: false}
            ], */
        },
        items_per_page: {
            default: 50
        },
        table_loading: {
            type: Boolean,
            default: false
        },
        search_ignore: {
            // ['table_id', 'last_modified_by']
            type: Array,
            default: function(){return []}  // search chips will ignore keys in this list in returned search matches
        },
        searching: {
            // will we show the search chips feature?
            type: Boolean, 
            default: true
        },

        // slide features:
        show_slide: {
            // will we show the slide feature at all?
            type: Boolean, 
            default: false
        }, 
        slide_items: {
            /* individual items can be of type string or object; 
             * if object, slide_item_value & slide_item_display are needed
             */ 
            type: Array,
            default: function(){return []} 
        }, 
        slide_item_value: {
            // if slide_items are not just strings, this is the object key to where we can find the value string
            default: null
        }, 
        slide_item_display: {
            // if slide_items are not just strings, this is the object key to where we can find the display string
            default: null
        }, 
        slide_btn_active_class: {
            default: 'primary white--text'
        },
        slide_info_text: {
            // optional info text that describes what the slide does
            default: null
        }, 
        slide_info_class: {
            // for styling optional slide info text
            default: null
        }
    },
    data: function() {
        return {
            // search_model is manipulated by search-chips child, passing back its results to this.update_filter
            search_model: [],

            // custom_icons is raw svg paths, that allows custom actions to define their icon by the keyname of it here
            custom_icons: {
                comment_plus_outline: "M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M11,6H13V9H16V11H13V14H11V11H8V9H11V6Z",
                comment_text_outline: "M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M6,7H18V9H6V7M6,11H15V13H6V11Z",
                comment_check_outline: "M9 22C8.45 22 8 21.55 8 21V18H4C2.9 18 2 17.11 2 16V4C2 2.89 2.9 2 4 2H20C21.11 2 22 2.9 22 4V16C22 17.11 21.11 18 20 18H13.9L10.2 21.71C10 21.9 9.75 22 9.5 22H9M10 16V19.08L13.08 16H20V4H4V16H10M15.6 6L17 7.41L10.47 14L7 10.5L8.4 9.09L10.47 11.17L15.6 6",
                comment_remove_outline: "M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10M9.41,6L12,8.59L14.59,6L16,7.41L13.41,10L16,12.59L14.59,14L12,11.41L9.41,14L8,12.59L10.59,10L8,7.41L9.41,6Z",
                square_edit_outline: "M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z",
                file_document_edit: "M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z",
                file_document_add: "M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.81C13.28 21.09 13 20.05 13 19C13 18.67 13.03 18.33 13.08 18H6V16H13.81C14.27 15.2 14.91 14.5 15.68 14H6V12H18V13.08C18.33 13.03 18.67 13 19 13S19.67 13.03 20 13.08V8L14 2M13 9V3.5L18.5 9H13M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z",
            }
        }
    },
    computed: {
        filtered_rows(){
            if(this.search_model.length > 0 && this.rows.length > 0){
                // if the search model has things to filter by
                return this.rows.filter(
                    row => {
                        return  Object.values(this.search_model).every( (search_term) => {
                            for (const property in row) {
                                try{
                                    if(!row[property]) continue; // ignore filtering by non-values
                                    if(this.search_ignore.indexOf(property) > -1) continue; // ignore properties that are listed in this instance of search_ignore
                                    // compare lowercase converted strings, if the row has a value in its model which includes the string partial of the search term
                                    const search_lower = search_term.toString().toLowerCase();
                                    if(row[property].toString().toLowerCase().includes(search_lower)) return true; // this row has a matching property value to at least one search term

                                }catch(error){
                                    console.log(error);
                                }
                            }
                        });
                    }
                )
            }
            // if the search_model has no search terms to filter by, return the unfiltered rows 
            return this.rows;
        }
    },
    methods: {
        update_filter(filter){
            this.search_model = filter
        },
        event_bubble(action){
            /* bubbles events emitted from children up to the root, for custom handling
             * event.do (string): name of the event to bubble up to the root, calling root.emit.do
             * event.payload (any): whatever we are passing up to the emit.do method on the root handler
             */
            this.$emit('item_actions', action)
        },
        row_clicked(item){

            this.$emit('item_actions', {do: 'row_clicked', payload: item})
        }
    }
});