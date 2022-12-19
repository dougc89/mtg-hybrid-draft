
/*Call factory functions from meta.js*/
// we are not "navigating" by ajax anymore... load data and use vue to manipulate DOM // const navigation = NAVIGATION('.row.sub-content');


// meta components
import {app_navigation} from '/meta/vue/components/app-navigation-bar.js'

// app-specific components
import example_card from '../components/examples/example-card/script.js';
import example_modal from '../components/examples/example-modal/script.js';

const ui = new Vue({
    el: ".app-container",
    vuetify: new Vuetify({ theme: { dark: false } }),
    data: function(){
        return {
            // index of the open tab (build/middle)
            tab: 0,

            // tab titles (for app-navigation-bar)
            tabs: ['Example'],

            help_articles: [
                // {title: 'Adding Notes to On-call group', href:'https://lcso.freshservice.com/a/solutions/articles/17000078517'}, // https://lcso.freshservice.com/a/solutions/articles/17000078522
                // {title: 'IT Contact Survey', href:'https://lcso.freshservice.com/a/solutions/articles/17000079886'},
                // {title: 'Managing On-call Group Members', href:'https://lcso.freshservice.com/a/solutions/articles/17000078528'},
                // {title: 'Scheduling Group Members', href:'https://lcso.freshservice.com/a/solutions/articles/17000078522'},
            ], 

            // search for cards names
            search_text: null,
            // toggle on/off to prevent oversending search queries while typing
            search_typing: false, 

            cards: [],
            pack_cards: [],


        }
    },
    mounted(){
        
        // read query string, to potentially load page state from it
        var urlParams = new URLSearchParams(window.location.search);

        if(urlParams.has('token')){
            // for dev testing only
            $.ajaxSetup({
               'headers': {'Authorization': `Bearer ${urlParams.get('token')}`}
            });
        } 

        // call the init method
        this.get_cards()
    },
    methods: {
        async get_cards(search_name){
            console.log('searching with name: ',search_name)
            let name_qry =  search_name ? `+${search_name}` : ''
            let res = await $.get('https://api.scryfall.com/cards/search?q=set%3ABRO'+name_qry)
            this.cards = res.data
        },
        add_to_pack(multiverse_id){
            // add the card to the pack, init who owns it
            this.pack_cards.unshift({
                multiverse_id: multiverse_id,
                owned_by: null,
            })
            console.log(this.pack_cards)
        },
        search_with_delay(){
            this.get_cards(this.search_text)
            // this.search_typing = true
            // setTimeout(function(self){ self.search_typing = false}, 500, this)
            // setTimeout(function(self){ if(!self.search_typing){ self.get_cards(self.search_text)}else{console.log('still typing')}}, 1000, this)
        }
    }

});


