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
            elevation: 1,
            title: 'This is an example card.',
            card_info: {
                multiverse_ids: ['000000'],
                image_uris: {
                    small: '/hybrid-draft/packaging/cardbackreal.jpg',
                    normal: '/hybrid-draft/packaging/cardbackreal.jpg'
                }
            }
        }
    }, 
    computed: {
        gatherer_img_path(){
            return `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${this.multiverse_id}&type=card`
        },
        scryfall_img_path(){
            return this.card_info.image_uris.normal
        }

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
                return this.scryfall_info[this.multiverse_id]
            }else{
                let res = await $.get('https://api.scryfall.com/cards/search?q=multiverse_id:'+this.multiverse_id)       
                this.card_info = res.data[0]
                
                // pass the info up for storage
                this.$emit('scryfall_api', {multiverse_id: this.multiverse_id, card_info: this.card_info})
            }
        },
        add_to_pack(){
            console.log('Adding to pack', this.card_info)
            this.$emit('add_to_pack', this.multiverse_id)
        },
        select(){
            console.log('selecting', this.multiverse_id)
            this.$emit('select_card', {index:this.pack_index, multiverse_id:this.multiverse_id})
        }
    }
});