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
      <template v-if="users.length === 0" style="text-align: center">
        <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
        <div id="h2">Ainda não tem projetos!</div>
        <v-btn x-small to="/home">Página Inicial</v-btn>
      </template>
      <template v-else>
        <v-card>
          <v-toolbar>
            <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">Projetos</v-toolbar-title>
            <v-text-field
              v-model="search"
              label="Pesquisa"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="shrink"
            ></v-text-field>
            <v-spacer></v-spacer>
<!--            <v-tooltip bottom>
              <template v-if="this.$auth.user.groups.includes('Projetista')" v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="dialog_criar_projeto = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Criar um novo projeto.</span>
            </v-tooltip>-->
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :items="users"
              :headers="headers"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data: () => {
    return {
      loading: true,
      loading_text: '',
      users:'',
      search:'',
      headers: [
        {  text: 'Nome', align: 'start', sortable: true, value: 'nome'},
        {  text: 'Tipo', align: 'start', sortable: true, value: 'tipo_utilizador'},

      ],
    }
  },
  methods:{
    getUtilizadores(){
      this.loading = true;
      this.loading_text = "A convocar clientes..."
      this.$axios.$get('/api/users/all')
        .then((response) => {
          console.log(response)
          this.users = response;
          this.loading = false;
        })
    }
  },
  created() {
    this.getUtilizadores();
  }
}
</script>

<style scoped>

</style>
