<script type='text/x-template' id='card-selection-template'>
<v-card 
    class="mb-2 px-3" dark
    :elevation="elevation" outlined>
    <v-slide-group
        multiple
        show-arrows
        v-if='player_packs.length > 0' center-active active-class='selected-card' @change='selected_card'
        >
            <v-slide-item
                v-for='(card, index) in player_packs[0].cards'
                :key="'pack_'+card+index"
                v-slot="{ active, toggle }"
            >
                <mtg-card  :multiverse_id='card.multiverse_id'></mtg-card>
            </v-slide-item>
    </v-slide-group>
</v-card>
</script>