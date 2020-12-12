<template>
  <div>
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar >
              <v-toolbar-title class="d-flex justify-center">Projetos</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="toProjetos">
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                </template>
                <span>Listar todos os projetos</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-data-table :headers="headers" :items="projetos" class="elevation-1">
                <template v-slot:item.actions="{ item }">
                  <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="3">
         <vcard_notificacoes_homepage/>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";
import aux_dialog_confirmacao from "../aux_dialog_confirmacao";
import aux_snackbar from "../aux_snackbar";
export default {
name: "aux_home_projetista",
  data () {
    return {
      notificacoes:'',
      text:'',
      snackbar:'',
      color:'',
      projetos:[],
      headers: [
        {
          text: 'Nome Projeto',
          value: 'nome',
        },
        {
          text: 'Projetista',
          value: 'nomeProjetista',
        },
        { text: 'Ações',sortable: true, value: 'actions'},

      ],
    }
  },
  methods:{
    getProjetos(){
      this.$axios.$get('/api/clientes/'+this.$auth.user.sub+'/projetos')
        .then((response) => {
          this.projetos = response;
        })
    },
    toDetalhes (item){
      this.$router.push('/projetos/'+item.referencia+'/');
    },
    toProjetos(){
      this.$router.push('/projetos');
    },

  },
  created() {
    this.getProjetos();
  },
  components:{
    vcard_notificacoes_homepage,
    aux_dialog_confirmacao,
    aux_snackbar
  },
}
</script>

<style scoped>

</style>
