<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app color="cyan lighten-3" style="max-width: 100%">
      <v-btn icon to="/">
        <v-icon>mdi-{{ `home` }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title v-text="title" to="/"/>
      <v-spacer />
      <v-btn small color="cyan lighten-4" to="/auth/registar" style="margin-right: 10px">
        Registar
      </v-btn>
      <v-btn small color="cyan lighten-4" to="/auth/login">
        Entrar
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!--TODO criar um footer com ligação para uma página de contacto-->
  </v-app>
</template>

<script>
export default {
  name: "before",
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Projeto+',
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
    }
  }
}
</script>

<style scoped>

</style>
