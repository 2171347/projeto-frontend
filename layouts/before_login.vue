<template>
 <v-app dark>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="cyan darken-1"
    >

      <v-spacer />
      <v-toolbar-title v-text="title" />
      <v-spacer />
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

