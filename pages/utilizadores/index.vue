<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <aux_dialog_confirmacao ref="confirm"/>
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
        <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;">
          Utilizadores
        </v-toolbar>

        <v-card>
          <v-toolbar >
            <v-text-field
              v-model="search"
              label="Pesquisa"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="shrink"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-select @change="filtrosEstado" v-model="tipo_selecionado" label="Tipo de utilizadores:" style="margin-top: 18px;"></v-select>
            <v-spacer></v-spacer>
            <v-select @click="filtrosEstado" :items="filter_users_estado" v-model="estado_selecionado" label="Estado:" style="margin-top: 18px;"></v-select>
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
              :items="dados"
              :headers="headers_all"
              :search="search"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="toDetalhes(item)"><v-icon>mdi-information</v-icon></v-btn>
                <v-btn icon @click="btnDelete(item)" v-if="email_admin != item.email"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>
import aux_dialog_confirmacao from "../../components/aux_dialog_confirmacao";
import aux_snackbar from "../../components/aux_snackbar";
export default {
  name: "index",
  data: () => {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      email_admin:'',
      loading: true,
      loading_text: '',
      users:'',
      search:'',
      headers_all: [
        {  text: 'Nome', align: 'start', sortable: true, value: 'nome'},
        {  text: 'Tipo', align: 'start', sortable: true, value: 'tipo_utilizador'},
        {  text: 'Email', align: 'start', sortable: true, value: 'email'},
        {  text: 'Created At', align: 'start', sortable: true, value: 'createdAt'},
        {  text: 'Ações', value: 'actions'},
      ],
      filter_users_type:[
        {text: 'Todos', value: 'all'},
        {text: 'Clientes', value: 'clientes'},
        {text: 'Administradores', value: 'administradores'},
        {text: 'Fabricantes', value: 'fabricantes'},
        {text: 'Projetistas', value: 'projetistas'},
      ],
      filter_users_estado:[
        {text: 'Todos', value: 'all'},
        {text: 'Ativos', value: 'ativos'},
        {text: 'Eliminados', value: 'eliminados'},
      ],
      estado_selecionado:'',
      tipo_selecionado:'',
      dados:[],
      clientes:[],
      projetistas:[],
      fabricantes:[],
      administradores:[],
      clientes_not_deleted:[],
      projetistas_not_deleted:[],
      fabricantes_not_deleted:[],
      administradores_not_deleted:[],
      clientes_deleted:[],
      projetistas_deleted:[],
      fabricantes_deleted:[],
      administradores_deleted:[],
      todosUtilizadores:[],
      todosUtilizadoresApagados:[],
      todosUtilizadoresNaoApagados:[],
    }

  },
  methods:{
    start(){
      this.getUtilizadores();
      this.dados = JSON.parse(JSON.stringify(this.todosUtilizadores));
      this.tipo_selecionado = {text: 'Todos', value: 'all'};
      this.estado_selecionado = {text: 'Todos', value: 'all'};
      this.email_admin = this.$auth.user.sub;
    },
    getUtilizadores(){
      this.loading = true;
      this.loading_text = "A convocar clientes..."
      this.$axios.$get('/api/users/all')
        .then((response) => {
          this.users = response;
          this.todosUtilizadores = response;
          for (let aux in this.users) {
            if (this.users[aux].tipo_utilizador === 'Cliente') {
              this.clientes.push(this.users[aux]);
            }
            if (this.users[aux].tipo_utilizador === 'Fabricante') {
              this.fabricantes.push(this.users[aux]);
            }
            if (this.users[aux].tipo_utilizador === 'Projetista') {
              this.projetistas.push(this.users[aux]);
            }
            if (this.users[aux].tipo_utilizador === 'Administrador') {
              this.administradores.push(this.users[aux]);
            }
          }
        })
      this.$axios.$get('/api/users/allnotdeleted')
        .then((response) => {
          this.users = response;
          this.todosUtilizadoresNaoApagados = response;
          for (let aux in response) {
            if (response[aux].tipo_utilizador === 'Cliente') {
              this.clientes_not_deleted.push(response[aux]);
            }
            if (response[aux].tipo_utilizador === 'Fabricante') {
              this.fabricantes_not_deleted.push(response[aux]);
            }
            if (response[aux].tipo_utilizador === 'Projetista') {
              this.projetistas_not_deleted.push(response[aux]);
            }
            if (response[aux].tipo_utilizador === 'Administrador') {
              this.administradores_not_deleted.push(response[aux]);
            }
          }
        })
        this.$axios.$get('/api/users/alldeleted')
          .then((response) => {
            this.users = response;
            this.todosUtilizadoresApagados = response;
            for (let aux in response) {
              if (response[aux].tipo_utilizador === 'Cliente') {
                this.clientes_deleted.push(response[aux]);
              }
              if (response[aux].tipo_utilizador === 'Fabricante') {
                this.fabricantes_deleted.push(response[aux]);
              }
              if (response[aux].tipo_utilizador === 'Projetista') {
                this.projetistas_deleted.push(response[aux]);
              }
              if (response[aux].tipo_utilizador === 'Administrador') {
                this.administradores_deleted.push(response[aux]);
              }
            }
            this.loading = false;
          })
    },
    toDetalhes(){

    },
    async btnDelete(item) {
      if (await this.$refs.confirm.open(
        "Eliminar Utilizador",
        "Tem a certeza que quer eliminar o utilizador " + item.nome + " ?")
      ) {
        this.loading = true;
        this.loading_text = 'A convocar clientes...'

        if(item.tipo_utilizador === "Cliente"){
          this.$axios.$delete('api/clientes/'+ item.email)
            .then((response) => {
              this.getUtilizadores()
              this.color = "success";
              this.text = "Utilizador eliminado com sucesso."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
            .catch((error) =>{
              this.getUtilizadores()
              this.color = "error";
              this.text = "Ocorreu um erro ao eliminar o utilizador."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
          })
        }
        if(item.tipo_utilizador === "Projetista"){
          this.$axios.$delete('api/projetistas/'+ item.email)
            .then((response) => {
              this.getUtilizadores()
              this.color = "success";
              this.text = "Utilizador eliminado com sucesso."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
            .catch((error) =>{
              this.getUtilizadores()
              this.color = "error";
              this.text = "Ocorreu um erro ao eliminar o utilizador."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
        }
        if(item.tipo_utilizador === "Fabricante"){
          this.$axios.$delete('api/fabricantes/'+ item.email)
            .then((response) => {
              this.getUtilizadores()
              this.color = "success";
              this.text = "Utilizador eliminado com sucesso."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
            .catch((error) =>{
              this.getUtilizadores()
              this.color = "error";
              this.text = "Ocorreu um erro ao eliminar o utilizador."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
        }
        if(item.tipo_utilizador === "Administrado"){
          this.$axios.$delete('api/administradores/'+ item.email)
            .then((response) => {
              this.getUtilizadores()
              this.color = "success";
              this.text = "Utilizador eliminado com sucesso."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
            .catch((error) =>{
              this.getUtilizadores()
              this.color = "error";
              this.text = "Ocorreu um erro ao eliminar o utilizador."
              this.snackbar = true;
              setTimeout(() => {
                this.snackbar = false;
              }, 2000);
            })
        }
      } else {
        return null;
      }
    },
    filtrosEstado(){
      if(this.tipo_selecionado.value === 'all' && this.estado_selecionado.value === 'all'){
        console.log("1")
        this.dados = JSON.parse(JSON.stringify(this.todosUtilizadores));
      }
      if(this.tipo_selecionado.value === 'all' && this.estado_selecionado.value === 'ativos'){
        console.log("2")
        this.dados = JSON.parse(JSON.stringify(this.todosUtilizadoresNaoApagados));
      }
      if(this.tipo_selecionado.value === 'all' && this.estado_selecionado.value === 'eliminados'){
        console.log("3")
        this.dados = JSON.parse(JSON.stringify(this.todosUtilizadoresApagados));
      }
    },
  },
  created() {
    this.start()
  },
  components: {
    aux_dialog_confirmacao,
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
