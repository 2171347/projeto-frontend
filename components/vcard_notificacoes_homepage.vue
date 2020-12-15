<template>
  <v-card class="mx-auto" max-width="500"  min-height="150px" >
      <v-toolbar>
        <v-toolbar-title>Notificações</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAllNotificacoesLidas" :disabled="notificacoes.length === 0">
                <v-icon>mdi-check-box-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <span>Marcar todas as notificações como lidas.</span>
        </v-tooltip>
      </v-toolbar>

      <template >
        <v-layout justify-center align-center v-if="loading">
          <v-progress-linear
            indeterminate
            color="primary">
          </v-progress-linear>
        </v-layout>
        <v-list two-line >
          <template v-for="(item, index) in this.$store.state.notificacoes">
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
<!--            <v-divider
              v-if="index < this.$store.state.notificacoes.length - 1"
              :key="index"
            ></v-divider>-->
          </template>
        </v-list>
      </template>
      <template v-if="this.$store.state.num_notificacoes === 0 && !loading">
        <v-card-text>
          <p>De momento não tem notificações novas.</p>
        </v-card-text>
      </template>
  </v-card>

</template>

<script>

export default {
  name: "vcard_notificacoes_homepage",
  data () {
    return {
      notificacoes:'',
      loading:false,
    }
  },
  methods:{
    async getNotificacoes() {
      await this.$axios.get('/api/notificacoes/' + this.$auth.user.sub).then((notificacoes) => {
        this.$store.commit("setNotificacoes",notificacoes.data);
        this.$store.commit("setNumNotificacoes",notificacoes.data.length);
      })
    },
    async setNotificacaoLida(item) {
      this.loading = true;
      item.lido = true;
      await this.$axios.put('/api/notificacoes/' + item.id + '/lido')
        .then((response) => {
          }
        )
      await  this.$storeGetNotificacoes()
      this.loading = false;

    },
    setNotificacaoNaoLida(item){
      item.lido = false;
    },
    async setAllNotificacoesLidas() {
      this.loading = true;
      this.notificacoes = this.$store.state.notificacoes
      for (let aux in this.$store.state.notificacoes) {
        await this.$axios.put('/api/notificacoes/' + this.$store.state.notificacoes[aux].id + '/lido')
          .then((response) => {
            }
          )
      }
      await  this.$storeGetNotificacoes()
      this.loading = false;
      this.$globalEmit('i-got-clicked');
    },

  },
  created() {
    this.$storeGetNotificacoes()
  },
}
</script>

<style scoped>
html {
  overflow: hidden !important;
}

.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
