<template>
  <div>
    <div v-if="this.loading == 1">
      <v-text-field color="success" loading disabled
      ></v-text-field>
    </div>
    <div v-if="this.projetos.length == 0 && this.loading == 0" style="text-align: center">
      <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
      <div id="h2">Ainda não tem projetos!</div>
    </div>
    <div v-else>
      <v-text-field
        v-model="search"
        label="Pesquisa"
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="projetos"
        :search="search"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "lista_projetos",
  data () {
    return {
      projetos:[],
      person:'',
      search:'',
      loading: 1,

      headers: [
       {
          text: 'Nome Projeto',
          align: 'start',
          sortable: true,
          value: 'nome',
        },
       { text: 'Nome Projetista', value: 'nomeProjetista' },
       { text: 'Ações', value: 'actions'},
      ],
    }
  },
  methods:{
    toDetalhes (item){
      this.$router.push('/projetos/'+ item.referencia+'/');
    },
    getProjetos (){

      //TODO rever rotas para cliente VS projetista

      if (this.$auth.user.groups.includes('Cliente')){
        this.$axios.$get('/api/clientes/'+this.$auth.user.sub+'/projetos')
          .then((response) => {
            // TODO - realizar verificação se o projeto está visivel
            this.projetos = response;
            this.loading = 0;
          })
      }
      if (this.$auth.user.groups.includes('Projetista')){
        this.$axios.$get('/api/projetistas/'+this.$auth.user.sub+'/projetos')
          .then((response) => {
            this.projetos = response;
          })
      }
    },
  },
  created() {
    this.getProjetos()
  }
}
</script>

<style scoped>

</style>
