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
        Close
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
export default {
  name: "login",
  layout: "before",
  auth: false,
  data:function (){
    return {
      email: '',
      password: '',
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
    onSubmit(){
      let promise = this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
      promise.then(() => {

        /*console.log(promise)
        this.color = 'red lighten-1';
        this.text = "ola" +  promise.data
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
