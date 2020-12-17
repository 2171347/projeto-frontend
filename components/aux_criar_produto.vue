<template>
  <v-container>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_criar_produto" @keydown.esc="cancel" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Criar um produto
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
              <validation-provider v-slot="{ errors }" name="Referencia Fabricante" rules="required">
                <v-text-field
                  v-model="refFabricante"
                  :counter="30"
                  label="Referência do fabricante:"
                  required
                ></v-text-field>
              </validation-provider>
              <v-btn :disabled="invalid" color="success" small @click="createProduto">
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
  name: "aux_criar_produto",
  data:function () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      dialog_criar_produto: false,
      nome:'',
      refFabricante:'',
    }
  },
  methods:{
    open() {
      this.dialog_criar_produto = true;
      this.valid = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    getTiposMaterial(){
      this.$axios.$get('/api/tipos_material/')
    },
    createProduto(){
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
  created() {

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
