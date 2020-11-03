<template>
  <div>
    <v-btn @click="$router.go(-1)">Voltar</v-btn>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Dados da Estrutura</v-card-title>
          <v-card-text>
            {{this.estrutura}}
            <p><b>Referencia Projeto:</b> </p>
            <p><b>Nome Projeto:</b> </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      estrutura: '',
    }
  },
  methods:{
    getEstrutura(){
      this.$axios.$get('/api/estruturas/'+this.$route.params.refEstrutura).then((struct) => {
        this.estrutura = struct;
      })
    },
  },
  created() {
    this.getEstrutura();
  }
}
</script>
