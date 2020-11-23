<template>
  <div>
    <v-container v-if="this.loading === true" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="this.loading === false">
      <div v-if="this.produtos.length === 0" style="text-align: center">
        <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
        <div id="h2">Ainda não tem produtos!</div>
        <v-btn x-small to="/home">Página Inicial</v-btn>
      </div>
      <div v-else>
        <v-text-field
          v-model="search"
          label="Pesquisa"
          hide-details
        ></v-text-field>
        <template v-if="this.$auth.user.groups.includes('Fabricante')">
          <v-data-table
            :headers="headers_fabricante"
            :items="produtos"
            :search="search"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn x-small @click="toVariantes(item)">Variantes</v-btn>
            </template>
          </v-data-table>
        </template>
        <template v-if="this.$auth.user.groups.includes('Administrador')">
          <v-data-table
            :headers="headers_admin"
            :items="produtos"
            :search="search"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn x-small @click="toVariantes(item)">Variantes</v-btn>
            </template>
          </v-data-table>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
name: "index",
  data: () => {
    return {
      produtos:[],
      person:'',
      search:'',

      loading: true,
      loading_text:'',

      headers_fabricante: [
        { text: 'Nome', align: 'start', sortable: true, value: 'nome',},
        { text: 'Referencia',sortable: true, value: 'referenciaFabricante' },
        { text: 'Tipo Material',sortable: true, value: 'nomeTipoMaterial' },
        { text: 'Familia Material',sortable: true, value: 'nomeFamiliaMaterial' },
        { text: 'Ações',sortable: true, value: 'actions'},
      ],

      headers_admin: [
        { text: 'Nome', align: 'start', sortable: true, value: 'nome',},
        { text: 'Referencia',sortable: true, value: 'referenciaFabricante' },
        { text: 'Fabricante',sortable: true, value: 'emailFabricante' },
        { text: 'Tipo Material',sortable: true, value: 'nomeTipoMaterial' },
        { text: 'Familia Material',sortable: true, value: 'nomeFamiliaMaterial' },
        { text: 'Ações',sortable: true, value: 'actions'},
      ],
    }
  },
  methods: {
    toVariantes(item) {
      this.$router.push('/projetos/' + item.id + '/variantes');
    },
    getProdutos() {
      this.loading = true;
      this.loading_text = "A arrumar produtos..."
      if (this.$auth.user.groups.includes('Fabricante')) {
        this.$axios.$get('/api/produtos/fabricante/' + this.$auth.user.sub)
          .then((response) => {
            this.produtos = response;
          })
      }
      if (this.$auth.user.groups.includes('Administrador')) {
        this.$axios.$get('/api/produtos/all')
          .then((response) => {
            this.produtos = response;
          })
      }
      setTimeout(() => {
        this.loading = false;
      }, 500);

    },
  },
  created() {
    this.getProdutos()
  }
}
</script>


<style scoped>

</style>
