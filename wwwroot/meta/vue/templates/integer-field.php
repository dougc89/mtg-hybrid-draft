<script type='text/x-template' id='integer-field-template'>

    <v-text-field autocomplete='off' v-model="displayValue" @blur="isInputActive = false" @focus="isInputActive = true" v-bind="$props"></v-text-field>

</script>