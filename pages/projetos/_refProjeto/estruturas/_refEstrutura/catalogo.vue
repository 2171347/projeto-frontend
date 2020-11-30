<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout" :top="y === 'top'"
      :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>


    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="!loading">
      <v-toolbar>
        <v-btn @click="$router.go(-1)">Voltar</v-btn>
        <v-breadcrumbs :items="caminhos">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-toolbar>

      <v-row>
        <v-col>
          <template v-if="produtos.length === 0" style="text-align: center">
            <div class="text-h2 font-weight-light" style="margin-top: 10px">Ooops!</div>
            <div id="h2">Ainda não tem produtos!</div>
            <v-btn x-small to="/home">Página Inicial</v-btn>
          </template>
          <template v-else>
            <v-card>
              <v-toolbar>
                <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">Catálogo de Produtos
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="produtos"
                  :search="search"
                  :expanded="expanded"
                  :single-expand="singleExpand"
                  :expanded.sync="expanded"
                  show-expand
                  class="elevation-1"
                  @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-text-field
                        v-model="search"
                        label="Pesquisa Produtos"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        class="shrink"
                        style="margin-right: 15px"
                      ></v-text-field>
                      <v-text-field
                        v-model="search_variantes"
                        label="Pesquisa Variantes"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        class="shrink"
                      ></v-text-field>
                      <v-spacer></v-spacer>
                      <v-btn :disabled="selected.length === 0" @click="adicionarProdutos" style="margin-right: 10px">Adicionar</v-btn>
                      <v-switch v-model="singleExpand" label="Expansão Única" class="mt-5"></v-switch>
                    </v-toolbar>
                  </template>
                  <template v-slot:expanded-item="{ headers, item}">
                    <td :colspan="headers.length" v-if="item.variantes.length !==0">
                      <v-data-table
                        v-model = "selected"
                        item-key="codigo"
                        :headers="headers_variantes"
                        :items="item.variantes"
                        :search="search_variantes"
                        class="elevation-0"
                        dense
                        multi-sort
                        show-select
                        hide-default-footer
                        no-data-text="Não contém variantes"
                      ></v-data-table>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: 'isFabricante',
  name: "catalogo",
  data: () => {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------


      singleExpand: false,
      expanded: [],

      produtos: [],
      estrutura:'',
      person: '',
      search: '',
      search_variantes:'',
      selected:[],

      loading: true,
      loading_text: '',

      headers: [
        {text: 'Produto', align: 'start', sortable: true, value: 'nome',},
        {text: 'Referencia', sortable: true, value: 'referenciaFabricante'},
        {text: 'Tipo Material', sortable: true, value: 'nomeTipoMaterial'},
        {text: 'Familia Material', sortable: true, value: 'nomeFamiliaMaterial'},
      ],
      headers_variantes: [
        {text:'Variante',align: 'start', sortable: true, value: 'nome',},
        {text:'Área',align: 'start', sortable: true, value: 'ar',},
        {text:'Peso Próprio',align: 'start', sortable: true, value: 'pp',},
        {text:'Tensão de Cedência',align: 'start', sortable: true, value: 'sigmaC',},
        {text:'Weff_P',align: 'start', sortable: true, value: 'weff_p',},
        {text:'Weff_N',align: 'start', sortable: true, value: 'weff_n',},
      ],
      caminhos: [
        {
          text: 'Projetos',
          disabled: false,
          href: '/projetos/',
        },
        {
          text:'',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text:'',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text:'Catálogo Produtos',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ],
    }
  },
  methods: {
    preencherCaminhos(){
      this.caminhos[1].text = this.$route.params.refProjeto;
      this.caminhos[1].href = '/projetos/'+this.$route.params.refProjeto;
      this.caminhos[2].text = this.$route.params.refEstrutura;
      this.caminhos[2].href = '/projetos/'+this.$route.params.refProjeto+'/estruturas/'+this.$route.params.refEstrutura;
    },
    //TODO - fazer o pedido dos produtos com as suas variantes
    getProdutos() {
      this.loading = true;
      this.loading_text = "A construir catálogo..."
      this.$axios.$get('/api/produtos/'+this.$route.params.refEstrutura+'/with_variantes')
        .then((response) => {
          this.produtos = response;
          this.loading = false;
        })

      setTimeout(() => {
        this.loading = false;
        this.selected = [];
      }, 500);

    },
    adicionarProdutos(){
      for (let i in this.selected) {
        this.$axios.$put('/api/estruturas/' + this.$route.params.refEstrutura + '/addVariante/' + this.selected[i].codigo)
        .then(()=> {
          console.log("Adicionado")
        })
        .catch( error => {
          this.erro();
        })
      }
      setTimeout(() => {
        this.getProdutos();
      }, 5000);

    },
  },
  erro (){
    this.color = 'error';
    this.text = 'Ocorreu um erro com a alteração da observação.';
    this.snackbar = true;
    this.getProdutos();
  },
  created() {
    this.getProdutos()
    this.preencherCaminhos()
  }
}
</script>


<style scoped>

</style>
