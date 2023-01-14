<div class="modern appName-page"><!-- Note: this class for the appName is relevant to css styling (children of this .appName-page -->

    <v-app class="app-container card dark pb-5">

    <app-navigation-bar
        home_url='/app_name'
        v-model='tab'
        :tabs='tabs'
        :help_articles='help_articles' v-cloak
        >LCSO MTG Draft</app-navigation-bar>

    <div class='mx-3 sub-content my-4'>

    <v-tabs-items v-model="tab" dark>
        <v-tab-item key="player_picker_tab">
            <player-picker v-if='draft' :draft='draft' @confirm='select_player'></player-picker>
            <p v-else>Getting draft info...</p>
        </v-tab-item>
        <v-tab-item key="pack_opener_tab">
            Pack Opener
            <v-btn @click='crack_pack'>Crack Pack</v-btn>
        </v-tab-item>
        <v-tab-item key="card_selection_tab"> Card Selection
        <v-slide-group
                multiple
                show-arrows
                v-if='player_packs.length > 0'
                >
                    <v-slide-item
                        v-for='(card, index) in player_packs[0].cards'
                        :key="'pack_'+card+index"
                        v-slot="{ active, toggle }"
                    >
                        <mtg-card  :multiverse_id='card.multiverse_id'></mtg-card>
                    </v-slide-item>
            </v-slide-group>

            <v-row v-if='player_cards.length > 0'>
                <mtg-card adding_to_pack v-for='card in player_cards' :multiverse_id='card' :key="'player_cards_'+Math.random()"></mtg-card>
            </v-row>

        </v-tab-item>

        <v-tab-item key="example_2">

        </v-tab-item>
    </v-tabs-items>

    </div><!-- end .sub-content -->

    </v-app><!-- end .app-container -->
</div><!-- end #container -->