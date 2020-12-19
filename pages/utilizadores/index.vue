<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
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
          <v-select :items="filtro_estado" v-model="estadoSelecionado" @change="filtrarPorEstado" label="Estado"></v-select>
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
      loading_text:'',
      users:[],
      search:'',
      cabecalhos:[
        {  text: 'Nome ', value: 'nome',},
        {  text: 'Email', value: 'email',},
        {  text: 'Tipo ', value: 'tipo_utilizador',},
        {  text: 'Estado', value: 'state'},
      ],
      filtro_estado:['Todos', 'Ativos', 'Inativos'],
      estadoSelecionado:'',
      todosUtilizadores:[],
      todosUtilizadoresAtivos:[],
      todosUtilizadoresInativos:[],

    }
  },
  methods:{
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

  },
  created() {
    this.getUsers();
    this.start();


  },
  components: {
    aux_dialog_confirmacao,
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
