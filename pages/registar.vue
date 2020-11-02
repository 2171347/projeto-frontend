<template>
  <div>
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
    <v-form ref="form" v-model="valid" lazy-validation>
      <p class="subtitle-1 text-center">Registo de novo utilizador</p>
      <validation-provider
        v-slot="{ errors }"
        name="Name"
        rules="alpha_spaces|required"
      >
        <v-text-field
          prepend-inner-icon="mdi-account"
          v-model="nome"
          :counter="30"
          :error-messages="errors"
          :rules="nomeRules"
          label="Nome"
          required
        ></v-text-field>
      </validation-provider>
      <v-text-field
        prepend-inner-icon="mdi-at"
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
      <validation-provider
        v-slot="{ errors }"
        name="Password"
        rules="required|password:@confirm"
      >
        <v-text-field
          label="Palavra-Chave:"
          v-model="password"
          :error-messages="errors"
          type="password">
          required>
        </v-text-field>
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="confirm"
        rules="required"
      >
        <v-text-field
          label="Confirmação da Palavra-Chave:"
          v-model="passwordConfirmation"
          :error-messages="errors"
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
          <validation-provider
            v-slot="{ errors }"
            name="CodigoPostal"
            rules="codigoPostal"
          >
            <v-text-field
              v-model="codigoPostal"
              :error-messages="errors"
              label="Código Postal:"
            >
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col>
          <validation-provider
            v-slot="{ errors }"
            name="Localidade"
            rules="alpha_spaces"
          >
            <v-text-field
              v-model="localidade"
              :error-messages="errors"
              label="Localidade:"
            >
            </v-text-field>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="5">
          <validation-provider
            v-slot="{ errors }"
            name="Nif"
            rules="length:9"
          >
            <v-text-field
              v-model="nif"
              :error-messages="errors"
              outlined
              label="NIF:"
              type="number">
            </v-text-field>
          </validation-provider>
        </v-col>
        <v-col>
          <validation-provider
            v-slot="{ errors }"
            name="Contacto"
            rules="length:9"
          >
            <v-text-field
              v-model="contacto"
              :error-messages="errors"
              outlined
              label="Telefone/Telemóvel:"
              type="number">
            </v-text-field>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-select
            :items="tiposUtilizador"
            v-model="userType"
            label="Vou utilizar esta aplicação no papel de:"
          ></v-select>
        </v-col>
      </v-row>
      <v-btn  color="success" class="mr-4" @click="submit">Submeter</v-btn>

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
  </div>
</template>

<script>

import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "registar",
  layout:"before",
  data: () => ({
    valid: true,
    // ---- SNACKBAR INFO -----
    color: '',
    mode: '',
    snackbar: false,
    text: '',
    timeout: 4000,
    x: null,
    y: 'top',
    // ------------------------

    // TODO Fazer verificação dos valores de entrada para registo de utilizadores

    morada: '',
    nome: '',
    nomeRules: [
      v => !!v || 'Name é um campo obrigatório',
      v => (v && v.length <= 30) || 'Nome deve ter até 30 caracteres',
    ],
    email: '',
    emailRules: [
      v => !!v || 'Email é um campo obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    ],
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
  }),

  methods: {
    checkValidacaoMorada(){

      if (this.localidade !== '' &&  (this.morada === '' || this.localidade === '') ){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        return null;
      }
      if (this.morada !== '' && (this.localidade === '' || this.codigoPostal === '')){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        return null;
      }

      if (this.codigoPostal !== '' && ( this.morada === ''|| this.localidade === '')){
        this.errorsMorada = "Morada não está completa. Deve preencher todos os campos (morada, código postal e localidade).";
        return null;
      }
      this.errorsMorada = '';


    },
    submit () {
      if (this.$refs.form.validate()) {

        this.checkValidacaoMorada()

        // Definir a rota com base no tipo de utilizador
        if (this.userType == 'Cliente'){
          this.url="/api/clientes/"
        }if (this.userType == 'Fabricante'){
          this.url="/api/fabricantes/"
        }if (this.userType == 'Projetista'){
          this.url="/api/projetistas/"
        }

        // Definir os campos vazios a null

        if (this.morada === ''){
          this.morada = null;
        }else{
          this.morada = this.morada + this.localidade + this.codigoPostal;
        }

        this.$axios.$post(this.url, {
          nome: this.nome,
          email: this.email,
          password: this.password,
          morada: this.morada,
          contactoTelefonico: this.contacto,
          numContribuinte: this.nif,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.$router.push('/');
            }, 3000);
          })
          .catch(error => {
            console.log(error)
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
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
    ValidationProvider: ValidationProvider
  },
  updated() {
    this.checkValidacaoMorada()
  }

}
</script>

<style scoped>

</style>
