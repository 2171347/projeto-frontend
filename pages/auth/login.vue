<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="margin-top: auto">
          <v-toolbar color="amber darken-1" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                prepend-icon='mdi-account-plus'
                type="email"
                v-model.trim="email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                id="password"
                label="Palavra-Chave"
                prepend-icon='mdi-lock'
                type="password"
                v-model="password"
                required
                v-on:keyup.enter="onSubmit"
              ></v-text-field>
              <p id="link" class="text-center link" @click="redirectEsqueciPassword">Esqueci a minha palavra-chave</p>
              <v-btn color="success" style="margin-left: 35%" @click="onSubmit">Entrar</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import aux_snackbar from "../../components/aux_snackbar";
export default {
  name: "login",
  layout: "before",
  auth: false,
  components:{
    aux_snackbar
  },

  data:function (){
    return {
      auth:false,
      email: null,
      password: null,
      token:'',
      emailRules: [
        v => !!v || 'Email é um campo obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // -------------------------

      // ----------- DADOS A CARREGAR NA STORE -------
      notificacoes:'',
    }
  },
  methods:{

    async onSubmit(){
      let promise = this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
      promise.then((response) => {
        if(response.statusText === 'OK'){
          // Carregar as notificações do utilizador para a store

          this.$storeGetNotificacoes()
          this.$store.commit("setEmailUser", this.email);
        }
        this.$router.push('/home');
      });

      promise.catch(() => {
        this.color = 'red lighten-1';
        this.text = 'Dados de acesso inválidos. Por favor, tente novamente.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })
    },
    onReset() {
      this.email = null
      this.password = null
    },
    redirectEsqueciPassword(){
      this.$router.push('/auth/redirect_password');
    },
  },
}
</script>

<style scoped>
#link:hover
{
  text-decoration: underline;
  cursor: pointer;
  color: #35495e;
}
</style>
