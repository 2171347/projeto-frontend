<template>
  <v-app dark>
    <v-container>
      <v-row v-if="error.statusCode === 404">
          <h1>{{ pageNotFound }}</h1>
          <v-btn @click="$router.go(-1)">Voltar</v-btn>
      </v-row>

      <v-row v-if="error.statusCode === 403">
        <h1>{{ forbidden }}</h1>
      </v-row>
      <v-row v-if="error.statusCode === 401">
        <h1>{{ unautorized }}</h1>
      </v-row>
      <v-row>
        <v-btn to="/">Página Inicial</v-btn>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      forbidden: '403 Forbidden',
      unautorized: '401 Unauthorized'
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
