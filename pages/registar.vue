<template>
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


<!-- TODO Completar formulário de registo de utilizador   -->
    <v-text-field
      prepend-inner-icon="mdi-map-marker"
      v-model="morada"
      :rules="moradaRules"
      label="Morada:"
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
          name="Localidade"
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
      <v-col md="6" >
        <v-select
          :items="tiposUtilizador"
          v-model="userType"
          label="Vou utilizar esta aplicação no papel de:"
        ></v-select>
      </v-col>
    </v-row>
    <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">Submeter </v-btn>

    <v-btn color="error" class="mr-4" @click="reset" >
      Reset Formulário
    </v-btn>
    <v-btn color="warning" class="mr-4" @click="resetValidation">
      Reset Validação
    </v-btn>
    <v-btn color="error" class="mr-4" @click="cancel">
      Cancelar
    </v-btn>
  </v-form>
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
    moradaRules:[
      v => (v.length <= 80 ) || 'Morada deve ter menos de 80 caracteres.',],

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
    nifRules: [
      v => (v.length === 9 ) || 'NIF deve ter 9 algarismos. '
    ],
    contacto:'',
    contactoRules: [
      v => (v.length === 9 ) || 'Contacto deve ter 9 algarismos. ',

    ],
    codigoPostal:'',
    localidade:'',
    password:'',
    passwordConfirmation:'',
    tiposUtilizador:['Cliente', 'Fabricante', 'Projetista'],
    userType:'',


  }),

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$axios.$post('/api/inscricoes', {
          nome: this.nome,
          email: this.email,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'Inscrição submetida com sucesso! A sua inscrição ficará a aguardar aceitação. ' +
              'Receberá novas informações no seu email.';
            this.snackbar = true;
            setTimeout(() => {
              this.$router.push('/');
            }, 5000);
          })
          .catch(error => {
            console.log(error)
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
  created() {
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider
  },

  }
</script>

<style scoped>

</style>
