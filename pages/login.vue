<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex
      xs12
      sm8
      md4
    >
      <v-card class="elevation-12">
        <v-toolbar
          color="primary"
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
              label="Password"

              prepend-icon='mdi-lock'
              type="password"
              v-model="password"
            ></v-text-field>

            <v-btn type="submit" color="primary" style="margin-left: 35%" to="/home">Submit</v-btn>
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
  },
  created() {

  }
}
</script>

<style scoped>

</style>
