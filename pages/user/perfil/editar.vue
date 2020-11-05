<template>
  <div>
    <v-btn @click="$router.go(-1)">Voltar</v-btn>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-card style="margin-top: 10px">
      <v-card-text>
        <validation-provider v-slot="{ errors }" name="Name" rules="required|alpha_spaces">
          <v-text-field :error-messages="errors" label="Nome:" v-model="this.user.nome"></v-text-field>
        </validation-provider>
        <v-text-field label="Email:" v-model="this.user.email"></v-text-field>
        <validation-provider v-slot="{ errors }" name="Name" rules="length:9">
          <v-text-field :error-messages="errors" label="Telemóvel/Telefone:" v-model="this.user.contactoTelefonico"></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="Name" rules="length:9">
          <v-text-field label="NIF:" error-messages="errors" v-model="this.user.nif"></v-text-field>
        </validation-provider>
        <v-text-field label="Rua:" :error-messages="errorsMorada" v-model="this.rua"></v-text-field>
        <v-text-field label="Código-Postal:" v-model="this.codigoPostal"></v-text-field>
        <v-text-field label="Localidade:" v-model="this.localidade"></v-text-field>
        <v-btn color="success">Guardar alterações</v-btn>
        <v-btn color="error" @click="$router.go(-1)">Cancelar</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
name: "editar",
  data: () => {
    return {
      user:'',
      user_dados_originais:'',
      rua:'',
      codigoPostal:'',
      localidade:'',
      auxiliarMorada:'',
      errorsMorada:'',


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
    splitMorada(){
      this.auxiliarMorada = this.user.morada.split('|');
      this.rua = this.auxiliarMorada[0];
      this.codigoPostal = this.auxiliarMorada[1];
      this.localidade = this.auxiliarMorada[2];
      console.log(this.auxiliarMorada);

    },
    getUser(){
      if (this.$auth.user.groups.includes('Cliente')){
        this.$axios.$get('/api/clientes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.user_dados_originais = utilizador;
          this.splitMorada();
        })
      }
      if (this.$auth.user.groups.includes('Projetista')){
        this.$axios.$get('/api/projetistas/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.user_dados_originais = utilizador;
          this.splitMorada();
        })
      }
      if (this.$auth.user.groups.includes('Fabricante')){
        this.$axios.$get('/api/fabricantes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.user_dados_originais = utilizador;
          this.splitMorada();
        })
      }
      if (this.$auth.user.groups.includes('Administrador')){
        this.$axios.$get('/api/administradores/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.user_dados_originais = utilizador;
          this.splitMorada();
        })
      }

    },
    updateUser(){

      //Validar os campos
      if (!this.localidade.trim(" ")  ||  !this.rua.trim(' ') || !this.codigoPostal.trim(" ") ){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        return null;
      }


      //Enviar os dados para o update do utilizador


    }
  },
  mounted() {
    this.getUser()
  }
}

</script>

<style scoped>

</style>
