<template>
  <v-container>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_criar_projeto" @keydown.esc="cancel" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Criar um novo projeto
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form ref="form">
              <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
                <v-text-field
                  v-model="nome"
                  :counter="30"
                  label="Nome:"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                <v-text-field
                  v-model="emailCliente"
                  :counter="30"
                  label="Email do cliente"
                  required
                ></v-text-field>
              </validation-provider>
              <v-btn :disabled="invalid" color="success" small @click="createProject">
                Criar
              </v-btn>
              <v-btn color="error" small @click="cancel">
                Cancelar
              </v-btn>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import aux_snackbar from "./aux_snackbar";

export default {
  name: "aux_dialog_criar_projeto",
  data:function () {
    return {
      resolve:null,
      reject:null,
      dialog_criar_projeto: false,
      valid: true,
      nome:'',
      emailCliente: '',
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
    }
  },methods:{
    open() {
      this.dialog_criar_projeto = true;
      this.valid = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    createProject(){

      // Verificar se o email do cliente corresponde a um cliente:
     this.$axios.$get('/api/clientes/'+this.emailCliente+'/iscliente').then((response) => {
        if(response.value !== true){
          this.text = "O email inserido não corresponde a um email de um cliente. Por favor tente novamente."
          this.color = "error"
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          return null;
        }else{
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
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.resolve(true);
            this.dialog_criar_projeto = false;
            this.cleanFields()

          }).catch(error =>{
            /*this.color = 'red';
            this.text = 'Ocorreu um erro na criação no projeto. Tente novamente.';
            this.snackbar = true;*/
          })
        }
      })


    },
    cancel(){
      this.resolve(false);
      this.dialog_criar_projeto = false;
      this.cleanFields();
    },
    cleanFields(){
      this.emailCliente = null;
      this.nome = null;
      this.valid = true;
    }

  },
  components:{
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
