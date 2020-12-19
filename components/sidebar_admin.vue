<template>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list flat>
        <v-subheader>Ferramentas Administrativas</v-subheader>
        <v-divider></v-divider>
        <v-list-item-group color="primary">
          <v-list-item to="/utilizadores/">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Utilizadores</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/projetos">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Projetos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/produtos">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Produtos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/pedidosSuporte">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Pedidos de Suporte</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-card>
</template>

<script>
export default {
name: "sidebar_admin",
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
