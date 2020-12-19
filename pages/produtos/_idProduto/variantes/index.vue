<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <aux_criar_variante ref="criarVarianteDialog"></aux_criar_variante>
    <aux_dialog_confirmacao ref="confirm"/>
    <!--    DIALOG para adicionar um ficheiro ao projeto          -->
    <v-dialog v-model="dialog_ficheiro" max-width="490">
      <v-card>
        <v-card-title class="headline">
          Upload Ficheiro
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="file"
            chips
            show-size
            label="Inserir Ficheiro"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_ficheiro = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" :disabled="!hasFile" text @click="upload">
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    DIALOG PARA EDITAR O PRODUTO-->
    <v-dialog v-model="dialog_editar_produto" max-width="490">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Editar Produto
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer_produto" v-slot="{invalid}">
            <validation-provider v-slot="{errors}" name="Nome" rules="required|max:50">
              <v-text-field
                v-model="aux_produto.nome"
                :counter="50"
                :error-messages="errors"
                label="Nome:"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Referencia Fabricante" rules="required|max:10">
              <v-text-field
                v-model="aux_produto.referenciaFabricante"
                :counter="50"
                :error-messages="errors"
                label="Referência Fabricante:"
              ></v-text-field>
            </validation-provider>
            <v-btn color="green darken-1" text @click="dialog_editar_produto=false">
              Cancelar
            </v-btn>
            <v-btn color="green darken-1" text @click="editarProduto">
              Guardar
            </v-btn>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--    DIALOG PARA EDITAR VARIANTE-->
    <v-dialog v-model="dialog_editar_variante" max-width="490">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Editar Variante {{aux_variante.nome}}
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer_variante" v-slot="{invalid}">
            <validation-provider v-slot="{errors}" name="Nome" rules="required|max:50">
              <v-text-field
                v-model="aux_variante.nome"
                :counter="50"
                :error-messages="errors"
                label="Nome:"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Área" rules="required">
              <v-text-field
                v-model="aux_variante.ar"
                :counter="50"
                :error-messages="errors"
                label="Área:"
                @change="calcularPP"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Tensão Cedência" rules="required|numeric">
              <v-text-field
                v-model="aux_variante.sigmaC"
                :counter="50"
                :error-messages="errors"
                label="Tensão de Cedência:"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Peso Proprio" rules="required">
              <v-text-field
                v-model="aux_variante.pp"
                :counter="50"
                readonly
                :error-messages="errors"
                label="Peso Próprio:"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Modo Elástico Positivo" rules="required">
              <v-text-field
                v-model="aux_variante.weff_p"
                :counter="50"
                :error-messages="errors"
                label="Weff_p:"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{errors}" name="Modo Elástico Negativo" rules="required">
              <v-text-field
                v-model="aux_variante.weff_n"
                :counter="50"
                :error-messages="errors"
                label="Weff_n:"
              ></v-text-field>
            </validation-provider>
            <v-btn color="green darken-1" text @click="dialog_editar_variante=false">
              Cancelar
            </v-btn>
            <v-btn color="green darken-1" text @click="editarVariante">
              Guardar
            </v-btn>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  <!--    DIALOG PARA APRESENTAÇÂO DOS MCRS-->
    <v-dialog v-model="dialog_mcrs" max-width="800">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Movimentos Criticos
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-card>
                <v-toolbar>
                  <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                    MCR_P
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-on="on">
                        <v-icon>mdi-information</v-icon>
                      </div>
                    </template>
                    <span>Movimentos Criticos Positivos</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <v-data-table :items="mcr_p" :headers="cabecalhos_mcr" hide-default-footer hide-default-header>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-toolbar>
                  <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                    MCR_N
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div v-on="on">
                        <v-icon>mdi-information</v-icon>
                      </div>
                    </template>
                    <span>Movimentos Criticos Negativos</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <v-data-table :items="mcr_n" :headers="cabecalhos_mcr" hide-default-footer hide-default-header>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_mcrs = false">
            Sair
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- Codigo Principal da página-->
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="!loading">
      <v-btn @click="$router.go(-1)">Voltar</v-btn>
      <v-row>
        <!--      Dados Produto-->
        <v-col md="6">
          <v-card>
            <v-card-title>Dados do Produto</v-card-title>
            <v-card-text>
              <p><b>Referencia Fabricante:</b> {{ produto.referenciaFabricante }}</p>
              <p><b>Nome:</b> {{ produto.nome }}</p>
              <p><b>Tipo Material:</b> {{ produto.nomeTipoMaterial }}</p>
              <p><b>Familia Material:</b> {{ produto.nomeFamiliaMaterial }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <!--      Coluna Ações-->
        <v-col md="6">
          <v-card>
            <v-card-title>Ações</v-card-title>
            <v-card-text>
              <v-btn small color="primary" @click.stop="dialog_editar_produto = true">Editar</v-btn>
              <v-btn small color="error" @click="eliminarProduto">Eliminar</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              Variantes
              <v-text-field
                v-model="search"
                label="Pesquisa"
                hide-details
                prepend-inner-icon="mdi-magnify"
                class="shrink"
                style="margin-left: 15px"
              ></v-text-field>
              <v-spacer></v-spacer>
              <div class="d-flex justify-end" style="margin-right: 2px">
                <v-btn x-small @click="dialog_ficheiro = true">Carregar Ficheiro</v-btn>
              </div>
              <div class="d-flex justify-end" style="margin-right: 2px">
                <v-btn x-small @click="criarVariante">Criar Variante</v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :items="variantes"
                :headers="cabecalhos_variantes"
                :search="search"
                :sort-by="['nome']"
                no-data-text="Nenhuma estrutura para apresentar">
                <template v-slot:item.actions="{ item }">
                  <v-btn x-small @click="chamarDialogEditar(item)">Editar</v-btn>
                  <v-btn x-small color="error" @click="eliminarVariante(item)">Eliminar</v-btn>
                  <v-btn x-small color="primary" @click="apresentarMCR(item)" v-if="item.mcr_p">Mcr's</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import aux_criar_variante from "@/components/aux_criar_variante";
import aux_dialog_confirmacao from "@/components/aux_dialog_confirmacao";

export default {
  middleware: 'isFabricante',
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

      dialog_editar_produto: false,
      dialog_editar_variante: false,

      produto:'',
      aux_produto:'',

      variantes:[],
      aux_variante:'',
      search:'',

      dialog_observacao: false,
      observacao:'',

      cabecalhos_variantes:[{
        text: 'Codigo',
        align: 'start',
        sortable: true,
        value: 'codigo',
      },{
        text: 'Nome',
        align: 'start',
        sortable: true,
        value: 'nome',
      },{
        text: 'Área',
        align: 'start',
        sortable: true,
        value: 'ar',
      },{
        text: 'Tensão de Cedência',
        align: 'start',
        sortable: true,
        value: 'sigmaC',
      },{
        text: 'Peso Próprio',
        align: 'start',
        sortable: true,
        value: 'pp',
      },{
        text: 'WEFF_P',
        align: 'start',
        sortable: true,
        value: 'weff_p',
      },{
        text: 'WEFF_N',
        align: 'start',
        sortable: true,
        value: 'weff_n',
      },{
        text: 'Ações',
        value: 'actions',
      },
      ],

      dialog_ficheiro: false,
      file: null,

      dialog_mcrs: false,
      cabecalhos_mcr: [{
        text: '',
        align: 'start',
        sortable: false,
        value: 'key',
      }, {
        text: '',
        align: 'start',
        sortable: false,
        value: 'value',
      },
      ],
      mcr_p: [],
      mcr_n: [],


    }
  },
  computed: {
    hasFile () {
      return this.file != null
    },
    formData () {
      let formData = new FormData()
      if (this.file) {
        formData.append('file', this.file)
      }
      return formData
    },
  },
  methods: {
    upload() {
      if (!this.hasFile) {
        return
      }
      let promisse = this.$axios.$post('/api/excel/upload', this.formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      promisse.then((response) => {
        this.dialog_ficheiro = false;
        this.loading = true;
        let formData = new FormData()
        formData.append('idExcel', response.id)
        formData.append('idProduto', this.produto.id)
        let promisseRead = this.$axios.$post('/api/excel/read',formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        promisseRead.then(() => {
          this.color = 'green';
          this.text = 'Ficheiro carregado com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.getProduto();
        })
        promisseRead.catch(() => {
          this.color = 'error';
          this.text = 'Dados não carregados, erro na formatação do ficheiro.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.loading = false;
        })

      })
      promisse.catch(() => {
        this.color = 'error';
        this.text = 'Ocorreu um erro, ficheiro não lido.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.loading = false;
      })
    },
    getProduto() {
      this.loading = true;
      this.loading_text = "A arrumar variantes..."
      this.$axios.$get('/api/produtos/' + this.$route.params.idProduto)
        .then((produto) => {
          this.produto = produto;
          this.aux_produto = JSON.parse(JSON.stringify(produto))
          this.variantes = produto.variantes;
          this.loading = false
        })
        .catch(error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro.';
          this.snackbar = true;
          this.$router.push("/home");
        })
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    editarProduto(){
      if(this.$refs.observer_produto.validate()){
        this.$axios.$put('/api/produtos/'+this.$route.params.idProduto, {
          id: this.$route.params.idProduto,
          nome: this.aux_produto.nome,
          referenciaFabricante: this.aux_produto.referenciaFabricante,
          emailFabricante : this.produto.emailFabricante,
          idTipoMaterial : this.produto.idTipoMaterial,
          idFamiliaMaterial : this.produto.idFamiliaMaterial
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
      this.dialog_editar_produto = false;
      this.getProduto();
    },
    eliminarProduto(){
      this.loading = true;
      this.loading_text = "A remover ligacões e limpar dados..."
      this.$axios.delete('/api/produtos/'+this.produto.id+'/')
        .then((response) => {
          this.color = 'green';
          this.text = 'O produto foi eliminado com sucesso.';
          this.snackbar = true;
          this.loading_text = "A enviar para nova página..."

          setTimeout(() => {
            this.$router.push("/home");
          }, 1500);
        })
    },
    chamarDialogEditar(item){
      this.aux_variante = JSON.parse(JSON.stringify(item))
      this.dialog_editar_variante = true
    },
    async criarVariante() {
      if (
        await this.$refs.criarVarianteDialog.open()
      ) {
        this.getProduto()
      }
    },
    editarVariante() {
      console.log(this.aux_variante)
      if (this.$refs.observer_variante.validate()) {
        this.$axios.$put('/api/variantes/' + this.aux_variante.codigo, {
          codigo: this.aux_variante.codigo,
          nome: this.aux_variante.nome,
          produtoID : this.aux_variante.produtoID,
          sigmaC: this.aux_variante.sigmaC,
          ar: this.aux_variante.ar,
          weff_p: this.aux_variante.weff_p,
          weff_n: this.aux_variante.weff_n,
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
      this.dialog_editar_variante = false;
      this.loading = true;
      this.getProduto();
    },
    async eliminarVariante(item){
      if(await this.$refs.confirm.open(
        "Eliminar Variante",
        "Tem a certeza que quer eliminar esta variante?")
      ){
        this.$axios.delete('/api/variantes/'+item.codigo+'/')
        .then((response)=>{
          this.color = 'green';
          this.text = 'A Variante foi eliminada com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
          this.getProduto();
        })
      }else{
        return null
      }
    },
    calcularPP(){
      let G = 78.5
      this.aux_variante.pp = G * this.aux_variante.ar * Math.pow(10, -6)
    },
    apresentarMCR(item){
      this.mcr_p = this.textSplit(item.mcr_p)
      this.mcr_n = this.textSplit(item.mcr_n)
      this.dialog_mcrs = true;
    },
    textSplit(text){
      let mcr = [];
      text = text.trim("")
      let split1 = text.split(',');
      for(let par of split1) {
        let split2 = par.split(":")
        if (split2[0] !== ""){
          let aux = {key: split2[0], value: split2[1]}
          mcr.push(aux)
        }
      }
      return mcr;
    },
  },
  created() {
    this.getProduto()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_dialog_confirmacao,
    aux_criar_variante,
  },
}
</script>

<style scoped>

</style>
