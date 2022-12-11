<script type='text/x-template' id='datetime-picker-input-template'>

<v-menu
    v-model="show_picker"
    :close-on-content-click="false"
    :nudge-right="40" transition="scale-transition" offset-y min-width="auto"
    >

    <template v-slot:activator="{ on, attrs }">
        <v-text-field 
        :value="value" :label='label' :rules='rules'
        readonly :outlined='outlined' :solo='solo' :filled='filled' :dense='dense'
        v-bind="attrs" v-on="on"
        ></v-text-field>
    </template>

    <v-date-picker
        v-if="mode == 'date'"
        :value="value"
        @input="input_handler"
        :show-current='showCurrent'
        :landscape='landscape'
    ></v-date-picker>

    <v-time-picker ref='picker'
        v-if="mode == 'time'"
        :value="value"
        :key='value'
        :allowed-hours='allowedHours'
        :allowed-minutes='allowedMinutes'
        @click:minute="input_handler"
        :landscape='landscape' :scrollable='scrollable' :format='format'
    ></v-time-picker>

</v-menu>

</script>