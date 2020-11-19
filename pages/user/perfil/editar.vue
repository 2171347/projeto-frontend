<template>
  <div>
    <v-btn @click="$router.go(-1)">Voltar</v-btn>
    <aux_snackbar v-bind:snackbar="snackbar" v-bind:text="text" v-bind:color="color"></aux_snackbar>

    <v-card style="margin-top: 10px">
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
              <v-text-field
                v-model="user.nome"
                :counter="30"
                :error-messages="errors"
                label="Nome:"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="email" rules="required|email">
              <v-text-field
                v-model="email"
                :error-messages="errors"
                label="Email:"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="Contacto" rules="numeric|length:9" >
              <v-text-field :error-messages="errors" label="Telemóvel/Telefone:" v-model="user.contactoTelefonico"></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="NIF" rules="numeric|length:9">
              <v-text-field label="NIF:" :error-messages="errors" v-model="user.nif"></v-text-field>
            </validation-provider>
            <v-text-field label="Rua:" :error-messages="errorsMorada" v-model="rua"></v-text-field>
            <v-text-field label="Código-Postal:" v-model="codigoPostal"></v-text-field>
            <v-text-field label="Localidade:" v-model="localidade"></v-text-field>

            <v-btn class="mr-4" type="submit" color="success" :disabled="invalid">
              Guardar
            </v-btn>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {ValidationProvider, ValidationObserver} from "vee-validate";

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
      errorsNif:'',
      errorsContacto:'',
      email:'',
      moradaSending:'',

      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
    }
  },
  methods:{
    checkEmailDisponivel(){
      this.$axios.get('/api/users/'+this.email).then((response) => {
        if (response.data.value === true){
          this.text = "O email inserido já está a ser utilizado. Tente novamente."
          this.snackbar = true;
          this.color = "error"
          this.email = this.user.email
          return null;
        }else{
          this.errorsEmail='';
        }
      })
    },
    submit () {
      if(this.$refs.observer.validate()){
        //Validar os campos

        if (!this.localidade || !this.rua|| !this.codigoPostal) {
          this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
          return null;
        }
        if(this.errorsMorada !== ""){
          this.errorsMorada = '';
        }

        //Validar o email
        if(this.user.email != this.email){
          this.checkEmailDisponivel();
        }

        // Definir a rota com base no tipo de utilizador
        if (this.$auth.user.groups.includes('Cliente')){
          this.url="/api/clientes/"
        }if (this.$auth.user.groups.includes('Fabricante')){
          this.url="/api/fabricantes/"
        }if (this.$auth.user.groups.includes('Projetista')){
          this.url="/api/projetistas/"
        }

        //Concatenar a morada:
        if (this.rua === ''){
          this.moradaSending = null;
        }else{
          this.moradaSending = this.rua +' | '+  this.codigoPostal +' | '+ this.localidade;
        }

        //Enviar os dados para o update do utilizador
        this.$axios.$put(this.url + this.user.email, {
          nome: this.user.nome,
          email: this.email,
          password: this.user.password,
          morada: this.moradaSending,
          contactoTelefonico: this.user.contacto,
          numContribuinte: this.user.nif,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;

            setTimeout(() => {
              this.$router.go(-1)
            }, 1500);
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
          })
      }
    },

    splitMorada(){
      this.auxiliarMorada = this.user.morada.split('|');
      this.rua = this.auxiliarMorada[0];
      this.codigoPostal = this.auxiliarMorada[1];
      this.localidade = this.auxiliarMorada[2];
    },
    getUser(){
      if (this.$auth.user.groups.includes('Cliente')){
        this.$axios.$get('/api/clientes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.email = utilizador.email;
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
  },
  created() {
    this.getUser()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}

</script>
<style scoped>
</style>
