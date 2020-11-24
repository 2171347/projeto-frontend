<template>
  <v-app light>
    <v-dialog v-model="dialog_notificacoes" persistent max-width="490">
      <v-card class="mx-auto" max-width="500" >
        <v-toolbar color="pink" dark>
          <v-toolbar-title>Notificações</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fecharNotificacoes">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <template>
          <v-list two-line>
            <template v-for="(item, index) in notificacoes">
              <v-list-item :key="item.texto">
                <v-list-item-content>
                  <v-list-item-title v-text="item.refProjeto"></v-list-item-title>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.texto"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  Lido
                  <v-icon v-if="item.lido === false" @click="setNotificacaoLida(item)" color="grey lighten-1">
                    mdi-check-box-outline
                  </v-icon>

                  <v-icon v-if="item.lido === true" color="yellow darken-3" @click="setNotificacaoNaoLida(item)">
                    mdi-checkbox-marked
                  </v-icon>
                </v-list-item-action>
              </v-list-item>

              <v-divider
                v-if="index < items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </template>
        <template v-if="notificacoes.length === 0">
          <v-card-text>
            <p>De momento não tem notificações novas.</p>
          </v-card-text>
        </template>
      </v-card>
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
      <v-spacer/>
      <v-toolbar-title v-text="title" />
      <v-spacer />

      <template v-if="this.num_notificacoes !== 0">
        <v-badge
          overlap
          offset-x="28"
          offset-y="20">
          <!--v-if="this.num_notificacoes !== 0"-->
          <span slot="badge">{{ this.num_notificacoes }}</span>
          <v-btn icon style="margin-right: 10px" @click.stop="dialog_notificacoes = true">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </v-badge>
      </template>
      <template v-else>
        <v-btn icon style="margin-right: 10px" @click.stop="dialog_notificacoes = true">
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </template>
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
      active: false,
      notificacao:'',

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
      items_fabricante: [
        {
          icon: 'mdi-apps',
          title: 'Produtos',
          to: '/produtos/'
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Criar Produto',
          to: '/produtos/criar'
        },
      ],
      items_admin: [
        {
          icon: 'mdi-apps',
          title: 'Listar Projetos',
          to: '/projetos/'
        },
        {
          icon: 'mdi-account-box-multiples',
          title: 'Listar Utilizadores',
          to: ''
        },
        {
          icon: 'mdi-apps',
          title: 'Listar Produtos',
          to: '/produtos/'
        },
        {
          icon: 'mdi-apps',
          title: 'Tipos Material',
          to: ''
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Tipos de Material',
          to: '/tipo_material/criar'
        },
        {
          icon: 'mdi-apps',
          title: 'Familias de Material',
          to: ''
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Criar Familia de Mat.',
          to: '/tipo_material/criar'
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
            this.items = this.items_fabricante;
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
    setNotificacaoLida(item){
      item.lido = true;
    },
    setNotificacaoNaoLida(item){
      item.lido = false;
    },
    async fecharNotificacoes() {
      this.dialog_notificacoes = false;

      for (let aux in this.notificacoes) {
        if (this.notificacoes[aux].lido === true) {
          await this.$axios.put('/api/notificacoes/' + this.notificacoes[aux].id + '/lido')
            .then((response) => {

              }
            )
        }
      }
      this.getNotificacoes()
    }
  },
  created() {
    this.getUser()
    this.getNotificacoes()

  },
  computed:{

  }

}
</script>
