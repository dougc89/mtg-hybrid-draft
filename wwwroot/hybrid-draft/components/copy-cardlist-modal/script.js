export default Vue.component('copy-cardlist-modal', {
    template: '#copy-cardlist-modal-template',
    props: {
        state: 0,
        record_id:{
            default: null
        }, 
        show_modal: {
            type: Boolean,
            default: false
        },
        card_list: null
    },
    data(){
        return {
            rules: {
                req: [
                    val => !!val || '*Required', // if not a value, show required warning message
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
            return "Copy the card list below"
        }
    },
    mounted(){

    },
    watch: {

    },
    methods: {       

        close(){
            // the modal is closed from parent
            this.$emit('close')
        }
    }
});