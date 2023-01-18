export default Vue.component('card-selection', {
    template: '#card-selection-template',
    props: {
        state: 0,
        player_packs: []
    },
    data(){
        return {
            elevation: 1,
            title: 'This is an example card.',
            selected_card: null
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
                // this.hello()
            },
            immediate: true
        },
    },
    methods: {            
        select_card(arg){
            console.log('hello card', arg, this.selected_card);
        }
    }
});