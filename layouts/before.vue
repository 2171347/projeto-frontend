<template>
  <v-app light>
    <v-app-bar :clipped-left="clipped" fixed app color="amber darken-1" style="max-width: 100%">
      <v-btn icon to="/">
        <v-icon>mdi-{{ `home` }}</v-icon>

      </v-btn>
      <v-spacer />
      <v-toolbar-title class="white--text" v-text="title" to="/"/>
      <v-spacer />
      <v-btn small color="amber darken-1" to="/auth/registar" elevation="0" style="margin-right: 10px">
        Registar
      </v-btn>
      <v-btn small color="amber darken-1" elevation="0" to="/auth/login">
        Entrar
      </v-btn>
    </v-app-bar>
    <v-main style="background-color: #ffffff">
      <v-container  style="background-color: #ffffff">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer elevation="1">
      <div class="font-weight-thin" style="font-size: 10px">Criado por Eduarda Ramos e Rafael Correia</div>
    </v-footer>
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
