<script type='text/x-template' id='example-modal-template'>
<v-card>
    <v-card-title>
        {{title}} 
        <v-spacer></v-spacer> 
        <v-btn @click='close' icon>
            <v-icon> mdi-close</v-icon>
        </v-btn>
    </v-card-title>

    <!-- information message about form -->
    <v-card-text>
        Example text.
    </v-card-text>

    <!-- input form -->
    <v-card-text class='pb-2'>

        <v-form ref='new_contact_form'>
            <v-row>
                <v-col cols='10'>
                    <v-text-field
                    label='Example Input'
                    outlined
                    v-model='example_val'
                    :rules='rules.req_10'
                    class='mt-0'
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-form>

    </v-card-text>

    <!-- action buttons -->
    <v-card-actions class='pb-4'>

        <v-btn @click='save' large color='primary'>
            Save
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn @click='close' large>
            Close
        </v-btn>

    </v-card-actions>    

</v-card>  
</script>