<template>
  <v-card class="mx-auto" max-width="500" >
      <v-toolbar>
        <v-toolbar-title>Notificações</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="setAllNotificacoesLidas">
              <v-icon>mdi-check-box-outline</v-icon>
            </v-btn>
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
              v-if="index < notificacoes.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </template>
      <template v-if="notificacoes.length === 0 && !loading">
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
        this.notificacoes = notificacoes.data;
      })
    },
    async setNotificacaoLida(item) {
      this.loading = true;
      item.lido = true;
      await this.$axios.put('/api/notificacoes/' + item.id + '/lido')
        .then((response) => {
          }
        )
      await this.getNotificacoes()
      this.loading = false;

    },
    setNotificacaoNaoLida(item){
      item.lido = false;
    },
    async setAllNotificacoesLidas() {
      this.loading = true;
      for (let aux in this.notificacoes) {
        await this.$axios.put('/api/notificacoes/' + this.notificacoes[aux].id + '/lido')
          .then((response) => {
            }
          )
      }
      await this.getNotificacoes()
      this.loading = false;
      this.$globalEmit('i-got-clicked', this.clickCount);
    },

  },
  created() {
    this.getNotificacoes()
  },
}
</script>

<style scoped>

</style>
