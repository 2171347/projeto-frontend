<template>
  <div>
    <aux_criar_produto ref="criarProdutoDialog"></aux_criar_produto>
    <v-card>
      <v-card-title style="justify-content: center">Painel Geral do {{ this.$auth.user.groups[0] }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar>
                <v-toolbar-title>Variantes Selecionadas</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-if="variantes.length!== 0"
                  v-model="search"
                  label="Pesquisa"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="shrink"
                ></v-text-field>
                <v-spacer></v-spacer>
              </v-toolbar>
              <template>
                <v-card-text style="margin-top: 15px">
                  <p>De momento não tem variantes selecionadas.</p>
                </v-card-text>
              </template>
              <template v-if="variantes.length !== 0">
                <v-card-text>
                  <v-data-table :items="variantes" :headers="cabecalhos_variantes" :search="search">
                  </v-data-table>
                </v-card-text>
              </template>
            </v-card>
          </v-col>
          <v-col md="3">
            <vcard_notificacoes_homepage/>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="9">
            <v-card>
              <v-toolbar>
                <v-toolbar-title>Meus Produtos</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-if="produtos.length!== 0"
                  v-model="search"
                  label="Pesquisa"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="shrink"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <v-btn icon v-on="on" @click="toProdutos" :disabled="produtos.length === 0">
                        <v-icon>mdi-view-list</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <span>Listar todos os produtos</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="criarProduto">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Criar um novo produto.</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <template v-if="produtos.length === 0" >
                  <v-card-text style="margin-top: 15px">
                    <p>De momento não tem produtos.</p>
                  </v-card-text>
                </template>
                <template v-if="produtos.length !== 0" >
                  <v-card-text>
                    <v-data-table
                      :headers="cabecalhos_produtos"
                      :items="produtos"
                      class="elevation-1"
                    >
                      <template v-slot:item.actions="{ item }">
                        <v-btn icon @click="toDetalhes(item)"><v-icon>mdi-information</v-icon></v-btn>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="3">
            <aux_suporte_component/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";
import aux_suporte_component from "../aux_suporte_component";
import aux_criar_produto from "../aux_criar_produto";
export default {
  name: "aux_home_projetista",
  data: () => {
    return {
      variantes:[],
      produtos:[],

      search:'',

      cabecalhos_variantes: [
        {
          text: 'Produto',
          align: 'start',
          sortable: true,
          value: 'produtoNome',
        }, {
          text: 'Variante',
          align: 'start',
          sortable: true,
          value: 'nome',
        }, {
          text: 'Data Encomenda',
          align: 'start',
          sortable: true,
          value: 'dataEncomenda',
        }, {
          text: 'Núm. Selecionados',
          align: 'start',
          sortable: true,
          value: 'count',
        },
      ],
      cabecalhos_produtos: [
        {
          text: 'Referencia',
          align: 'start',
          sortable: true,
          value: 'referenciaFabricante',
        }, {
          text: 'Nome',
          align: 'start',
          sortable: true,
          value: 'nome',
        }, {
          text: 'Tipo Material',
          align: 'start',
          sortable: true,
          value: 'nomeTipoMaterial',
        }, {
          text: 'Familia Material',
          align: 'start',
          sortable: true,
          value: 'nomeFamiliaMaterial',
        },
        {
          text: 'Detalhes',
          value: 'actions',
        },
      ],

    }
  },
  methods :{
    getVariantesSelecionadas(){
      this.$axios.$get('/api/variantes/fabricante/' + this.$auth.user.sub)
        .then((variantes) => {
          this.variantes = variantes;
        })
    },
    toProdutos(){
      this.$router.push('/produtos/');
    },
    getProdutos() {
      this.$axios.$get('/api/produtos/fabricante/' + this.$auth.user.sub)
        .then((response) => {
          this.produtos = response;
        })
    },
    async criarProduto() {
      if (
        await this.$refs.criarProdutoDialog.open()
      ) {
        this.getProdutos()
      }
    },
    toDetalhes(item){
      this.$router.push('/produtos/'+item.id+'/variantes');
    }
  },
  created() {
    this.getVariantesSelecionadas()
    this.getProdutos();
  },
  components:{
    vcard_notificacoes_homepage,
    aux_suporte_component,
    aux_criar_produto,
  }
}
</script>

<style scoped>

</style>
