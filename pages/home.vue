<template>
  <div>
    <v-card>
      <v-card-title style="justify-content: center">Painel Geral do {{this.$auth.user.groups[0]}}</v-card-title>
      <v-card-text>

        {{this.$auth.user.sub}}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
name: "home"
}
</script>

<style scoped>

</style>
