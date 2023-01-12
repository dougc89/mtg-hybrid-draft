<script type='text/x-template' id='player-picker-template'>
<v-card 
    class="mb-2 px-3" dark
    :elevation="elevation" outlined>
    <v-row>
        <!-- Title in text style -->
            <v-card-title>
                Which player are you?
            </v-card-title>

        <!-- Title in toolbar style
            <v-app-bar class='mt-2' flat color="rgba(0, 0, 0, 0)" :dense="true">

                <v-toolbar-title class="text-h6 pl-0">
                    {{title}}
                </v-toolbar-title>

                <v-spacer></v-spacer>
            </v-app-bar>
        -->

        <v-card-text class='py-0'>
            <v-btn v-for='player in draft.players' :key="'player_btn_'+player._id" @click='prepick_player(player)'>{{player.name}}</v-btn>
        </v-card-text>
    </v-row>
    <player-confirmation :show_modal='confirming_player' :player='prepicked_player' @confirm='confirm_player' @close='confirming_player = false'></player-confirmation>
</v-card>
</script>