<template>
 <v-app dark>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="lime darken-1"
    >
       <v-btn icon to="/">
          <v-icon>mdi-{{ `home` }}</v-icon>
       </v-btn>

      <v-spacer />
      <v-toolbar-title v-text="title" to="/"/>
      <v-spacer />
      <v-btn small color="lime lighten-3" to="/registar">
         Registar
      </v-btn>
      <v-btn small color="light-green lighten-3" to="/login">
         Entrar
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
export default {
name: "before_login",
 data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
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
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Project+'
    }
  }
}
</script>

