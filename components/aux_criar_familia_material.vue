<template>
  <v-container>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_criar_familia" @keydown.esc="cancel" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Criar Familia de Material
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
              <v-btn :disabled="invalid" color="success" small @click="createFamiliaMaterial">
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
  name: "aux_criar_familia_material",
  data:function () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      dialog_criar_familia: false,
      nome:'',
    }
  },
  methods:{
    open() {
      this.dialog_criar_familia = true;
      this.valid = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    createFamiliaMaterial(){
      // Verificar se o email do cliente corresponde a um cliente:
      this.$axios.$post('/api/familia_material/',{
        nome: this.nome,
      }).then((response) => {
        this.text = "Familia de Material criada com sucesso"
        this.color = "success"
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.cleanFields();
        this.resolve(true);
        this.dialog_criar_familia = false;
      }).catch((error)=>{
        this.text = "Erro ao criar familia de produto."
        this.color = "error"
        this.snackbar = true;
        this.resolve(false);
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })

    },
    cancel(){
      this.resolve(false);
      this.dialog_criar_familia = false;
      this.cleanFields();
    },
    cleanFields(){
      this.nome = null;
      this.descricao = null;
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
