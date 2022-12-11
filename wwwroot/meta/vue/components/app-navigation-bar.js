export const app_navigation = Vue.component('app-navigation-bar', {
    template: '#app-navigation-bar-template',
    props: {
        // value is the active tab index
        value: {
            default: 0
        },
        tabs:{
            // used in a v-tabs component, which will emit its active tab as a model to the parent, for app navigation
            /* format:
            ['tab_0_title', 'tab_1_title',...]
            */
            type: Array,
            default: function(){return []}
        }, 
        hidden_tabs:{
            // used in a v-tabs component, which will emit its active tab as a model to the parent, for app navigation
            /* format:
            ['tab_0_title', 'tab_1_title',...]
            */
            type: Array,
            default: function(){return []}
        },  
        home_url:{
            // this should be used to return to the main view of the app, so /app_directory 
            // we will default to return to the main menu, if not provided
            type: String,
            default: '/menu'  
        },
        help_articles:{
            // append a help menu to the right side of the nav bar. Always open in _blank tab.
            /* format:
            [
                {'title': (string), 'href': (url string)},..
            ]
            */
            type: Array,
            default: function(){return []}
        }, 
    },
    data(){
        return {

        }
    },
    mounted(){

    },
    methods: {

        async change_tab(index){
            /* Bug fix: on page initialization, if we tried to modify the active tab index (to load a page state)
            we had the unintended behavior of this v-tab emitting a change event with what it thought its default value should be.
            Emiting the value that this app-navigation-bar component is storing is more accurate to desired behavior than the emit value coming out of the nested v-tabs.
            */
            console.log('changing tab', index)
            this.$emit('input', index)
   
        }
    }
});