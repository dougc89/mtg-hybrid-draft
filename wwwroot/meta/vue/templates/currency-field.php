<script type='text/x-template' id='currency-field-template'>

    <v-text-field v-model="displayValue" @blur="isInputActive = false" @focus="isInputActive = true" v-bind="$props"></v-text-field>

</script>