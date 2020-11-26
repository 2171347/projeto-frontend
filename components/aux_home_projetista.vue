<template>
  <div>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'" :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
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
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar >
            <v-toolbar-title class="d-flex justify-center">Projetos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
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
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="3">
        <vcard_notificacoes_homepage/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import aux_snackbar from "@/components/aux_snackbar";
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";
import {ValidationObserver, ValidationProvider} from "vee-validate";


export default {
name: "aux_home_projetista",

  data:function (){
    return {
      // --- Dados para dialog de criar projeto ----
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
      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ----------Dados dos projetos--------------
      headers: [
        {  text: 'Nome Projeto',
          value: 'nome',
        },
        { text: 'Nome Cliente',sortable: true, value: 'nomeCliente' },
        { text: 'Ações',sortable: true, value: 'actions'},
      ],
      loading_projetos: false,
      projetos:[],
    }
  },
  methods:{
    closeDialogCriarProjeto(){
      this.dialog_criar_projeto = false;
    },
    toDetalhes (item){
      this.$router.push('/projetos/'+item.referencia+'/');
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
    getProjetos(){
      this.$axios.$get('/api/projetistas/'+this.$auth.user.sub+'/projetos')
        .then((response) => {
          this.projetos = response;
          this.loading_projetos = true;
        })
    }
  },
  created() {
    this.getProjetos()
  },
  components:{
    aux_snackbar,
    vcard_notificacoes_homepage,
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  }

}
</script>

<style scoped>

</style>
