export default Vue.component('datetime-picker-input', {
    template: '#datetime-picker-input-template',
    props: {
        format: {
            type: String,
            default: 'ampm'
        },
        label: {
            type: String,
            default: ''
        }, 
        landscape: {
            type: Boolean,
            default: true
        },
        showCurrent:{
            type: Boolean,
            default: true
        },
        scrollable: {
            // applicable to the time picker
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'date'       
        },

        // style choices on the text input
        outlined: {
            type: Boolean,
            default: false
        },
        dense: {
            type: Boolean,
            default: true
        },
        filled: {
            type: Boolean,
            default: false
        },
        solo: {
            type: Boolean,
            default: false
        },

        // params for time-pickers
        allowedHours: {
            default: null
        },
        allowedMinutes: {
            default: null
        },

        // rules is passed through to the text input, and is for validation within a v-form component
        rules: {
            type: Array,
            // example (arrow function}): val => !!val || '*Required' // if not a value, show required warning message
            default: function(){return []}
        }
    },
    data(){
        return {
            // the picker opens in a menu, from the text field
            show_picker: false,
        }
    },
    methods: {
        input_handler(date_value){
            // close the datepicker menu
            this.show_picker = false

            // this incoming value works for the datepicker
            var value = date_value;
            
            // if editing time, change the minutes back to hour selection
            if(this.mode == 'time'){

                // we overwrite the incoming value, which for timepicker would be only the minute
                value = this.$refs.picker.$refs.title.hour.toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        }) 
                        +':'
                        + this.$refs.picker.$refs.title.minute.toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })

            }
            
            // emit the value now held by the input element, which we are modeling
            this.$emit('input', value)

        }
    }
});