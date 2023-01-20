export default Vue.component('player-confirmation', {
    template: '#player-confirmation-template',
    props: {
        state: 0,
        record_id:{
            default: null
        }, 
        show_modal: {
            type: Boolean,
            default: false
        },
        player:{
            _id: null,
            name: null
        }
    },
    data(){
        return {
            rules: {
                req_match: [
                    val => !!val && val == this.player._id || '*Must match player id', // if not a value, show required warning message
                ],
                // req_10: [
                //     val => !!val || '*Required', // if not a value, show required warning message
                //     val => (val && val.length >= 10) || '10 characters minimum'
                // ],
            }
        }
    }, 
    computed: {
        title(){
            // title of modal
            return `Confirm that you are ${this.player.name}`
        }
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
        record_id: {
            handler(val){
                // perform data refresh off of a change in record id

            },
        }
    },
    methods: {       

        async save(){
            if(this.$refs.form.validate()){
                this.$emit('confirm')
    
                // close this modal
                    this.close()
            }
        },

        enter(){
            // console.log('hit enter')
        },

        close(){

            // reset validation
            this.$refs.form.resetValidation()
            // the modal is closed from parent
            this.$emit('close')
        }
    }
});