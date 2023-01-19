<div class="modern appName-page"><!-- Note: this class for the appName is relevant to css styling (children of this .appName-page -->

    <v-app class="app-container card dark pb-5">

    <app-navigation-bar
        home_url='/app_name'
        v-model='tab'
        :tabs='tabs'
        :help_articles='help_articles' v-cloak
        >LCSO MTG Draft</app-navigation-bar>

    <div class='mx-3 sub-content my-4'>

    <v-tabs-items v-model="tab" dark v-cloak>
        <v-tab-item key="player_picker_tab">
            <player-picker v-if='draft' :draft='draft' @confirm='select_player'></player-picker>
            <p v-else class='h3 text-center'>Getting draft info...</p>
        </v-tab-item>

        <v-tab-item key="pack_opener_tab">
            <p class='h3 text-center'>Crack a pack!</p>
            <v-img @click='crack_pack' contain height='450px' v-if='draft' :src="'/hybrid-draft/packaging/'+draft.set+'.png'" class='clickable'></v-img>
        </v-tab-item>
        
        <v-tab-item key="card_selection_tab"> 
            <p class='h3 text-center'>Card Selection</p>
            <card-selection :key="'selector_state_'+state" :player_packs='player_packs' :scryfall_info='scryfall_info'
            v-if='player_packs.length > 0' @card_chosen='get_player_stuff' @scryfall_call='track_scryfall_calls'
            ></card-selection>
            <p class='h6 text-center' v-else-if='draft && player_cards.length < draft.num_packs * 15'>Waiting on packs from other players...</p>

            <v-row v-if='player_cards.length > 0'>
                <mtg-card v-for='card in player_cards' :multiverse_id='card' :scryfall_info='scryfall_info' :key="'player_cards_'+Math.random()" @scryfall_api='track_scryfall_calls'></mtg-card>
            </v-row>

        </v-tab-item>

        <v-tab-item key="example_2">

        </v-tab-item>
    </v-tabs-items>

    </div><!-- end .sub-content -->

    </v-app><!-- end .app-container -->
</div><!-- end #container -->