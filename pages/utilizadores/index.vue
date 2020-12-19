<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog @keydown.esc="dialogInfoUser = false" v-model="dialogInfoUser" max-width="500px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            Informação do Pedido de Suporte
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogInfoUser = false" >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="margin-top: 20px;">
          <p><b>Nome:</b> {{infoUser.nome}}</p>
          <p><b>Email:</b> {{infoUser.email}}</p>
          <p><b>Tipo de utilizador:</b> {{infoUser.tipo_utilizador}}</p>
          <div v-if="infoUser.tipo_utilizador !== 'Administrador'">
            <p><b>Morada:</b> {{infoUser.morada}}</p>
            <p><b>NIF:</b> {{infoUser.numContribuinte}}</p>
            <p><b>Contacto:</b> {{infoUser.contacto}}</p>

          </div>
          <p><b>Created at:</b> {{infoUser.createdAt}}</p>
          <p><b>Deleted at:</b> {{infoUser.deletedAt}}</p>

        </v-card-text>
        <v-card-actions class="pt-3">
          <v-spacer></v-spacer>
          <v-btn color="grey" text class="body-2 font-weight-bold" @click="dialogInfoUser = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <aux_dialog_confirmacao ref="confirm"/>
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        A convocar utilizadores
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-card>
        <v-toolbar>
          <v-text-field
            v-model="search"
            label="Pesquisa"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="shrink"
            style="margin-left: 15px"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-select :items="filtro_estado" v-model="estadoSelecionado" @change="filtrarPorEstado" label="Estado" style="margin-top: 31px"></v-select>
        </v-toolbar>
        <v-card-text>
          <v-data-table :items="users"  :headers="cabecalhos" :search="search">
            <template v-slot:item.state="{ item }">
              <div v-if="item.deletedAt">
                <v-chip class="ma-2" color="red" text-color="white">
                  Inativo
                </v-chip>
              </div>
              <div v-else>
                <v-chip class="ma-2" color="green" text-color="white">
                  Ativo
                </v-chip>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on"  icon @click="toDetalhes(item)">
                    <v-icon>mdi-information</v-icon>
                  </v-btn>
                </template>
                <span>Detalhes do utilizador</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on"  icon @click="deleteUser(item)" v-if="item.email !== detalhesUser.email && !item.deletedAt">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar utilizador</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
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
      loading:true,
      detalhesUser:'',
      loading_text:'',
      users:[],
      search:'',
      cabecalhos:[
        {  text: 'Nome ', value: 'nome',},
        {  text: 'Email', value: 'email',},
        {  text: 'Tipo ', value: 'tipo_utilizador',},
        {  text: 'Estado', value: 'state'},
        {  text: 'Ações', value: 'actions'},
      ],
      filtro_estado:['Todos', 'Ativos', 'Inativos'],
      estadoSelecionado:'',
      todosUtilizadores:[],
      todosUtilizadoresAtivos:[],
      todosUtilizadoresInativos:[],
      dialogInfoUser:false,
      infoUser:'',

    }
  },
  methods:{
    getDetailsUser(){
      this.$axios.get('/api/administradores/' + this.$auth.user.sub).then((response)=>{
        this.detalhesUser = response.data;
      })
    },
    getUsers(){
      this.$axios.get('/api/users/all').then((response)=>{
        this.todosUtilizadores = response.data;
        console.log(response.data)
        this.users = response.data;
      })

      this.$axios.get('/api/users/alldeleted').then((response)=>{
        this.todosUtilizadoresInativos = response.data;
      })
      this.$axios.get('/api/users/allnotdeleted').then((response)=>{
        this.todosUtilizadoresAtivos = response.data;
        this.loading = false;
      })
    },
    async deleteUser(item) {
      if (await this.$refs.confirm.open(
        "Eliminar utilizador",
        "Tem a certeza que quer eliminar o utilizador " +item.email+" ?")
      ) {
        if (item.tipo_utilizador == 'Cliente') {
          this.$axios.$delete('/api/clientes/' + item.email).then((response) => {
            this.color = "success"
            this.text = "Utilizador eliminado com sucesso."
            this.snackbar = true;

            location.reload();

            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          }).catch((error) => {
            this.color = "error"
            this.text = "Erro ao eliminar utilizador."
            this.snackbar = true;

            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
        }
        if (item.tipo_utilizador == 'Fabricante') {
          this.$axios.$delete('/api/fabricantes/' + item.email).then((response) => {
            this.color = "success"
            this.text = "Utilizador eliminado com sucesso."
            this.snackbar = true;

            location.reload();

            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          }).catch((error) => {
            this.color = "error"
            this.text = "Erro ao eliminar utilizador."
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
        }
        if (item.tipo_utilizador == 'Projetista') {
          this.$axios.$delete('/api/projetistas/' + item.email).then((response) => {
            this.color = "success"
            this.text = "Utilizador eliminado com sucesso."
            this.snackbar = true;

            location.reload();

            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          }).catch((error) => {
            this.color = "error"
            this.text = "Erro ao eliminar utilizador."
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
        }
      }
    },
    start(){
      this.users = this.todosUtilizadores;
      this.estadoSelecionado = "Todos"
    },
    filtrarPorEstado(){
      if(this.estadoSelecionado === "Todos"){
        this.users = this.todosUtilizadores;
      }
      if(this.estadoSelecionado === "Inativos"){
        this.users = this.todosUtilizadoresInativos;
      }
      if(this.estadoSelecionado === "Ativos"){
        this.users = this.todosUtilizadoresAtivos;
      }
    },
    toDetalhes(item){
      this.dialogInfoUser = true;
      this.infoUser = item;
    },
  },
  created() {
    this.getUsers();
    this.start();
    this.getDetailsUser();
  },
  components: {
    aux_dialog_confirmacao,
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
