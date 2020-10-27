<template>
  <v-layout align-center justify-center>
    <v-flex
      xs12
      sm8
      md4
    >
      <v-card class="elevation-12" style="margin-top: auto">
        <v-toolbar
          color="cyan lighten-3"
          dark
          flat
        >
          <v-toolbar-title>Login form</v-toolbar-title>
          <v-spacer></v-spacer>

        </v-toolbar>
        <v-card-text>
          <v-form @submit.prevent="onSubmit">
            <v-text-field
              label="Email"
              prepend-icon='mdi-account-plus'
              type="email"
              v-model="email"
            ></v-text-field>

            <v-text-field
              id="password"
              label="Palavra-Chave"

              prepend-icon='mdi-lock'
              type="password"
              v-model="password"
            ></v-text-field>
            <p id="link" class="text-center link" @click="redirectEsqueciPassword">Esqueci a minha palavra-chave</p>

            <v-btn type="submit" color="success" style="margin-left: 35%" to="/home">Entrar</v-btn>
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
  layout: "before_login",
  data:function (){
    return {
      email:'',
      password:'',
    }
  },
  methods:{
    getProjetos () {

      this.$axios.$get('/api/projetos/all')
        .then((response) => {
          this.projetos = response;
        })
    },
    redirectEsqueciPassword(){
      this.$router.push('/redirect_password');
    }
  },
  created() {

  }
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
