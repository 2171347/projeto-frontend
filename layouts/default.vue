<template>
  <v-app light>
    <v-dialog v-model="dialog_notificacoes" max-width="490">
      <!--<v-card>
        <v-card-title class="headline">
          Notificações
        </v-card-title>
        <v-card-text>
          &lt;!&ndash;TODO Apresentar lista de notificações ao utilizador&ndash;&gt;
          {{this.notificacoes}}
          <v-data-table
          :items="notificacoes"
          :headers="tab_notificacoes_headers">
            <template v-slot:item.action="{ item }">
              <v-btn x-small @click="setNotificacaoLida(item)">Lido</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>-->
      <!--https://vuetifyjs.com/en/components/lists/-->
      <!--<v-card
        class="mx-auto"
        max-width="500"
      >
        <v-toolbar
          color="pink"
          dark
        >
          <v-toolbar-title>Notificações</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-checkbox-marked-circle</v-icon>
          </v-btn>
        </v-toolbar>
        {{this.notificacoes}}

        <v-list two-line>
          <v-list-item-group
            v-model="selected"
            active-class="pink&#45;&#45;text"
            multiple
          >
            <template v-for="(item, index) in notificacoes">
              <v-list-item :key="item.texto">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>

                    <v-list-item-subtitle
                      class="text&#45;&#45;primary"
                      v-text="item.headline"
                    ></v-list-item-subtitle>

                    <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text v-text="item.action"></v-list-item-action-text>

                    <v-icon
                      v-if="!active"
                      color="grey lighten-1"
                    >
                      mdi-star-outline
                    </v-icon>

                    <v-icon
                      v-else
                      color="yellow darken-3"
                    >
                      mdi-star
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>-->
    </v-dialog>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="grey lighten-1"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :disabled="item.active"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="cyan lighten-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon to="/home">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-badge
        overlap
        offset-x="28"
        offset-y="20"
        v-if="this.num_notificacoes !== 0"
      >
        <span slot="badge">{{this.num_notificacoes}}</span>
      <v-btn icon style="margin-right: 10px" @click.stop="dialog_notificacoes = true">
        <v-icon>mdi-email</v-icon>
      </v-btn>
      </v-badge>
  <!--      TODO: Adicionar nome do utilizador ao lado do botão "user"-->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/user/perfil/">
           <v-icon>mdi-account</v-icon>Perfil
          </v-list-item>
          <v-list-item @click="logout">
           <v-icon>mdi-logout</v-icon>Sair
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {

  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items:[],
      email:'',
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Projeto+',
      notificacoes:'',
      num_notificacoes:0,
      selected:'',

      // ---- SNACKBAR INFO -----
      dialog_notificacoes:false,
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------

      tab_notificacoes_headers:[
        { text: 'Notificação', value: 'texto' },
        { text: 'Ação', value: 'action' },
      ],

      items_cliente: [
        {
          icon: 'mdi-apps',
          title: 'Consultar Projetos',
          to: '/projetos/',
        },

      ],
      items_projetista: [
        {
          icon: 'mdi-apps',
          title: 'Consultar Projetos',
          to: '/projetos/'
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Criar Projeto',
          to: '/projetos/criar'
        },
        {
          icon: 'mdi-puzzle',
          title: 'Simulador',
          to: ''
        }
      ],
      items_fornecedor: [
        {
          icon: 'mdi-plus-circle',
          title: 'Criar Produto',
          to: '/produtos/criar'
        },{
          icon: 'mdi-plus-circle',
          title: 'Criar Tipo de Material',
          to: '/tipo_material/criar'
        },
      ],
      items_admin: [
        {
          icon: 'mdi-apps',
          title: 'Listar Projetos',
          to: '/admin/projetos/'
        },
        {
          icon: 'mdi-apps',
          title: 'Listar Utilizadores',
          to: ''
        },
        {
          icon: 'mdi-apps',
          title: 'Listar Produtos',
          to: ''
        },
      ],
    }
  },
  methods:{
    logout () {
      this.$auth.logout()
    },
    getUser(){
      if (this.$auth.loggedIn) {
        if (this.$auth.user.groups.includes('Cliente')) {
            this.items = this.items_cliente;
        }
        if (this.$auth.user.groups.includes('Projetista')) {
            this.items = this.items_projetista;
        }
        if (this.$auth.user.groups.includes('Fabricante')) {
            this.items = this.items_fornecedor;
        }
        if (this.$auth.user.groups.includes('Administrador')) {
            this.items = this.items_admin;
        }
      }
    },
    getNotificacoes(){
      this.$axios.get('/api/notificacoes/'+ this.$auth.user.sub).then((notificacoes) => {
        this.notificacoes = notificacoes.data;
        this.num_notificacoes = notificacoes.data.length;
      })
    },
    setNotificacaoLida(){

    },
  },
  created() {
    this.getUser()
    this.getNotificacoes()
  }
}
</script>
