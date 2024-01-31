function _ajax_request(url, data, callback, type, method) {
    if ($.isFunction(data)) {
        callback = data;
        data = {};
    }
    return $.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        error: function(response){
            console.log('error status code:', response.status)},
        dataType: type
        });
}

$.extend({
    put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
    },
    patch: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PATCH');
    },
    delete: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
    }
});

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
            card_list_text: null, // for copy/paste << http (only, not https) does not trust clipboard access for navigator.clipboard.writeText
            
            state: 0,
            scryfall_calls: 0,
            // track responses from api to minimize traffic load
            scryfall_info: {},
            player_card_info: [],
            copy_toast: false,
        }
    },
    computed:{


    },
    watch:{
        scryfall_calls: {
            handler(val){
                // compute player card info again, since a change occured in scryfall info collection
                this.player_card_info = this.player_cards.map( el => el = {
                        multiverse_id: el,
                        card_info: this.scryfall_info[el]
                    })//.sort((a,b) => (a && b && a.card_info.name > b.card_info.name))
            }
        },
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
            // console.log('searching with name: ',search)
            let name_qry =  search ? `+${search}` : ''
            let res = await $.get('https://api.scryfall.com/cards/search?q=set%3A'+set+name_qry)
            this.card_search = res.data
        },
        async crack_pack(){
            await this.$nextTick()
            if(this.cracking_pack){
                // prevent duplicates
                // console.log('cracking pack already...')
            }else{
                this.cracking_pack = true
                var pack_cards = []
                var set = this.draft.set // BRO, WAR, etc

                // config might change for some sets, but this is the normal distribution
                if(set == 'MOM'){
                    var config = [
                        // special (battle) [0]
                        {
                            uri: 'type:battle',
                            quantity: 1
                        },
                        //mythic: [1]
                        {
                            uri: 'rarity:mythic',
                            quantity: 0
                        },
                        //rare: [2]
                        {
                            uri: 'rarity:rare',
                            quantity: 1
                        },
                        // uncommon: [3]
                        {
                            uri: 'rarity:uncommon',
                            quantity: 3
                        },

                        // common (generic): [4]
                        {
                            uri: '-type:land+rarity:common',
                            quantity: 5
                        },
                        // common_creature_w: [5]
                        {
                            uri: '-type:land+rarity:common+color=W',
                            quantity: 1  
                        },
                        //common_creature_u: [6]
                        {
                            uri: '-type:land+rarity:common+color=U',
                            quantity: 1  
                        },
                        //common_creature_b: [7]
                        {
                            uri: '-type:land+rarity:common+color=B',
                            quantity: 1  
                        },
                        // common_creature_r: [8]
                        {
                            uri: '-type:land+rarity:common+color=R',
                            quantity: 1  
                        },
                        //common_creature_g: [9]
                        {
                            uri: '-type:land+rarity:common+color=G',
                            quantity: 1  
                        },
                        // common non-basic land: [10]
                        {
                            uri: 'type:land+rarity:common+-type:basic',
                            quantity: 1
                        }
                    ]
                }else{
                    var config = [
                        // special (n/a) [0]
                        {
                            uri: 'type:{special rules go here}',
                            quantity: 0
                        },
                        //mythic: [1]
                        {
                            uri: 'rarity:mythic',
                            quantity: 0
                        },
                        //rare: [2]
                        {
                            uri: 'rarity:rare',
                            quantity: 1
                        },
                        // uncommon: [3]
                        {
                            uri: 'rarity:uncommon',
                            quantity: 5
                        },

                        // common (generic): [4]
                        {
                            uri: '-type:land+rarity:common',
                            quantity: 2
                        },
                        // common_creature_w: [5]
                        {
                            uri: '-type:land+rarity:common+color=W',
                            quantity: 1  
                        },
                        //common_creature_u: [6]
                        {
                            uri: '-type:land+rarity:common+color=U',
                            quantity: 1  
                        },
                        //common_creature_b: [7]
                        {
                            uri: '-type:land+rarity:common+color=B',
                            quantity: 1  
                        },
                        // common_creature_r: [8]
                        {
                            uri: '-type:land+rarity:common+color=R',
                            quantity: 1  
                        },
                        //common_creature_g: [9]
                        {
                            uri: '-type:land+rarity:common+color=G',
                            quantity: 1  
                        },
                        // common non-basic land: [10]
                        {
                            uri: 'type:land+rarity:common+-type:basic',
                            quantity: 1
                        }
                    ]
                }

                if(Math.random() < 0.125){
                    // 1:8 chance to include mythic instead of rare
                    config[1].quantity = 1
                    config[2].quantity = 0
                }

                // console.log('config', config)


                for(const [index, card] of config.entries()){
                    if(card.quantity > 0){
                        // get the cards matching this search query
                        let cards = await $.get(`https://api.scryfall.com/cards/search?q=set%3A${set}+${card.uri}`)
                        // console.log('compare', cards.total_cards, cards.data.length)
                        // push the quantity in config into the pack cards, by random selection
                        for(let i=0; i<card.quantity; i++){
                            // pick random cards from the results
                            let card_added = false
                            let cards_attempted = 0
                            while(!card_added){
                                // track how many we try to put in the pack
                                cards_attempted++
                                let card_data = cards.data[Math.floor(Math.random()*cards.data.length)]
                                // checks that the card isn't already in the pack
                                if(pack_cards.find(x => x == card_data.id) && cards_attempted < cards.data.length){
                                    // skip this card and try again
                                    // console.log('duplicate prevented', card_data)
                                    continue
                                }else{
                                    // add the pack and close the while loop
                                    pack_cards.push(card_data.id) // multiverse_ids[Math.floor(Math.random()*card_data.multiverse_ids.length)])
                                    card_added = true

                                    // adjust the quantity of other rarity if the special card was selected
                                    if(index < 1){
                                        if(card_data.rarity == 'mythic' || card_data.rarity == 'rare'){
                                            // set both rare and mythic as consumed by this choice
                                            config[1].quantity = 0
                                            config[2].quantity = 0
                                        }else if(card_data.rarity == 'uncommon'){
                                            // reduce uncommon selection by 1
                                            config[3].quantity--
                                        }else{
                                            // reduce common selection by 1
                                            config[4].quantity--
                                        }
                                    }

                                }
                            }
                        }

                    }
                }

                // shuffle the cards 
                // pack_cards = pack_cards.sort((a, b) => 0.5 - Math.random())
                // console.log('new pack', pack_cards)

                // send to db
                // console.log('pack cards', pack_cards)
                let res = await $.post(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/packs`, JSON.stringify({'cards':pack_cards}))
                // console.log(res)

                // refresh the player and their stuff
                this.get_player_stuff()

            }
        },
        add_to_pack(multiverse_id){
            // add the card to the pack, init who owns it
            this.pack_cards.unshift(multiverse_id)
            // console.log(this.pack_cards)
        },
        search_with_delay(){
            this.get_cards(this.search_text)
            // this.search_typing = true
            // setTimeout(function(self){ self.search_typing = false}, 500, this)
            // setTimeout(function(self){ if(!self.search_typing){ self.get_cards(self.search_text)}else{// console.log('still typing')}}, 1000, this)
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

            // start the autorefresh cycle
            this.auto_refresh_packs()

        },

        async get_player_stuff(){
            // get the cards and packs belonging to this player
            await this.get_player_cards()
            await this.get_player_packs()
            this.state++
            this.auto_tab()
        },


        async get_player_cards(){
            // console.log('getting cards for', this.active_player._id)
            let response = await $.get(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/cards`)
            // console.log(response)
            this.player_cards = response.cards
            this.scryfall_calls++
            // should auto-progress the tab from computed
            
        },

        async get_player_packs(){
            // console.log('getting packs for', this.active_player._id)
            let response = await $.get(`/hybrid-draft/api/drafts/${this.draft._id}/players/${this.active_player._id}/packs`)
            // console.log(response)
            this.player_packs = response.packs
        },

        async auto_tab(){
            if(!this.draft || !this.active_player){
                // the first tab is for selecting a player
                this.tab = 0
            }else if( (this.draft.type == 'solo' && !this.player_packs.length && this.player_cards.length < 49) || (this.draft.type != 'solo' && this.player_cards.length % 15 == 0 && this.player_cards.length < 15*this.draft.num_packs && !(this.player_packs.length > 0 && this.player_packs.find(el => el.cards_remaining == 15)))){       
                // pack opener  
                this.tab = 1
            }else{
                // card selection
                this.tab = 2
            }

            // reset the auto pack
            await this.$nextTick()
            this.cracking_pack = false
        },

        track_scryfall_calls(args){
            this.scryfall_info[args.multiverse_id] = args.card_info
            this.scryfall_calls++
        },

        auto_refresh_packs(){
            // runs every 30 secs
            window.setInterval(function(self){
                if(self.active_player && self.player_packs.length < 1){
                    // console.log('autorefreshing packs...')
                    self.get_player_packs()
                }else{
                    // console.log('checked packs, not refreshing')
                }
            }, 3000, this)
        },

        async copy_card_list(){
            // console.log('copy card list for printing/import')
            let temp_card_list = {}
            for(const el of this.player_card_info){
                // consolidate copies counter
                
                if(temp_card_list[el.multiverse_id]){
                    // if we already have a copy of this card, increment copies counter
                    temp_card_list[el.multiverse_id].copies++
                }else{
                    // init the card 
                    temp_card_list[el.multiverse_id] = {
                        copies: 1,
                        name: el.card_info.name
                    }
                }

            }

            let string_list = ''
            for (const el of Object.values(temp_card_list)){
                string_list += `${el.copies} ${el.name} \n`
            }
            // console.log(string_list)
            // // console.log(Navigator.clipboard)
            this.card_list_text = string_list
            // show them the toast that it was copied
            this.copy_toast = true
        }

    }

});


