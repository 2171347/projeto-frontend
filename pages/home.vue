<template>
  <div>
    <v-card>
      <v-card-title style="justify-content: center">Painel Geral do <!--{{this.$auth.user.groups[0]}}--></v-card-title>
      <v-card-text>
        Email: {{this.$auth.user.sub}}
        <!--{{this.$store.state.auth}}-->

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  //middleware: 'Authenticated',
  name: "home"
}
</script>

<style scoped>

</style>
