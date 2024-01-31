<div class="modern appName-page"><!-- Note: this class for the appName is relevant to css styling (children of this .appName-page -->

    <v-app class="app-container card dark pb-5">

    <app-navigation-bar
        v-model='tab'
        :tabs='tabs'
        :hidden_tabs='hidden_tabs'
        :help_articles='help_articles' v-cloak
        >LCSO MTG Draft</app-navigation-bar>

    <div class='mx-3 sub-content my-4'>

    <v-tabs-items v-model="tab" dark v-cloak>
        <v-tab-item key="player_picker_tab">
            <player-picker v-if='draft' :draft='draft' @confirm='select_player'></player-picker>
            <p v-else class='h3 text-center'>Getting draft info...</p>
        </v-tab-item>

        <v-tab-item key="pack_opener_tab">
            <p class='h3 text-center' v-if='!cracking_pack'>Crack a pack!</p>
            <p class='h3 text-center' v-else>Opening Pack...</p>
            <v-img @click='crack_pack' contain height='450px' v-if='draft' :src="'/hybrid-draft/packaging/'+draft.set+'.png'" class='clickable' v-if='!cracking_pack'></v-img>
        </v-tab-item>
        
        <v-tab-item key="card_selection_tab"> 
            
            <card-selection :key="'selector_state_'+state" :player_packs='player_packs' :scryfall_info='scryfall_info' :draft='draft'
            v-if='(player_packs.length > 0 && (player_packs[0].round - 1) == Math.floor(player_cards.length/15)) || (draft.type == "solo" && player_cards.length < 49)' @card_chosen='get_player_stuff' @scryfall_call='track_scryfall_calls'
            ></card-selection>
            <p class='h6 text-center' v-else-if='draft && player_cards.length < draft.num_packs * 15 && !draft.type == "solo"'>Waiting on packs from other players...</p>
            <p class='h4 text-center' color='teal' v-else>Draft Complete</p>
            
            <div v-if='player_cards.length > 0'>
                <v-row >
                    <v-spacer></v-spacer>
                    <p class='h3 text-center mt-4'>Cards You Own:</p>
                    <v-spacer></v-spacer>
                </v-row>
                <v-row class='my-5'>
                    <v-spacer></v-spacer>
                    <v-btn color='teal' rounded x-large width='300px'
                    @click='copy_card_list'><v-icon>mdi-content-copy</v-icon> Card List ({{player_cards.length}})</v-btn>
                    <v-spacer></v-spacer>
                </v-row>
                <v-row >
                    <mtg-card v-for='(card, index) in player_cards' :multiverse_id='card' :scryfall_info='scryfall_info' :key="'player_cards_'+card+index" @scryfall_api='track_scryfall_calls'></mtg-card>
                </v-row>
                <copy-cardlist-modal :show_modal='copy_toast'
                :card_list='card_list_text' color='teal' @close='copy_toast = false'
                >
                <v-icon>mdi-content-copy</v-icon>Deck list copied to clipboard...
</copy-cardlist-modal>
            </div>

        </v-tab-item>

        <v-tab-item key="example_2">

        </v-tab-item>
    </v-tabs-items>

    </div><!-- end .sub-content -->

    </v-app><!-- end .app-container -->
</div><!-- end #container -->