<template>
  <div>
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col md="12">
        <v-card>
          <v-toolbar color="cyan lighten-4">
            <v-toolbar-title>Estatisticas</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col md="3">
                <v-card>
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col>
                        <v-avatar color="cyan">
                          <v-icon large color="white">mdi-account</v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <p style="font-size: 20px;">Utilizadores</p>
                        <p style="font-size: 15px;">{{ num_users }}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col md="3">
                <v-card>
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col>
                        <v-avatar color="cyan">
                          <v-icon large color="white">mdi-bookshelf</v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <p style="font-size: 20px;">Projetos</p>
                        <p style="font-size: 15px;">{{num_projetos}}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col md="3">
                <v-card>
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col>
                        <v-avatar color="cyan">
                          <v-icon large color="white">mdi-bookshelf</v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <p style="font-size: 20px;">Estruturas</p>
                        <p style="font-size: 15px;">{{num_estruturas}}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col md="3">
                <v-card>
                  <v-card-text>
                    <v-row class="d-flex align-center">
                      <v-col>
                        <v-avatar color="cyan">
                          <v-icon large color="white">mdi-cart</v-icon>
                        </v-avatar>
                      </v-col>
                      <v-col>
                        <p style="font-size: 20px;">Produtos</p>
                        <p style="font-size: 15px;">{{num_variantes}}</p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
name: "aux_home_projetista",
  data () {
    return {
      num_users:'',
      num_projetos:'',
      num_estruturas:'',
      num_variantes:'',
    }
  },methods:{
    getUsers(){
      this.$axios.$get('/api/users/all').then((response)=> this.num_users = response.length)
    },
    getProjetos(){
      this.$axios.$get('/api/projetos/all').then((response)=> this.num_projetos = response.length)
    },
    getEstruturas(){
      this.$axios.$get('/api/estruturas/all').then((response)=> this.num_estruturas = response.length)
    },
    getProdutos(){
      this.$axios.$get('/api/variantes/all').then((response)=> this.num_variantes = response.length)
    }
  },
  created() {
    this.getUsers();
    this.getProjetos();
    this.getEstruturas();
    this.getProdutos();
  }
}
</script>

<style scoped>

</style>
