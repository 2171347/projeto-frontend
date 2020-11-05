<template>
  <v-app light>
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
      <v-btn icon style="margin-right: 10px">
        <v-icon>mdi-email</v-icon>
      </v-btn>
      </v-badge>
  <!--      TODO: Adicionar icon para notificações-->
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
const Cookie = process.client ? require('js-cookie') : undefined

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
          to: '/projetista/criar_projeto'
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
      this.$auth.logout('local')
      Cookie.remove('authentication')
      this.$store.commit('setAuth', null)
    },
    getUser(){

      if (this.$auth.user.groups.includes('Cliente')){
          this.items = this.items_cliente;
      }
      if (this.$auth.user.groups.includes('Projetista')){
          this.items = this.items_projetista;
      }
      if (this.$auth.user.groups.includes('Fabricante')){
          this.items = this.items_fornecedor;
      }
      if (this.$auth.user.groups.includes('Administrador')){
          this.items = this.items_admin;
      }
    },
    getNotificacoes(){
      this.$axios.get('/api/notificacoes/'+ this.$auth.user.sub).then((notificacoes) => {
        this.notificacoes = notificacoes.data;
        this.num_notificacoes = notificacoes.data.length;
        console.log(notificacoes.data.length)
        //console.log(this.notificacoes)
      })
    }
  },
  created() {
    this.getUser()
    this.getNotificacoes()
  }
}
</script>
