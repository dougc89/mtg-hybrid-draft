<div class="modern appName-page"><!-- Note: this class for the appName is relevant to css styling (children of this .appName-page -->

    <v-app class="app-container card dark pb-5">

    <app-navigation-bar
        home_url='/app_name'
        v-model='tab'
        :tabs='tabs'
        :help_articles='help_articles' v-cloak
        >APP NAME</app-navigation-bar>

    <div class='mx-3 sub-content my-4'>

    <v-tabs-items v-model="tab" dark>

        <v-tab-item key="example_1">
        <v-slide-group
            multiple
            show-arrows
            >
                <v-slide-item
                    v-for='(card, index) in pack_cards'
                    :key="'pack_'+card+index"
                    v-slot="{ active, toggle }"
                >
                    <mtg-card  :multiverse_id='card'></mtg-card>
                </v-slide-item>
        </v-slide-group>
        <v-row>
            <v-col>
                <v-text-field v-model='search_text' clearable @change='search_with_delay'></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <mtg-card adding_to_pack v-for='card in cards' :multiverse_id='card.multiverse_ids[0]' @add_to_pack='add_to_pack' :key="'card_search_'+Math.random()"></mtg-card>
        </v-row>
        </v-tab-item>

        <v-tab-item key="example_2">

        </v-tab-item>
    </v-tabs-items>

    </div><!-- end .sub-content -->

    </v-app><!-- end .app-container -->
</div><!-- end #container -->