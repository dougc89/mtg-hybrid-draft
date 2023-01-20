export default Vue.component('player-picker', {
    template: '#player-picker-template',
    props: {
        state: 0,
        draft: {
            _id: null,
            set: null,
            players: []
        }
    },
    data(){
        return {
            elevation: 1,
            title: 'This is an example card.',
            prepicked_player: {
                _id:null,
                name:null
            },
            confirming_player: false,
        }
    }, 
    computed: {

    },
    mounted(){

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
        prepick_player(player_info){
            // console.log('pre-picking', player_info)
            this.prepicked_player = player_info
            this.confirming_player = true
        },
        confirm_player(){
            // console.log('confirming', this.prepicked_player)
            this.$emit('confirm', this.prepicked_player)
        }
    }
});