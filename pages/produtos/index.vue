<template>
  <div>
      <aux_criar_familia_material ref="criarFamilia"/>
      <aux_criar_tipo_material ref="criarTipo"/>
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="!loading">
      <div v-if="this.produtos.length === 0" style="text-align: center">
        <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
        <div id="h2">Ainda não tem produtos!</div>
        <v-btn x-small to="/home">Página Inicial</v-btn>
      </div>
      <div v-else>
        <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;">
          <v-toolbar-title>
            Produtos
          </v-toolbar-title>
        </v-toolbar>
        <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;"
                   v-if="this.$auth.user.groups.includes('Administrador')">
          <v-btn small @click="criarTipo">Criar tipo de Material</v-btn>
          <v-spacer></v-spacer>
          <v-btn small @click="criarFamilia">Criar Familia de Material</v-btn>
        </v-toolbar>
        <v-card>
          <v-toolbar>
            <v-text-field
              v-model="search"
              label="Pesquisa"
              hide-details
            ></v-text-field>
          </v-toolbar>
          <v-card-text>
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
                :headers="headers"
                :items="produtos"
                :search="search"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"  icon @click="toVariantes(item)">
                        <v-icon>mdi-alpha-v-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>Detalhes do produtos e variantes</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
          <v-row v-if="this.$auth.user.groups.includes('Administrador')">
            <v-col>
              <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;">
                <v-toolbar-title>
                  Tipo de Materiais
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-data-table
                  :headers="headers_tipos"
                  :items="tipos"
                  :items-per-page="5"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-col>
            <v-col>
              <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;">
                <v-toolbar-title>
                  Familia de Materiais
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-data-table
                  :headers="headers_familias"
                  :items="familias"
                  :items-per-page="5"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import aux_criar_tipo_material from "../../components/aux_criar_tipo_material";
import aux_criar_familia_material from "../../components/aux_criar_familia_material";
export default {
  middleware: 'isFabricante',
  name: "index",
  data: () => {
    return {
      produtos: [],
      person: '',
      search: '',

      loading: true,
      loading_text: '',
      user:'',
      familias:[],
      tipos:[],

      headers_fabricante: [
        {text: 'Nome', align: 'start', sortable: true, value: 'nome',},
        {text: 'Referencia', sortable: true, value: 'referenciaFabricante'},
        {text: 'Tipo Material', sortable: true, value: 'nomeTipoMaterial'},
        {text: 'Familia Material', sortable: true, value: 'nomeFamiliaMaterial'},
        {text: 'Ações', sortable: true, value: 'actions'},
      ],

      headers: [
        {text: 'Nome', align: 'start', sortable: true, value: 'nome',},
        {text: 'Referencia', sortable: true, value: 'referenciaFabricante'},
        {text: 'Fabricante', sortable: true, value: 'emailFabricante'},
        {text: 'Tipo Material', sortable: true, value: 'nomeTipoMaterial'},
        {text: 'Familia Material', sortable: true, value: 'nomeFamiliaMaterial'},
        {text: 'Ações', sortable: true, value: 'actions'},
      ],
      headers_tipos: [
        {text: 'Nome', align: 'center', sortable: true, value: 'nome',},
        {text: 'Descrição', align: 'start', sortable: true, value: 'descricao',},
      ],
      headers_familias: [
        {text: 'Nome', align: 'center', sortable: true, value: 'nome',},
      ],
    }
  },
  methods: {
    toVariantes(item) {
      this.$router.push('/produtos/' + item.id + '/variantes/');
    },
    getProdutos() {
      this.user  = this.$auth.user.groups[0];
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
    async criarFamilia() {
      if (
        await this.$refs.criarFamilia.open()
      ) {
        this.getProdutos()
      }
    },
    async criarTipo() {
      if (
        await this.$refs.criarTipo.open()
      ) {
        this.getProdutos()
      }
    },
    getTiposMaterial() {
      this.$axios.$get('/api/tipos_material/all')
        .then((response) => {
          this.tipos = response;

        }).catch(error => {
      })
    },
    getFamiliasMaterial() {
      this.$axios.$get('/api/familia_material/all')
        .then((response) => {
          console.log(response)
          this.familias = response;

        }).catch(error => {
      })
    },
  },
  created() {
    this.getProdutos()
    this.getFamiliasMaterial()
    this.getTiposMaterial()
  },
  components:{
    aux_criar_familia_material,
    aux_criar_tipo_material
  }
}
</script>


<style scoped>

</style>
