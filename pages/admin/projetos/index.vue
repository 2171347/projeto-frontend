<template>
  <div>
    <v-text-field v-model="search" label="Pesquisa"></v-text-field>
    <v-data-table
      :headers="headers"
      :items="projetos"
      :items-per-page="5"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "lista_projetos",
  data () {
    return {
      projetos:[],
      projetistas:[],
      projetista:'',
      cliente:'',
      search:'',

      headers: [
        {
          text: 'Nome Projeto',
          align: 'start',
          sortable: true,
          value: 'nome',
        },
        { text: 'Projetista', value: 'emailProjetista' },
        { text: 'Cliente', value: 'emailCliente' },
        { text: 'Ações', value: 'actions'},


      ],
    }
  },
  methods:{
    toDetalhes (item){
      this.$router.push('/projetos/'+ item.referencia+'/');
    },
    getProjetos (){

      this.$axios.$get('/api/projetos/all')
        .then((response) => {
          this.projetos = response;
          console.log(this.projetos)
        })
        .then((response) => {
          for (let i = 0; i < this.projetos.length; i++){
            this.$axios.$get('/api/projetistas/'+this.projetos[i].emailProjetista).
            then((user) => {
              this.projetista = user;
            }).then((user)=> {
              this.projetistas.push(this.projetista);
            })
          }
        })
    },
  },
  created() {
    this.getProjetos()
  }
}
</script>

<style scoped>

</style>
