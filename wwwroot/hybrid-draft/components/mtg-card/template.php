<script type='text/x-template' id='mtg-card-template'>
<v-col>
    <v-card 
        class="mb-2 px-3 mtg-card" dark
        :elevation="elevation" 
        min-width='253' max-width='255' rounded @click='select'
        >
        <v-img :src='scryfall_img_path' height='353' width='253' contain class='card-edges'>
                <v-app-bar
                flat color="rgba(0, 0, 0, 0)" >
                    <v-btn v-if='adding_to_pack'
                    color='green' fab elevation='0' x-small class='card-actions--buffer' @click='add_to_pack'><v-icon>mdi-plus</v-icon></v-btn>
                    <v-spacer></v-spacer>
                </v-app-bar>
            </v-img>
    </v-card>
</v-col>
</script>