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
        <v-form ref="form" v-model="valid" lazy-validation>

          <v-text-field
            v-model="nome"
            :counter="30"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>
          <v-text-field
            v-model="emailCliente"
            :counter="30"
            :rules="emailClienteRules"
            label="Email do cliente"
            required
          ></v-text-field>
          <v-btn :disabled="!valid" color="success" small  @click="createProject">
            Criar
          </v-btn>
          <v-btn color="error" small @click="closeDialogCriarProjeto">
            Cancelar
          </v-btn>
        </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title style="justify-content: center">Painel Geral do {{ this.$auth.user.groups[0] }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title style="justify-content: center">Projetos</v-card-title>
              <v-card-text> Os meus projetos vão aparecer aqui</v-card-text>
            </v-card>
          </v-col>
          <v-col md="3">
            <vcard_notificacoes_homepage/>
          </v-col>
          <v-col md="2">
            <v-card>
              <v-card-title style="justify-content: center">Ações</v-card-title>
              <v-card-text>
                <v-btn @click="dialog_criar_projeto = true">Criar projeto</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import aux_snackbar from "@/components/aux_snackbar";
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";


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
      // ------------------------
    }
  },
  methods:{
    closeDialogCriarProjeto(){
      this.dialog_criar_projeto = false;
    },
    createProject(){
      // Verificar se o email do cliente existe na BD:
      this.$axios.get('/api/users/'+this.email).then((response) => {
        if (response.data.value !== true) {
          this.text = "O email inserido não corresponde a nenhum cliente registado."
          this.snackbar = true;
          this.color = "error"
          return null;
        }
      })
      console.log("ERROR ASDQUI")
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
        this.closeDialogCriarProjeto()

      }).catch(error =>{
        console.log(error)
        this.color = 'red';
        this.text = 'Ocorreu um erro na criação no projeto. Tente novamente.';
        this.snackbar = true;
      })
    }
  },
  components:{
  aux_snackbar,
  vcard_notificacoes_homepage,
  }

}
</script>

<style scoped>

</style>
