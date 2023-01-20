<script type='text/x-template' id='app-navigation-bar-template'>

<v-card>
<v-app-bar
    color="blue-grey darken-3"
    dark flat tile v-cloak
    >

    <div class='h5 mt-2 mr-4 ml-2 text-no-wrap'>
        <slot></slot>
    </div>

    <v-tabs :value='value' @change='change_tab'>

        <v-tab v-for="tab_name in tabs" v-show="hidden_tabs.indexOf(tab_name) < 0"
            :key='tab_name'>
            {{tab_name}}
        </v-tab>

    </v-tabs>

    <v-spacer></v-spacer>

    <v-menu v-if="help_articles && help_articles.length > 0"
          left bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>
  
          <v-list>
            <v-list-item
              v-for="(article, index) in help_articles"
              :key="'help_article_'+index"
              :href="article.href"
              target='_blank'
            >
              <v-list-item-title>{{article.title}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

</v-app-bar>
</v-card>

</script>

<!-- include the component's script module -->
<script type='module' src='/meta/vue/components/app-navigation-bar.js'></script>