<template>
  <v-app light>
    <v-dialog v-model="dialog_notificacoes" persistent max-width="490">
      <v-card class="mx-auto" max-width="500" >
        <v-toolbar color="amber darken-1" dark>
          <v-toolbar-title>Notificações</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fecharNotificacoes">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <template>
          <v-list two-line>
            <template v-for="(item, index) in this.$store.state.notificacoes">
              <v-list-item :key="item.texto">
                <v-list-item-content>
                  <v-list-item-title v-text="item.refProjeto"></v-list-item-title>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.texto"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle v-text="item.data"></v-list-item-subtitle>
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
            </template>
          </v-list>
        </template>
        <template v-if="this.$store.state.notificacoes.length === 0">
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
      color= "#ADADAD"
      light
      v-if="this.$auth.user.groups.includes('Administrador')"
    >
    <sidebar_admin v-if="this.$auth.user.groups.includes('Administrador')"/>

    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="amber darken-1">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="this.$auth.user.groups.includes('Administrador')"/>
      <v-btn icon to="/home">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-spacer/>
      <v-toolbar-title  class="white--text" v-text="title" />
      <v-spacer />

      <template v-if="this.$store.state.notificacoes.length !== 0">
        <v-badge
          overlap
          offset-x="28"
          offset-y="20">

          <span slot="badge">{{ this.$store.state.notificacoes.length }}</span>
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
    <v-main style="background-color: #ebedef">
      <v-container fluid style="background-color: #ebedef">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import sidebar_admin from "@/components/sidebar_admin";
export default {

  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      email:'',
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Projeto+',
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
      notificacoes:'',
      numNotificacoes:'',
      items:'',

      tab_notificacoes_headers:[
        { text: 'Notificação', value: 'texto' },
        { text: 'Ação', value: 'action' },
      ],

    }
  },
  methods:{

    start(){
      this.notificacoes = JSON.parse(JSON.stringify(this.$store.state.notificacoes))
      this.numNotificacoes = JSON.parse(JSON.stringify(this.$store.state.num_notificacoes))
    },
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
    setNotificacaoLida(item){
      item.lido = true;
    },
    setNotificacaoNaoLida(item){
      item.lido = false;
    },
    async fecharNotificacoes() {
      this.dialog_notificacoes = false;
      for (let aux in this.$store.state.notificacoes) {
        if (this.$store.state.notificacoes[aux].lido === true) {
          await this.$axios.put('/api/notificacoes/' + this.$store.state.notificacoes[aux].id + '/lido')
            .then((response) => {}
            )
        }
      }
      this.$storeGetNotificacoes()
    }
  },
  async created() {
    this.$store.commit("setEmailUser", this.$auth.user.sub)


  },
  components:{
    sidebar_admin,
  },

}
</script>
