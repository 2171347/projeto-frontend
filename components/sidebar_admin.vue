<template>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list flat>
        <v-subheader>Utilizadores</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Gerir Utilizadores</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
        <v-subheader>Projetos</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item to="/projetos">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Gerir Projetos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
        <v-subheader>Produtos</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item to="/projetos">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Gerir Produtos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
      </v-list>
    </v-card>
</template>

<script>
export default {
name: "sidebar_admin",
  data () {
    return {
      items: [
        {
          icon: 'mdi-apps',
          title: 'Listar Projetos',
          to: '/projetos/'
        },
        {
          icon: 'mdi-account-box-multiples',
          title: 'Listar Utilizadores',
          to: ''
        },
        {
          icon: 'mdi-apps',
          title: 'Listar Produtos',
          to: '/produtos/'
        },
        {
          icon: 'mdi-apps',
          title: 'Tipos Material',
          to: ''
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Tipos de Material',
          to: '/tipo_material/criar'
        },
        {
          icon: 'mdi-apps',
          title: 'Familias de Material',
          to: ''
        },
        {
          icon: 'mdi-plus-circle',
          title: 'Criar Familia de Mat.',
          to: '/tipo_material/criar'
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>
