export const search_chips = Vue.component('search-chips', {
    template: '#search-chips-template',
    vuetify: new Vuetify(),
    props: {
        search_suggestions:{
            // ['Example1', 'Example2'...]
            type: Array,
            default: function(){return []}
        }, 
        rows:{
            // Array of objects [{id: 0, first: 'Steve', last:'Spears'}, {id: 1, first: 'Doug', last:'Clelland'}, ]
            type: Array,
            default: function(){return []}
        }
    },
    data: function() {
        return {
            search_model: []
        }
    },
    methods: {
        do_search (vals) {
            // store the search model
            this.search_model = vals;
            // pass the new search model back to the datatable
            this.$emit('filter', this.search_model);
            // close the selection of search suggestion (v-combobox) that opens automatically on change otherwise
            this.$refs['the_combobox'].blur();
        }
    }

});