<template>
  <v-data-table
    :headers="headers"
    :items="projetos"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn x-small>Detalhes</v-btn>
    </template>

  </v-data-table>
</template>

<script>
export default {
  name: "lista_projetos",
  data () {
    return {
      projetos:[],
      projetistas:[],
      person:'',

      headers: [
       {
          text: 'Nome Projeto',
          align: 'start',
          sortable: true,
          value: 'nome',
        },
       { text: 'Nome Projetista', value: 'proj_nome' },
       { text: 'Ações', value: 'actions'},


      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        }
      ],
    }
  },
  methods:{
    getProjetos (){

      this.$axios.$get('/api/projetos/all')
        .then((response) => {
          this.projetos = response;
        })
        .then((response) => {
          for (let i = 0; i < this.projetos.length; i++){
            console.log("ciclo for: " + this.projetos[i].emailProjetista);
            this.$axios.$get('/api/projetistas/'+this.projetos[i].emailProjetista).
            then((user) => {

              console.log("user:" + user.nome)
              this.person = user;
            }).then((user)=> {
              console.log("person:" + this.person)

              this.projetistas.push(this.person);
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
