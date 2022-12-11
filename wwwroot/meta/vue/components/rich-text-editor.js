export default Vue.component('rich-text-editor', {
    template: '#rich-text-editor-template',
    props:{
        // value is the content of the element, which is made editable. Intended to use v-model:content with contentType='html'
        value:{
            default: ''
        }
    },
    data(){
        return {
            // rich text editor using Quill plugin
            quill: {},

            // use a unique id for the editor, which the Quill plugin will reference
            editor_id: null

        }
    },
    mounted(){
        // generate a random 10 char string, to feed into the id of the div element for the editor
        this.editor_id = 'editor_' + Math.random().toString(36).substr(2, 10);

        // use nextTick to delay the quill initialization until after the target div has received its editor_id...
        this.$nextTick( () => this.enable_editor() )// quill = new Quill('#'+this.editor_id, {theme: 'snow' }) );
        
    },
    watch:{
        value(new_value, old_value){
            // write new incoming values to the editor html
            if(this.quill.root){
                /*
                console.log('compare existing html with current')
                console.log('current html', this.quill.root.innerHTML);
                console.log('new vue value', new_value);
                console.log('old vue value', new_value);
                */

                // if the existing html differs, from the incoming vue new_value, force the quill editor to update contents
                if(this.quill.root.innerHTML != new_value) this.quill.root.innerHTML = new_value;

            } 
        }
    },
    methods: {
        enable_editor(){

            this.quill = new Quill('#'+this.editor_id, {theme: 'snow' });
            // uses a plugin custom event "text-change" to detect changes
            this.quill.on('text-change', this.detect_changes)

        },
        detect_changes(delta, source){

            // emitting input event, to correspond with intended use of v-model
            this.$emit('input', this.quill.root.innerHTML);

        }
    }

});