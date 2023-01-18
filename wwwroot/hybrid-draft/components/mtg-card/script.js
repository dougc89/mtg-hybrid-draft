export default Vue.component('mtg-card', {
    template: '#mtg-card-template',
    props: {
        multiverse_id: {
            default: '000000'
        },
        adding_to_pack: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            elevation: 1,
            title: 'This is an example card.',
            card_info: {
                multiverse_ids: ['000000'],
                image_uris: {
                    small: 'https://cards.scryfall.io/small/front/3/8/38a62bb2-bc33-44d4-9a7e-92c9ea7d3c2c.jpg?1670537256',
                    normal: 'https://cards.scryfall.io/normal/front/3/8/38a62bb2-bc33-44d4-9a7e-92c9ea7d3c2c.jpg?1670537256'
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
            let res = await $.get('https://api.scryfall.com/cards/search?q=multiverse_id%3A'+this.multiverse_id)       
            this.card_info = res.data[0]
        },
        add_to_pack(){
            console.log('Adding to pack', this.card_info)
            this.$emit('add_to_pack', this.multiverse_id)
        },
        hello(){
            console.log('hello')
            this.$emit('select_card')
        }
    }
});