<template>
  <div>
    <v-dialog v-model="dialog_criar_projeto" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Criar um novo projeto
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
                <v-text-field
                  v-model="nome"
                  :counter="30"
                  :rules="nomeRules"
                  label="Nome:"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                <v-text-field
                  v-model="emailCliente"
                  :counter="30"
                  :rules="emailClienteRules"
                  label="Email do cliente"
                  required
                ></v-text-field>
              </validation-provider>
              <v-btn :disabled="invalid" color="success" small  @click="createProject">
                Criar
              </v-btn>
              <v-btn color="error" small @click="closeDialogCriarProjeto">
                Cancelar
              </v-btn>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>

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
            <v-tooltip bottom>
              <template v-if="this.$auth.user.groups.includes('Projetista')" v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="dialog_criar_projeto = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Criar um novo projeto.</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
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
          </v-card-text>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>

import aux_snackbar from "@/components/aux_snackbar";
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  name: "lista_projetos",
  data: () => {
    return {
      dialog_criar_projeto: false,
      valid: true,
      nome:'',
      nomeRules: [
        v => !!v || 'Name é um campo obrigatório',
        v => (v && v.length <= 30) || 'Nome deve no máximo 30 caracteres',
      ],
      emailCliente: '',
      emailClienteRules: [
        v => !!v || 'Email é um campo obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],

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
    closeDialogCriarProjeto(){
      this.dialog_criar_projeto = false;
    },
    createProject(){
      // Verificar se o email do cliente corresponde a um cliente:
      this.$axios.$get('/api/clientes/'+this.emailCliente+'/iscliente').then((response) => {
        if(response.value !== true){
          this.text = "O email inserido não corresponde a um email de um cliente. Por favor tente novamente."
          this.color = "error"
          this.snackbar = true;
          return null;
        }
      })

      // Criar o novo projeto:
      this.$axios.$post('/api/projetos', {
        nome: this.nome,
        referencia: "PR_"+this.nome,
        emailCliente: this.emailCliente,
        emailProjetista: this.$auth.user.sub
      }).then(()=>{
        this.color = 'green lighten-1';
        this.text = 'Projeto criado com sucesso.';
        this.snackbar = true;
        this.getProjetos()
        this.closeDialogCriarProjeto()

      }).catch(error =>{
        this.color = 'red';
        this.text = 'Ocorreu um erro na criação no projeto. Tente novamente.';
        this.snackbar = true;
      })
    },
  },
  created() {
    this.getProjetos()
  },
  components:{
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  }
}
</script>

<style scoped>

</style>
