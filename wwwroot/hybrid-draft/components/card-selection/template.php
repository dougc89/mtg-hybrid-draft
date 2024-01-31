<script type='text/x-template' id='card-selection-template'>
<v-card 
    class="mb-2 px-3" dark
    :elevation="elevation" height='500'>
    <p class='h3 text-center mt-4'>Card Selection ({{this.selected_cards.length}}/{{this.selection_limit}})</p>
    <v-slide-group
        v-model='selected_index' multiple
        show-arrows v-if='!this.card_chosen && player_packs.length > 0' center-active active-class='selected-card' @change='select_card'
        >
            <v-slide-item
                v-for='(card, index) in player_packs[0].cards'
                :key="'pack_'+card+index"
                v-slot="{ active, toggle }"
            >
                <mtg-card :multiverse_id='card.multiverse_id' :pack_index='index' v-if='!card.owned_by' :scryfall_info='scryfall_info'
                @select_card='select_card' :class="{'selected-card': active, clickable: !active}" @scryfall_api='scryfall_call'></mtg-card>
            </v-slide-item>
    </v-slide-group>
    <v-row v-if='selected_cards.length == selection_limit && !this.card_chosen' class='mt-1'>
        <v-spacer></v-spacer>
        <v-btn rounded color='teal' @click='confirm_selection'>Confirm Selection</v-btn>
        <v-btn rounded text  @click='clear_selection'>Clear Selection</v-btn>
        <v-spacer></v-spacer>
    </v-row>
</v-card>
</script>