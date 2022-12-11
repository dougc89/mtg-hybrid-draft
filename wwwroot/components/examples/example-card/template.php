<script type='text/x-template' id='example-card-template'>
<v-card 
    class="mb-2 px-3 white"
    :elevation="elevation" outlined>
    <v-row>
        <!-- Title in text style
            <v-card-title>
                {{title}}
            </v-card-title>
        -->
        <!-- Title in toolbar style
            <v-app-bar class='mt-2' flat color="rgba(0, 0, 0, 0)" :dense="true">

                <v-toolbar-title class="text-h6 pl-0">
                    {{title}}
                </v-toolbar-title>

                <v-spacer></v-spacer>
            </v-app-bar>
        -->

        <v-card-text class='py-0'>
        </v-card-text>
    </v-row>
</v-card>
</script>