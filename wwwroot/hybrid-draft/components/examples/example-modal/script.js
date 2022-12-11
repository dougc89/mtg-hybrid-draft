export default Vue.component('example-modal', {
    template: '#example-modal-template',
    props: {
        prop: {
            default: null
        }
    },
    data(){
        return {
            example_val: null,
            rules: {
                req_10: [
                    val => !!val || '*Required', // if not a value, show required warning message
                    val => (val && val.length >= 10) || '10 characters minimum'
                ],
            }
        }
    }, 
    computed: {
        title(){
            return "Example Title"
        }
    },
    methods: {            
        async save(){
            var data = {}
            // var response = await $.post('/endpoint/goes/here', JSON.stringify(data))
        }, 
        close(){
            // close the modal, from the parent
            this.$emit('close')
        }
    }
});