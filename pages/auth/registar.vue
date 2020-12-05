<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>

    <!--TODO refefinir as validações deste formulário-->
    <v-card>
      <v-card-title class="d-flex justify-center">Registo de Utilizador</v-card-title>
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form @submit.prevent="submit">
          <validation-provider v-slot="{ errors }" name="Name" rules="alpha_spaces|required">
            <v-text-field
              prepend-inner-icon="mdi-account"
              v-model="nome"
              :error-messages="errors"
              label="Nome"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Email" rules="email|required">
            <v-text-field
              prepend-inner-icon="mdi-at"
              v-model="email"
              :error-messages="errors"
              label="E-mail"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Password" rules="required|password:@confirm">
            <v-text-field
              label="Palavra-Chave:"
              v-model="password"
              :error-messages="errors"
              type="password">
              required>
            </v-text-field>
          </validation-provider>
          <validation-provider v-slot="{  errors}" name="confirm" rules="required">
            <v-text-field
              label="Confirmação da Palavra-Chave:"
              v-model="passwordConfirmation"
              :error-messages=" errors"
              required
              type="password">
            </v-text-field>
          </validation-provider>

          <v-text-field
            prepend-inner-icon="mdi-map-marker"
            v-model="morada"
            label="Morada:"
            :error-messages="errorsMorada"
            :counter="80"
          ></v-text-field>
          <v-row>
            <v-col>
              <validation-provider v-slot="{ errors }" name="CodigoPostal" rules="codigoPostal">
                <v-text-field v-model="codigoPostal" :error-messages="errors" label="Código Postal:">
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider v-slot="{ errors }" name="Localidade" rules="alpha_spaces">
                <v-text-field
                  v-model="localidade"
                  :error-messages="errors"
                  label="Localidade:"
                >
<!--                  @input="checkValidacaoMorada"-->
                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="5">
              <validation-provider v-slot="{ errors }" name="Nif" rules="length:9|numeric">
                <v-text-field
                  v-model="nif"
                  :error-messages="errors"
                  label="NIF:"
                  type="number">
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider v-slot="{ errors }" name="Contacto" rules="length:9|numeric">
                <v-text-field
                  v-model="contacto"
                  prepend-inner-icon="mdi-phone"
                  :error-messages="errors"
                  label="Telefone/Telemóvel:"
                  type="number">
                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6">
              <validation-provider v-slot="{ errors }" name="TipoUtilizador" rules="required">
                <v-select
                  :items="tiposUtilizador"
                  :error-messages="errorsUserType"
                  v-model="userType"
                  label="Vou utilizar esta aplicação no papel de:"
                ></v-select>
              </validation-provider>
            </v-col>
            <!--TODO adicionar um campo a explicar o tipo de utilizador-->
          </v-row>
          <v-btn color="success" class="mr-4" :disabled="invalid" @click="submit">Submeter</v-btn>
          <v-btn color="error" class="mr-4" @click="reset">
            Reset Formulário
          </v-btn>
          <v-btn color="warning" class="mr-4" @click="resetValidation">
            Reset Validação
          </v-btn>
          <v-btn color="error" class="mr-4" @click="cancel">
            Cancelar
          </v-btn>
        </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import { ValidationObserver, ValidationProvider } from "vee-validate";
import aux_snackbar from "../../components/aux_snackbar";

export default {
  name: "registar",
  layout:"before",
  data: () => ({
    valid: true,
    // ---- SNACKBAR INFO -----
    color: '',
    snackbar: false,
    text: '',
    // ------------------------
    morada: '',
    nome: '',
    email: '',
    nif:'',
    contacto:'',
    codigoPostal:'',
    localidade:'',
    password:'',
    passwordConfirmation:'',
    tiposUtilizador:['Cliente', 'Fabricante', 'Projetista'],
    userType:'',
    url:'',
    errorsMorada:'',
    errorsEmail:'',
    errorsUserType:'',
    errorsPassword:'',
    date:'',
    moradaSending:'',
    emailValido:'',
    moradaValido:'',
  }),

  methods: {
    async checkEmailDisponivel() {
      /*TODO apagar os console.log*/

      await this.$axios.get('/api/users/' + this.email).then((response) => {
        if (response.data.value === true) {
          console.log("Email Não Valido")
          this.emailValido = false;
          this.errorsEmail = "Email já está registado da plataforma."
          this.color = 'error';
          this.text = 'Email já existe.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);

        } else {
          console.log("Email Valido")
          this.emailValido = true;
          this.errorsEmail = '';
          return 'OK';
        }
      })
    },
    checkValidacaoMorada(){
      if(this.localidade.trim() && this.morada.trim() && this.codigoPostal.trim()){
        this.moradaValido = true;
        this.moradaSending = this.morada + ' | ' + this.codigoPostal + ' | ' + this.localidade;
        console.log("Morada Valido")
        return null;
      }
      if(!this.localidade.trim() && !this.morada.trim() && !this.codigoPostal.trim()){
        this.moradaValido = true;
        this.moradaSending = null;
        console.log("Morada Valido")
        return null;
      }

      if (!this.localidade.trim() && this.morada.trim() && this.codigoPostal.trim()){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        this.moradaValido = false;
        console.log("Morada Não Valido --> Localidade")
        return null;
      }
      if (this.localidade.trim() && !this.morada.trim() && this.codigoPostal.trim()){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        this.moradaValido = false;
        console.log("Morada Não Valido --> Morada")
        return null;
      }
      if (this.localidade.trim() && this.morada.trim() && !this.codigoPostal.trim()){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        this.moradaValido = false;
        console.log("Morada Não Valido --> Codigo Postal")
        return null;
      }
        this.errorsMorada = '';
        console.log("Morada Valido")
        this.moradaValido = true;
    },
    getDate(){
      var currentDate = new Date();
      return currentDate;
    },

    sendEmail(){
      this.date = this.getDate();

      this.$axios.post('/api/emails/'+this.$store.state.emailNoReply+'/sendto/'+this.email,{
        subject: '[Projeto +] [Registo] Bem-vindo ao Projeto+!',
        message: '[Por favor não responda a este email] \n Bem-vindo ao Projeto +\n O seu registo na aplicação foi feito com sucesso. \n['+this.date+']'
      }).then((response) => {

      }).catch(error =>{
      })
    },
    createUrl(){
      console.log("Comecou a criar a url")
      if (this.userType === 'Cliente') {
        this.url = "/api/clientes/"
      }
      if (this.userType === 'Fabricante') {
        this.url = "/api/fabricantes/"
      }
      if (this.userType === 'Projetista') {
        this.url = "/api/projetistas/"
      }
      console.log("Acabou de criar a url")
    },

    async submit() {
      if (this.$refs.observer.validate()) {

        // ----- Verificar se o email já existe na BD ---------

        await this.checkEmailDisponivel();
        if(!this.emailValido){
          return
        }
        await this.checkValidacaoMorada()
        if(!this.moradaValido){
          return
        }
        // Definir a rota com base no tipo de utilizador
        await this.createUrl()



        console.log("Continuar...")


        if (this.contacto === '') {
          this.contacto = null;
        }
        if (this.nif === '') {
          this.nif = null
        }

        this.$axios.$post(this.url, {
          nome: this.nome,
          email: this.email,
          password: this.password,
          morada: this.moradaSending,
          contactoTelefonico: this.contacto,
          numContribuinte: this.nif,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);

            this.sendEmail()
            setTimeout(() => {
              this.$router.push('/');
            }, 2000);
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    cancel(){
      this.$router.push('/')
    }
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_snackbar
  },


}
</script>

<style scoped>

</style>
