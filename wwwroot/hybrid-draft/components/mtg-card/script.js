export default Vue.component('mtg-card', {
    template: '#mtg-card-template',
    props: {
        multiverse_id: {
            default: '000000'
        },
        adding_to_pack: {
            type: Boolean,
            default: false
        },
        pack_index: {
            default: -1
        },
        scryfall_info: {}
    },
    data(){
        return {
            elevation: 0,
            title: 'This is an example card.',
            card_info: {
                multiverse_ids: ['000000'],
                image_uris: {
                    small: '/hybrid-draft/packaging/cardback.png',
                    normal: '/hybrid-draft/packaging/cardback.png'
                }
            },
            // the index of which card face to display
            display_face: 0
        }
    }, 
    computed: {
        scryfall_img_path(){
            return this.card_info.image_uris.normal
        },
        gatherer_img_path(){
            return `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.card_info.multiverse_ids[this.display_face]}&type=card`
        },
        best_card_img(){
            if(this.card_info.multiverse_ids[this.display_face]){
                 return this.gatherer_img_path
            }else if(this.scryfall_img_path){
                return this.scryfall_img_path
            }else{
                return '/hybrid-draft/packaging/cardback.png'
            }
        },
        multiface_card(){
            // convert to bool, if there are multiple card faces to display
            return (this.card_info.multiverse_ids.length > 1)
        },

    },
    mounted(){
        this.get_scryfall_info()
    },
    watch: {
        state: {
            // track state management in the state prop. you can also add other state listeners, but only one needs to be listed as immediate to init the component
            handler(val){
                // perform init/state change 

            },
            immediate: true
        },
    },
    methods: {            
        async get_scryfall_info(){
            if(this.scryfall_info[this.multiverse_id]){
                this.card_info = this.scryfall_info[this.multiverse_id]
            }else{
                let res = await $.get('https://api.scryfall.com/cards/'+this.multiverse_id)       
                this.card_info = res
                
                // pass the info up for storage
                this.$emit('scryfall_api', {multiverse_id: this.multiverse_id, card_info: this.card_info})
            }
        },
        add_to_pack(){
            // console.log('Adding to pack', this.card_info)
            this.$emit('add_to_pack', this.multiverse_id)
        },
        select(){
            // console.log('selecting', this.multiverse_id)
            this.$emit('select_card', {index:this.pack_index, multiverse_id:this.multiverse_id})
        },
        swap_card_face(){
            // toggle between 0 and 1
            this.display_face = (this.display_face + 1) % 2
        }
    }
});