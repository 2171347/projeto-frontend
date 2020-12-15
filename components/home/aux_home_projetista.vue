<template>
  <div>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'" :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <aux_dialog_criar_projeto ref="criarProjeto"/>
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
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn icon v-on="on" @click="toProjetos" :disabled="projetos.length === 0">
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                </div>
              </template>
              <span>Listar todos os projetos</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="criarProjeto">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Criar um novo projeto.</span>
            </v-tooltip>
          </v-toolbar>
          <template v-if="projetos.length === 0" >
            <v-card-text style="margin-top: 15px">
              <p>De momento não tem projetos.</p>
            </v-card-text>
          </template>
          <template v-if="projetos.length !== 0" >
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
          </template>
        </v-card>
      </v-col>
      <v-col md="3">
        <vcard_notificacoes_homepage/>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <aux_suporte_component/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import aux_snackbar from "../aux_snackbar";
import vcard_notificacoes_homepage from "../vcard_notificacoes_homepage";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import aux_dialog_criar_projeto from "../aux_dialog_criar_projeto";
import aux_suporte_component from "../aux_suporte_component";
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
    toProjetos(){
      this.$router.push('/projetos');
    },
    async criarProjeto() {
      if (
        await this.$refs.criarProjeto.open()
      ) {
        this.getProjetos()
      }
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
    aux_dialog_criar_projeto,
    aux_suporte_component
  }

}
</script>

<style scoped>

</style>
