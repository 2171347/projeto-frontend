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
      <!--<v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field label="Nome:" :rules="nomeRules" v-model="user.nome"></v-text-field>
          <v-text-field label="Email:" :rules="emailRules" v-model="user.email"></v-text-field>

          <validation-provider v-slot="{ errors }" name="Contacto" rules="required|length:9" >
            <v-text-field :error-messages="errors" label="Telemóvel/Telefone:" v-model="user.contactoTelefonico"></v-text-field>
          </validation-provider>




        <v-btn color="success"  @click="updateUser">Guardar alterações</v-btn>
        <v-btn color="error" @click="$router.go(-1)">Cancelar</v-btn>
        </v-form>
      </v-card-text>-->
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
            <validation-provider v-slot="{ errors }" name="Contacto" rules="numeric|max:9" >
              <v-text-field :error-messages="errors" label="Telemóvel/Telefone:" v-model="user.contactoTelefonico"></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="NIF" rules="numeric|max:9">
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
    submit () {
      if(this.$refs.observer.validate()){
        //Validar os campos
        if (!this.localidade.trim(" ") || !this.rua.trim(' ') || !this.codigoPostal.trim(" ")) {
          this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
          return null;
        }
        //Validar o email
        if(this.user.email != this.email){
          this.snackbar = true;
          this.text = "Email diferente."
          //TODO verificação do email deve ser feita depois do conflito do login estar resolvido
        }
        //Enviar os dados para o update do utilizador
        /*this.snackbar = true;
        this.text = "sucesso."*/
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
  checkEmailDisponivel(){
    this.$axios.get('/api/users/'+this.email).then((response) => {
      if (response.data.value == true){
        this.errorsEmail="Email já está registado da plataforma."
        return null;
      }else{
        this.errorsEmail='';
      }
    })

  },
  created() {
    this.getUser()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
  computed:{

  },

}

</script>
<style scoped>
</style>
