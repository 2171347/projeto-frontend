<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="display" @keydown.esc="cancel">
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
              <validation-provider v-slot="{ errors }" name="confirm" rules="required">
                <v-text-field
                  label="Confirmação da Palavra-Chave:"
                  v-model="passwordConfirmation"
                  :error-messages=" errors"
                  required
                  type="password">
                </v-text-field>
              </validation-provider>
              <v-btn color="success" class="mr-4" @click="submit" :disabled="invalid">Submeter</v-btn>
              <v-btn color="error" class="mr-4" @click="cancel">
                Cancelar
              </v-btn>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import aux_snackbar from "./aux_snackbar";
import {ValidationObserver, ValidationProvider} from "vee-validate";
export default {
name: "aux_criar_admin",
  data: () => ({
    valid: true,
    // ---- SNACKBAR INFO -----
    color: '',
    snackbar: false,
    text: '',
    // ------------------------
    email:'',
    nome:'',
    password:'',
    passwordConfirmation:'',
    display:false,
  }),
  methods: {
    open() {
      this.display = true;
      this.valid = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    cancel(){
      this.resolve(false);
      this.display = false;
      this.cleanFields();
    },
    cleanFields(){
      this.nome = null;
      this.email = null;
      this.password = null;
      this.passwordConfirmation = null;
      this.valid = true;
    },
    async checkEmailDisponivel() {
      await this.$axios.get('/api/users/' + this.email).then((response) => {
        if (response.data.value === true) {
          this.emailValido = false;
          this.errorsEmail = "Email já está registado da plataforma."
          this.color = 'error';
          this.text = 'Email já existe.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);

        } else {
          this.emailValido = true;
          this.errorsEmail = '';
          return 'OK';
        }
      })
    }, getDate() {
      var currentDate = new Date();
      return currentDate;
    },

    sendEmail() {
      this.date = this.getDate();

      this.$axios.post('/api/emails/' + this.$store.state.emailNoReply + '/sendto/' + this.email, {
        subject: '[Projeto +] [Registo] Bem-vindo ao Projeto+!',
        message: '[Por favor não responda a este email] \n Bem-vindo ao Projeto +\n O seu registo na aplicação foi feito com sucesso. \n[' + this.date + ']'
      }).then((response) => {

      }).catch(error => {
      })
    },

    async submit() {
      if (this.$refs.observer.validate()) {

        // ----- Verificar se o email já existe na BD ---------

        await this.checkEmailDisponivel();
        if (!this.emailValido) {
          return
        }
        // Definir a rota com base no tipo de utilizador


        this.$axios.$post('/api/administradores', {
          nome: this.nome,
          email: this.email,
          password: this.password,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);

            this.sendEmail()
            this.resolve(true);
            this.display= false;
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
            this.resolve(false)
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
      }
    },

  },
  components: {
    aux_snackbar,
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  }
}
</script>

<style scoped>

</style>
