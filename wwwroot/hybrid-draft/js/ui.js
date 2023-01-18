
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


            // tab titles (for app-navigation-bar)
            tabs: ['Player', 'Pack Opening', 'Card Selection'],
            hidden_tabs: ['Player', 'Pack Opening', 'Card Selection'],
            tab: 0,

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
            cracking_pack: false,

            card_search: [], // results from scryfall

            // info about the draft
            draft: null,

            // active player name and id
            active_player: null,
            player_packs: [], // packs "held" by this player
            player_cards: [], // cards owned by this player


        }
    },
    computed:{

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
        this.get_drafts(urlParams.get('set').toUpperCase())
    },

    methods: {
        async search_cards(set, search){
            console.log('searching with name: ',search)
            let name_qry =  search ? `+${search}` : ''
            let res = await $.get('https://api.scryfall.com/cards/search?q=set%3A'+set+name_qry)
            this.card_search = res.data
        },
        async crack_pack(){
            if(this.cracking_pack){
                // prevent duplicates
                console.log('cracking pack already...')
            }else{
                this.cracking_pack = true
                var pack_cards = []
                var set = this.draft.set // BRO, WAR, etc

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
                console.log('new pack', pack_cards)

                // send to db
                let res = $.post(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/packs`, JSON.stringify({'cards':pack_cards}))
                console.log(res)

                // refresh the player and their stuff
                this.get_player_stuff()
                this.cracking_pack = false
            }
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
        },

        async get_drafts(set_code){
            let response = await $.get(`/hybrid-draft/api/drafts?set=${set_code}`)
            console.log(response)
            // use the first draft returned
            this.draft = response.drafts[0]

            // set the tab automatically
            this.auto_tab()
        },

        async select_player(player_info){
            
            this.active_player = player_info
            this.get_player_stuff()

        },

        async get_player_stuff(){
            // get the cards and packs belonging to this player
            await this.get_player_cards()
            await this.get_player_packs()
            this.auto_tab()
        },


        async get_player_cards(){
            console.log('getting cards for', this.active_player._id)
            let response = await $.get(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/cards`)
            console.log(response)
            this.player_cards = response.cards
            // should auto-progress the tab from computed
            
        },

        async get_player_packs(){
            console.log('getting packs for', this.active_player._id)
            let response = await $.get(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/packs`)
            console.log(response)
            this.player_packs = response.packs
        },

        auto_tab(){
            if(!this.draft || !this.active_player){
                // the first tab is for selecting a player
                this.tab = 0
            }else if(this.player_packs.length < 1 && this.player_cards.length % 15 == 0 && this.player_cards.length < 15*this.draft.num_packs){       
                // pack opener  
                this.tab = 1
            }else{
                // card selection
                this.tab = 2
            }
        }
    }

});


