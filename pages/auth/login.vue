<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4 >
      <v-card class="elevation-12" style="margin-top: auto">
        <v-toolbar color="cyan lighten-3" dark flat >
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
            {{this.email}}
            <v-text-field
              id="password"
              label="Palavra-Chave"
              prepend-icon='mdi-lock'
              type="password"
              v-model="password"
              required
            ></v-text-field>
            {{this.password}}
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
        this.$toast.success('You are logged in!')
        // check if the user $auth.user object is set
        console.log(this.$auth.user)
        // TODO redirecionar o utilizador com base do tipo
        // eg:
        // if (this.$auth.user.groups.includes('Teacher')) {
        // this.$router.push('url-to-teacher-subjects')
        // } else if (...) {
        // ...
        // }
      });
      promise.catch(() => {
        //TODO alterar o toast para um mais agradavel em caso de erro
        this.$toast.error('Sorry, you cant login. Ensure your credentials are correct')
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
