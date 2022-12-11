
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

            cards: [],

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
        async get_cards(){

            let res = await $.get('https://api.scryfall.com/cards/search?q=set%3ABRO')
            for(let card in res.data){
                console.log(res.data[card])
                if(this.cards.length < 100) this.cards.push(res.data[card]['multiverse_ids'][0])
            }
            
        }
    }

});


