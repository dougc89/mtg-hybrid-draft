export default Vue.component('example-card', {
    template: '#example-card-template',
    props: {
        prop: {
            default: null
        }
    },
    data(){
        return {
            elevation: 1,
            title: 'This is an example card.'
        }
    }, 
    computed: {

    },
    methods: {            
        hello(){
            console.log('hello world');
        }
    }
});