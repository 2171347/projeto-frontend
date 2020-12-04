<template>
  <v-card>
    <v-card-title style="justify-content: center">Painel Geral do {{this.$auth.user.groups[0]}}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
            <v-toolbar-title>Variantes Selecionadas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                label="Pesquisa"
                hide-details
                prepend-inner-icon="mdi-magnify"
                class="shrink"
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-data-table :items="variantes" :headers="cabecalhos_variantes" :search="search">
              </v-data-table>
            </v-card-text>

          </v-card>
        </v-col>
        <v-col md="3">
          <vcard_notificacoes_homepage/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";

export default {
  name: "aux_home_projetista",
  data: () => {
    return {
      variantes:[],

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
    }
  },
  methods :{
    getVariantesSelecionadas(){
      this.$axios.$get('/api/variantes/fabricante/' + this.$auth.user.sub)
        .then((variantes) => {
          console.log(variantes)
          this.variantes = variantes;
        })
    }
  },
  created() {
    this.getVariantesSelecionadas()
  },
  components:{
    vcard_notificacoes_homepage
  }
}
</script>

<style scoped>

</style>
