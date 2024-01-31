export default Vue.component('card-selection', {
    template: '#card-selection-template',
    props: {
        state: 0,
        player_packs: [],
        draft: null,
    },
    data(){
        return {
            elevation: 1,
            title: 'This is an example card.',
            selected_cards: [],
            selected_index: [],
            card_chosen: false,
            scryfall_info: {}
        }
    }, 
    computed: {
        // player_pack(){
        //     if(this.player_packs.length > 0){
        //         return this.player_pack[0]
        //     }else{
        //         return {}
        //     }
        // }
        selection_limit(){
            if(this.draft.type == 'solo' && this.player_packs[0] && this.player_packs[0].round){
                return this.player_packs[0].round <= 7 ? this.player_packs[0].round : 14 - this.player_packs[0].round
            }
            // default to 1
            return 1
        },
    },
    mounted(){

    },
    watch: {
        state: {
            // track state management in the state prop. you can also add other state listeners, but only one needs to be listed as immediate to init the component
            handler(val){
                // perform init/state change 
                // this.hello()
            },
            immediate: true
        },
    },
    methods: {            
        select_card(args){
            // console.log('selecting', args)
            // check if we are deselecting or selecting
            if(this.selected_cards.find(x => x == args.multiverse_id)){
                // we are deselecting
                this.selected_cards = this.selected_cards.filter(x => x != args.multiverse_id)
                this.selected_index = this.selected_index.filter(x => x != args.index)
            }else{
                // push their new selection
                this.selected_cards.push(args.multiverse_id)
                this.selected_index.push(args.index)

                // use set conversion to prevent duplications
                this.selected_cards = [...new Set(this.selected_cards)]
                this.selected_index = [...new Set(this.selected_index)]

                // then trim to the selection limit
                if(this.selected_cards.length > this.selection_limit){
                    this.selected_cards.shift()
                    this.selected_index.shift()
                }
            }
        },
        async confirm_selection(){
            //prevent duplications
            if(!this.card_chosen){
                this.card_chosen = true
                let res = await $.patch(`/hybrid-draft/api/drafts/${this.player_packs[0].draft_id}/players/${this.player_packs[0].assigned_to}/packs/${this.player_packs[0]._id}`, 
                                        JSON.stringify({cards: this.selected_cards}))
                // console.log(res)
                this.$emit('card_chosen')
                // rerender to reset // this.card_chosen = false
            }
        },
        clear_selection(){
            this.selected_cards = []
            this.selected_index = []   
        },
        scryfall_call(args){
            // // console.log('card selection seeing scryfall callback', args)
            this.$emit('scryfall_call', args)
        }
    }
});