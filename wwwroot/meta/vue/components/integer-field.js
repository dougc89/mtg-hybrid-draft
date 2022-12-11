export const integer_field = Vue.component('integer-field', {
    template: '#integer-field-template',
    // passing the prop value works by default when we tell a component to v-model
    props: {
        "value": { 
            // type: Any,
            default: null
        }, 
        'label': {
            type: String,
            default: null
        },
        allow_negatives: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            isInputActive: false
        }
    },
    computed: {
        displayValue: {
            get: function() {
                if (this.isInputActive) {
                    // Cursor is inside the input field. unformat display value for user
                    return this.value
                } else {
                    // User is not modifying now. Format display value for user interface
                    if(!this.value || isNaN(this.value)) return null;
                    return this.value
                }
            },
            set: function(modifiedValue) {
                // Recalculate value after ignoring anything that is not a digit (or decimal point, to allow rounding)
                let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ""))
                // Ensure that it is not NaN
                if (isNaN(newValue)) {
                    newValue = 0
                }

                // console.log(newValue, newValue.toFixed(2));
                // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
                // $emit the input event so that parent component gets it, and passes it up the chain via its v-model
            
                if(this.allow_negatives){
                    // round to nearest whole number
                    this.$emit('input', Math.round(newValue + Number.EPSILON))
                }else{
                    // round to nearest whole number and coerce to positive
                    this.$emit('input', Math.abs(Math.round(newValue + Number.EPSILON)))
                }
            }
        }
    }
});