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
              <validation-provider v-slot="{ errors }" name="Tipo Material" rules="required">
                <v-select :items="tiposMaterial" item-value="id" item-text="nome" v-model="tipoMaterialSelecionado" label="Tipo de Material:"></v-select>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Familia Material" rules="required">
                <v-select :items="familiasMaterial" item-value="id" item-text="nome" v-model="familiaMaterialSelecionado" label="Familia de Material:"></v-select>
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
      tiposMaterial:'',
      tipoMaterialSelecionado:'',
      familiasMaterial:'',
      familiaMaterialSelecionado:'',
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
      this.$axios.$get('/api/tipos_material/all').then((response)=>{
        this.tiposMaterial = response;
      })
    },
    getFamiliasMaterial(){
      this.$axios.$get('/api/familia_material/all').then((response)=>{
        this.familiasMaterial = response;
      })
    },
    createProduto(){
      // Verificar se o email do cliente corresponde a um cliente:
      this.$axios.$post('/api/produtos/',{
        referenciaFabricante: this.refFabricante,
        nome: this.nome,
        emailFabricante: this.$auth.user.sub,
        idTipoMaterial: this.tipoMaterialSelecionado,
        idFamiliaMaterial: this.familiaMaterialSelecionado,
      }).then((response) => {
          this.text = "Produto criado com sucesso"
          this.color = "success"
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.cleanFields();
          this.dialog_criar_produto = false;
      }).catch((error)=>{
        this.text = "Erro ao criar produto."
        this.color = "error"
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })

    },
    cancel(){
      this.resolve(false);
      this.dialog_criar_produto = false;
      this.cleanFields();
    },
    cleanFields(){
      this.refFabricante = null;
      this.nome = null;
      this.familiaMaterialSelecionado = null;
      this.tipoMaterialSelecionado = null;
      this.valid = true;
    }
  },
  created() {
    this.getTiposMaterial();
    this.getFamiliasMaterial();
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
