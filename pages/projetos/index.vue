<template>
  <div>
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="!loading">
      <template v-if="projetos.length === 0" style="text-align: center">
        <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
        <div id="h2">Ainda não tem projetos!</div>
        <v-btn x-small to="/home">Página Inicial</v-btn>
      </template>
      <template v-else>
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
      </template>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "lista_projetos",
  data: () => {
    return {
      projetos:[],
      person:'',
      search:'',

      loading: true,
      loading_text:'',
      aux_loading: false,

      headers: [
       {  text: 'Nome Projeto',
          align: 'start',
          sortable: true,
          value: 'nome',
        },
        { text: 'Nome Projetista',sortable: true, value: 'nomeProjetista' },
        { text: 'Nome Cliente',sortable: true, value: 'nomeCliente' },
        { text: 'Estado',sortable: true, value: 'estado' },
        { text: 'Ações',sortable: true, value: 'actions'},
      ],
    }
  },
  methods:{
    toDetalhes (item){
      this.$router.push('/projetos/'+item.referencia+'/');
    },
    getProjetos (){
      this.loading = true;
      this.loading_text = "A arrumar projetos..."
      if (this.$auth.user.groups.includes('Cliente')){
        this.$axios.$get('/api/clientes/'+this.$auth.user.sub+'/projetos')
          .then((response) => {
            this.projetos = response;
            this.aux_loading = true;
          })
      }
      if (this.$auth.user.groups.includes('Projetista')){
        this.$axios.$get('/api/projetistas/'+this.$auth.user.sub+'/projetos')
          .then((response) => {
            this.projetos = response;
            this.aux_loading = true;
          })
      }
      if (this.$auth.user.groups.includes('Administrador')){
        this.$axios.$get('/api/projetos/all')
          .then((response) => {
            this.projetos = response;
            this.aux_loading = true;
          })
      }
      setTimeout(() => {
        this.loading = false;
      }, 1500);

    },
  },
  created() {
    this.getProjetos()
    this.$on('debug', function (){
      console.log("funcionou");
    })
  },
  mounted() {
    this.$on('debug', function (){
      console.log("funcionou");
    })
  }
}
</script>

<style scoped>

</style>
