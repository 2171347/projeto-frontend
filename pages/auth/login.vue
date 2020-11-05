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
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="margin-top: auto">
          <v-toolbar color="cyan lighten-3" dark flat>
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
                required
              ></v-text-field>

              <v-text-field
                id="password"
                label="Palavra-Chave"
                prepend-icon='mdi-lock'
                type="password"
                v-model="password"
                required
              ></v-text-field>
              <!--TODO fazer a funcionalidade "esqueciPassword"-->
              <p id="link" class="text-center link" @click="redirectEsqueciPassword">Esqueci a minha palavra-chave</p>
              <v-btn color="success" style="margin-left: 35%" @click="onSubmit">Entrar</v-btn>
              <!--TODO fazer a funcionalidade: botão enter para fazer login-->
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
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: "login",
  layout: "before",
  auth: false,
  //middleware: 'notAuthenticated',
  data:function (){
    return {
      email: null,
      password: null,
      token:'',
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
    getToken(){
      this.$axios.get('/api/login/token').then((response) => {
        this.token = response;
        console.log("Token:" +this.token);
      })
    },
    onSubmit(){
      let promise = this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
      promise.then((response) => {
        //this.getToken()
        console.log(promise);
        console.log(response.data.token);
        const auth = {
          accessToken: response.data.token
        }
        this.$store.commit('setAuth', auth) // mutating to store for client rendering
        Cookie.set('auth', auth)
        console.log(this.$store)

        /*console.log(promise)
        this.color = 'red lighten-1';
        this.text = promise.data
        this.snackbar = true;
        this.$auth.setToken('local','Bearer ' + promise.data.token);
       /!* this.$auth.setRefreshToken('local', promise.data.token)*!/
        this.$axios.setHeader('Authorization', 'Bearer ' + promise.data.token);
        this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + promise.data.token)
        */
        this.$router.push('/home');
      });
      promise.catch(() => {
        this.color = 'red lighten-1';
        this.text = 'Dados de acesso inválidos. Por favor, tente novamente.';
        this.snackbar = true;
      })
    },
    onReset() {
      this.email = null
      this.password = null
    },
    redirectEsqueciPassword(){
      this.$router.push('/redirect_password');
    }
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
