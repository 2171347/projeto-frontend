<template>
    <v-card
      class="mx-auto"
      max-width="300"
      tile
    >
      <v-list flat>
        <v-subheader>REPORTS</v-subheader>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
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
