<template>
  <v-card>
    <v-card-title style="justify-content: center">Painel Geral do {{this.$auth.user.groups[0]}}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Notificações</v-card-title>
            <v-card-text>
             user:  {{this.$store.state.user}}
              email guardado: {{this.$store.state.emailUser}}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
name: "aux_home_projetista",
  methods:{
    atualizarStore(){
      if(this.$store.state.firstLogin){
        this.$store.commit("setUser")
      }
    }
  },
  created() {
    this.atualizarStore()
  }
}
</script>

<style scoped>

</style>
