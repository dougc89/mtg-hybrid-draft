<script type='text/x-template' id='copy-cardlist-modal-template'>
    
<v-dialog v-model='show_modal' max-width='600'>
    <v-card>
        <v-card-title>
            {{title}} 
            <v-spacer></v-spacer> 
            <v-btn @click='close' icon>
            <v-icon> mdi-close</v-icon>
            </v-btn>
        </v-card-title>

        <!-- information message about form 
        <v-card-text>
            Example text.
        </v-card-text>
        -->

        <!-- input form -->
        <v-card-text class='pb-2'>
            <v-textarea
            label='Copy Card List'
            outlined
            :value='card_list'
            ></v-textarea>
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
</v-dialog>

</script>