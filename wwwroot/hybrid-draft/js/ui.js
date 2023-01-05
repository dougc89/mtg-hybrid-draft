
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
        this.crack_pack('bro')
    },
    methods: {
        async get_cards(set, search){
            console.log('searching with name: ',search)
            let name_qry =  search ? `+${search}` : ''
            let res = await $.get('https://api.scryfall.com/cards/search?q=set%3A'+set+name_qry)
            this.cards = res.data
        },
        async crack_pack(set){
            var pack_cards = []
            // config might change for some sets, but this is the normal distribution
            var config = {
                'rarity:mythic': 0,
                'rarity:rare': 1,
                '-type:/Basic Land/+rarity:common': 10, // basic lands list as common on scryfall, we want non-basic commons
                'rarity:uncommon': 3,
                'type:/Basic Land/': 1,
                'type:land+rarity:common': 0 
                }

            if(Math.random() < 0.125){
                // 1:8 chance to include mythic instead of rare
                config['rarity:mythic'] = 1
                config['rarity:rare'] = 0
            }

            if(Math.random() < 0.167){
                //1:6 chance to replace the basic land with another common land (such as common dual land)
                config['type:/Basic Land/'] = 0
                config['type:land+rarity:common'] = 1
            }

            console.log('config', config)

            for(const key in config){
                if(config[key] > 0){
                    // get the cards matching this search query
                    let cards = await $.get(`https://api.scryfall.com/cards/search?q=set%3A${set}+${key}`)
                    // push the quantity in config into the pack cards, by random selection
                    for(let i=0; i<config[key]; i++){
                        // pick random cards from the results
                        let card_data = cards.data[Math.floor(Math.random()*cards.data.length)]
                        // picks a random art version from multiverse id's associated
                        pack_cards.push(card_data.multiverse_ids[Math.floor(Math.random()*card_data.multiverse_ids.length)])
                    }
                }
            }

            // shuffle the cards 
            pack_cards = pack_cards.sort((a, b) => 0.5 - Math.random())

            // store then in rendered data
            this.pack_cards = pack_cards
        },
        add_to_pack(multiverse_id){
            // add the card to the pack, init who owns it
            this.pack_cards.unshift(multiverse_id)
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


