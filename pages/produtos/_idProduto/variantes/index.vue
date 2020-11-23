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
      <v-btn @click="$router.go(-1)">Voltar</v-btn>
      <v-row>
        <!--      Dados Produto-->
        <v-col md="6">
          <v-card>
            <v-card-title>Dados do Produto</v-card-title>
            <v-card-text>
              <p><b>Referencia Fabricante:</b> {{ produto.referenciaFabricante }}</p>
              <p><b>Nome Projeto:</b> {{ produto.nome }}</p>
              <p><b>Tipo Material:</b> {{ produto.nomeTipoMaterial }}</p>
              <p><b>Familia Material:</b> {{ produto.nomeFamiliaMaterial }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <!--      Coluna Ações-->
        <v-col md="6">
          <!--  Ações para o administrador  -->
          <v-card>
            <v-card-title>Ações</v-card-title>
            <v-card-text>
              <v-row style="margin-bottom: 15px">
                <v-btn small color="primary" @click="editarProduto">Editar</v-btn>
                <v-btn small color="error" @click="eliminarProduto">Eliminar</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
name: "index",
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

      loading: true,
      loading_text:'',

      email_app:'noreply@projeto.com',
      email_assunto:'[Projeto +]',
      subject:'',
      message:'',
      date:'',
      dialog_email: false,

      projeto:'',
      variantes:[],
      search:'',

      dialog_observacao: false,
      observacao:'',

      cabecalhos_estruturas:[{
        text: 'Nome Estrutura',
        align: 'start',
        sortable: true,
        value: 'nome',
      },{
        text: 'Tipo Material',
        align: 'start',
        sortable: true,
        value: 'nomeTipoMaterial',
      },{
        text: 'Estado',
        align: 'start',
        sortable: true,
        value: 'estado',
      },{
        text: 'Ações',
        value: 'actions',
      },
      ],
      //props para o dialog de edição
      nome:'',
      dialog_editar_projeto:false,

    }
  },
  methods:{
    getProduto(){
      this.loading_text= 'A procurar peças...'
      this.$axios.$get('/api/produtos/'+this.$route.params.idProduto)
        .then((projeto) => {
          this.projeto = projeto;
          this.estruturas = projeto.estruturas;
          this.nome = projeto.nome;
          this.loading = false
        })
        .catch (error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro.';
          this.snackbar = true;
          this.$router.push("/produtos/");
        })
    },
    editarProduto(){
      if(this.$refs.observer_produto.validate()){
        this.$axios.$put('/api/produtos/'+this.$route.params.idProduto, {
          //TODO colocar os parametros
        })
          .then(() => {
            this.color = 'green';
            this.text = 'Edição do Produto realizado com sucesso.';
            this.snackbar = true;
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com a edição do produto.';
            this.snackbar = true;
          })
      }
      this.dialog_editar_projeto = false;
      this.getProduto();
    },
    eliminarProduto(){
      this.$axios.delete('/api/produtos/'+this.produto.id+'/')
        .then((response) => {
          this.color = 'green';
          this.text = 'O projeto foi eliminado com sucesso.';
          this.snackbar = true;

          setTimeout(() => {
            this.$router.push("/projetos");
          }, 1500);
        })
    },
    toDetalhesVariante (item){

    },
    criarVariante(){

    },
  },
  created() {
    this.getProjeto()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}
</script>

<style scoped>

</style>
