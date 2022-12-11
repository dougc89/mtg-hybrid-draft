<v-card>
<v-app-bar
    color="blue-grey darken-3"
    dark flat tile v-cloak
    >
    <v-app-bar-nav-icon href='/oncall' >
        <v-icon>mdi-home</v-icon>
    </v-app-bar-nav-icon>

    <div class='h5 mt-2 mr-4 ml-2 text-no-wrap'>
        On-Call Schedule
    </div>

    <v-tabs v-model="tab">

        <v-tab key='contacts_tab'>
            Contacts
        </v-tab>

        <v-tab key='scheduling_tab' v-if="show_scheduling">
            Scheduling
        </v-tab>

    </v-tabs>

</v-app-bar>
</v-card>