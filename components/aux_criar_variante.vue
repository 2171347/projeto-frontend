<template>
  <v-container>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_criar_variante" @keydown.esc="cancel" max-width="700px">
      <v-card>
        <v-card-title class="headline">
          Criar uma Variante do Produto {{produto.nome}}
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
              <validation-provider v-slot="{ errors }" name="weff_p" rules="required">
                <v-text-field
                  v-model="weff_p"
                  label="Modo Elástico Positivo (WEFF_P):"
                  required
                  type="number"
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="weff_n" rules="required">
                <v-text-field
                  v-model="weff_n"
                  label="Modo Elástico Negativo (WEFF_N):"
                  type="number"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="ar" rules="required">
                <v-text-field
                  v-model="ar"
                  label="Área:"
                  type="number"
                  @change="calcularPP"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="pp" rules="required">
                <v-text-field
                  v-model="pp"
                  label="Peso Próprio:"
                  readonly
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="sigmaC" rules="required">
                <v-text-field
                  v-model="sigmaC"
                  label="Tensão de Cedência (sigmaC):"
                  type="number"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="mcr_p" rules="required">
                <v-text-field
                  v-model="mcr_p"
                  label="Movimentos Criticos Positivos (mcr_p):"
                  hint="chave:valor,chave:valor,chave:valor"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="mcr_p" rules="required">
                <v-text-field
                  v-model="mcr_n"
                  label="Movimentos Criticos Negativos (mcr_n):"
                  hint="chave:valor,chave:valor,chave:valor"
                  required
                ></v-text-field>
              </validation-provider>
              <v-btn :disabled="invalid" color="success" small @click="createVariante">
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
  name: "aux_criar_variante",
  data:function () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      dialog_criar_variante: false,
      nome:'',
      weff_p:'',
      weff_n:'',
      mcr_p:'',
      mcr_n:'',
      ar:'',
      sigmaC:'',
      pp:'',
      produto:''
    }
  },
  methods:{
    open() {
      this.dialog_criar_variante = true;
      this.valid = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    getProduto(){
      this.$axios.$get('/api/produtos/'+this.$route.params.idProduto)
      .then((produto)=>{
        this.produto = produto;
      })
    },
    createVariante(){
      // Criar uma nova variante:
      this.$axios.$post('/api/variantes', {
        nome: this.nome,
        produtoID: this.produto.id,
        weff_p:this.weff_p,
        weff_n:this.weff_n,
        ar:this.ar,
        sigmaC:this.sigmaC,
        mcr_p: this.mcr_p,
        mcr_n: this.mcr_n

      }).then(()=>{
        this.color = 'green lighten-1';
        this.text = 'Variante criado com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.resolve(true);
        this.dialog_criar_variante = false;
        this.cleanFields()

      }).catch(error =>{
        this.color = 'red';
        this.text = 'Ocorreu um erro na criação da variante. Tente novamente.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })
    },
    cancel(){
      this.resolve(false);
      this.dialog_criar_variante = false;
      this.cleanFields();
    },
    cleanFields(){
      this.nome = null;
      this.weff_p = null;
      this.weff_n = null;
      this.ar = null;
      this.sigmaC = null;
      this.valid = true;
    },
    calcularPP(){
      let G = 78.5
      this.pp = G * this.ar * Math.pow(10, -6)
    }
  },
  created() {
    this.getProduto();
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
