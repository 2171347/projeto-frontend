<template>
  <div>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'" :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="headline" style="justify-content: center">
            Recuperar a palavra-chave
          </v-card-title>
          <v-card-text style="justify-content: center; max-width: 900px; margin: auto ">
            <p class="text-center">Para recuperar a sua palavra-chave insira o email que utilizou para registo da sua conta na caixa de texto abaixo.
              De seguida receberá um email com as instruções para criar uma nova palavra-chave.</p>
            <div class="text-center" style="margin: auto">
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form @submit.prevent="submit">
                <validation-provider v-slot="{ errors }" name="email" rules="required|email">
                  <v-text-field
                    label="Email"
                    prepend-icon='mdi-at'
                    type="email"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                </validation-provider>
              <v-btn :disabled="invalid" type="submit">Submeter</v-btn>
            </v-form>
            </validation-observer>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import {ValidationProvider, ValidationObserver} from "vee-validate";
export default {
  layout: "before",
  data:function () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------
      valid: true,
      email:'',
      emailRules: [
        v => !!v || 'Email é um campo obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      date:'',
    }
  },
  methods:{
    getDate(){
      var currentDate = new Date();
      return currentDate;
    },
    submit() {
      if(this.$refs.observer.validate()){
        // Verificar se o email existe na BD
        this.$axios.$get('/api/users/' + this.email).then((response) => {
          if (response.value === true) { // O email existe
            //Enviar um email de reposição de password para o utilizador
            this.date = this.getDate();

            //Obter o token para enviar no email ao utilizador
            this.$axios.get('api/users/'+ this.email+ '/get_token').then((response) =>{
              this.$axios.post('/api/emails/' + this.$store.state.emailNoReply + '/sendto/' + this.email, {
                subject: '[Projeto +] Repor Palavra-Chave',
                message: '[Por favor não responda a este email] \n ' +
                  'Bem-vindo ao Projeto +\n ' +
                  'Foi feito um pedido para repor a sua palavra-chave. Caso não tenha feito este pedido, por favor ignore este email. \n' +
                  'Para repor a sua palavra-chave deve aceder a este link : ' +
                  'http://localhost:3000/auth/' + response.data + '/repor_password' +
                  ' e preencha o novo formulário.\n' +
                  '[' + this.date + ']'
              }).then((response) => {
              }).catch(error => {
              })
            })
          }
        })
        this.text = "Caso o email esteja associado a uma conta, irá receber um email com instruções para repor a sua palavra-chave."
        this.snackbar = true;
        setTimeout(() => {
          this.$router.push('/');
        }, 2200);
      }
    }
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}

</script>
<!--TODO adicionar o loading-->
