<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>

    <!--    DIALOG para adicionar uma observação à estrutura           -->
    <v-dialog v-model="dialog_observacao" max-width="490">
      <v-card>
        <v-card-title class="headline">
          Adicionar/Editar uma observação
        </v-card-title>
        <v-card-text>
          <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            solo
            v-model="observacao"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_observacao = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="editarObservacao">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    DIALOG para editar uma estrutura           -->
    <v-dialog v-model="dialog_editar_estrutura" max-width="490">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Editar Estrutura
        </v-card-title>
        <v-card-text>
         <validation-observer ref="observer_dialog" v-slot="{ invalid }">
            <form @submit.prevent="editarEstrutura">
              <v-row>
                <v-col>
                  <validation-provider v-slot="{ errors }" name="Nome_dialog" rules="required|max:50">
                    <v-text-field
                      v-model="nome"
                      :counter="50"
                      :error-messages="errors"
                      label="Nome:"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col>
                  <v-select
                    :items="tiposMaterial"
                    item-text="nome"
                    item-value="id"
                    :error-messages="errorsTipoMaterial"
                    v-model="idTipoMaterial"
                    label="Tipo de Material:"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <validation-provider v-slot="{ errors }" name="numeroVaos" rules="required|numeric">
                    <v-text-field
                      v-model="numeroVaos"
                      :error-messages="errors"
                      label="Número de Vãos:"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col>
                  <validation-provider v-slot="{ errors }" name="comprimentoVao" rules="required|numeric">
                    <v-text-field
                      :error-messages="errors"
                      label="Comprimento de Vão:"
                      v-model="comprimentoVao"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col>
                  <validation-provider v-slot="{ errors }" name="sobrecarga" rules="required|numeric">
                    <v-text-field
                      v-model="sobrecarga"
                      :error-messages="errors"
                      label="Sobrecarga:"
                      required
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-btn color="green darken-1" text @click="editarEstrutura">
                Guardar
              </v-btn>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_variantes_simuladas" :fullscreen="active">
      <v-container v-if="loading_simulador" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout column justify-center align-center fill-height>
          <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
          </v-progress-circular>
          {{ loading_simulador_text }}
        </v-layout>
      </v-container>
      <v-container v-if="!loading_simulador" >
          <v-card>
            <v-card-title>
              Produtos Recomendados
              <v-text-field
                v-model="search"
                label="Pesquisa"
                hide-details
                prepend-inner-icon="mdi-magnify"
                class="shrink"
                style="margin-left: 15px"
              ></v-text-field>
            </v-card-title>
            <v-card-text>
              <v-data-table
                v-model="selected"
                :items="variantes_recomendadas"
                item-key="codigo"
                :headers="cabecalhos_variantes_simuladas"
                :search="search_recomendadas"
                show-select
                multi-sort
              >
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog_variantes_simuladas = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="adicionarProdutos">
                Adicionar
              </v-btn>
            </v-card-actions>
          </v-card>
      </v-container>
    </v-dialog>

    <!--    LOADING        -->
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
        <!-- Dados Estrutura -->
        <v-col md="6">
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Dados da Estrutura
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col>
                  <p><b>Referencia:</b> {{ estrutura.referencia }}</p>
                  <p><b>Nome:</b> {{ estrutura.nome }}</p>
                </v-col>
                <v-col>
                  <p><b>Estado:</b> {{ estrutura.estado }}</p>
                  <p><b>Tipo Material:</b> {{ estrutura.nomeTipoMaterial }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Coluna Ações-->
        <v-col md="6">
          <!--  Ações para o cliente  -->
          <v-card v-if="this.$auth.user.groups.includes('Cliente')">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>
              <template v-if="estrutura.estado === 'ANALISE'">
                <v-btn small @click="aprovarEstrutura" color="success">Aprovar Estrutura</v-btn>
                <v-btn small @click="rejeitarEstrutura" color="error"> Rejeitar Estrutura</v-btn>
              </template>
            </v-card-text>
          </v-card>
          <!--  Ações para o projetista  -->
          <v-card v-if="this.$auth.user.groups.includes('Projetista')">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-btn x-small color="primary" @click="dialog_editar_estrutura = true">Editar</v-btn>
              <v-btn x-small color="error" @click="eliminarEstrutura" v-if="estrutura.estado === 'ANALISE'">Eliminar</v-btn>
              <v-btn x-small color="info" @click="simular" v-if="estrutura.estado === 'ANALISE'">Simular</v-btn>
            </v-card-text>
          </v-card>
          <!--  Ações para o administrador  -->
          <v-card v-if="this.$auth.user.groups.includes('Administrador')">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row style="margin-bottom: 10px">
                  <v-btn small color="primary" @click="dialog_editar_estrutura = true" style="margin-right: 5px">Editar</v-btn>
                  <v-btn small color="error" @click="eliminarEstrutura" style="margin-right: 5px">Eliminar</v-btn>
                  <v-btn small color="info" @click="simular">Simular</v-btn>
              </v-row>
              <v-row>
                  <v-btn @click="aprovarEstrutura" color="success" small style="margin-right: 5px">Aprovar Estrutura</v-btn>
                  <v-btn @click="rejeitarEstrutura" color="error" small style="margin-right: 5px"> Rejeitar Estrutura</v-btn>
                  <v-btn @click="changeAnalisar" color="warning" small> Analisar Estrutura</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Dados Geométricos Estrutura
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p><b>Número de Vãos:</b> {{ estrutura.numeroVaos }}</p>
              <p><b>Comprimento de Vão:</b> {{ estrutura.comprimentoVao }} m</p>
              <p><b>Sobrecarga:</b> {{ estrutura.sobrecarga }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Produtos
              </v-toolbar-title>
              <v-text-field
                v-if="variantes.length !== 0"
                v-model="search"
                label="Pesquisa"
                hide-details
                prepend-inner-icon="mdi-magnify"
                class="shrink"
                style="margin-left: 15px"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="this.$auth.user.groups.includes('Projetista') || this.$auth.user.groups.includes('Administrador')">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="goToCatalogo">
                    <v-icon>mdi-format-list-text</v-icon>
                  </v-btn>
                </template>
                <span>Catálogo de Produtos.</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text v-if="variantes.length!==0">
              <v-data-table :items="variantes" :headers="cabecalhos" :search="search" multi-sort>
                <template v-slot:item.actions="{ item }" v-if="this.$auth.user.groups.includes('Projetista') || this.$auth.user.groups.includes('Administrador')">
                  <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
                  <v-btn x-small color="error" @click="removerProdutos(item)">Remover</v-btn>
                </template>
                <template v-if="this.$auth.user.groups.includes('Cliente')">
                  <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Observações
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="this.$auth.user.groups.includes('Cliente') && estrutura.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_observacao = true">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar observação.</span>
              </v-tooltip>
              <v-tooltip bottom v-if="this.$auth.user.groups.includes('Cliente') && estrutura.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="limparObservacao">
                    <v-icon>mdi-eraser-variant</v-icon>
                  </v-btn>
                </template>
                <span>Limpar conteúdo da observação.</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text v-if="estrutura.observacoes">
              {{ estrutura.observacoes}}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import aux_snackbar from "../../../../../components/aux_snackbar";
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {

  data: () => {
    return {

      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------

      search:'',
      search_recomendadas:'',

      dialog_observacao: false,
      dialog_editar_estrutura: false,
      dialog_variantes_simuladas: false,
      active: false,

      projeto: '',
      estrutura:'',
      variantes:[],
      variantes_recomendadas:[],
      selected:[],
      subject:'',
      message:'',
      observacao:'',
      date:'',

      loading: true,
      loading_simulador: true,
      loading_text:'',
      loading_simulador_text:'',

      cabecalhos:[],

      cabecalhos_variantes:[{
        text: 'Produto',
        align: 'start',
        sortable: true,
        value: 'produtoNome',
      },{
        text: 'Variante',
        align: 'start',
        sortable: true,
        value: 'nome',
      },{
        text: 'Ações',
        value: 'actions',
      },
      ],
      cabecalhos_variantes_cliente:[{
        text: 'Produto',
        align: 'start',
        sortable: true,
        value: 'produtoNome',
      },{
        text: 'Variante',
        align: 'start',
        sortable: true,
        value: 'nome',
      },
      ],
      cabecalhos_variantes_simuladas: [{
        text: 'Produto',
        align: 'start',
        sortable: true,
        value: 'produtoNome',
      },
        {text: 'Variante', align: 'start', sortable: true, value: 'nome',},
        {text: 'Área', align: 'start', sortable: true, value: 'ar',},
        {text: 'Peso Próprio', align: 'start', sortable: true, value: 'pp',},
        {text: 'Tensão de Cedência', align: 'start', sortable: true, value: 'sigmaC',},
        {text: 'Weff_P', align: 'start', sortable: true, value: 'weff_p',},
        {text: 'Weff_N', align: 'start', sortable: true, value: 'weff_n',},
      ],

      //variaveis para o dialog de editar
      nome:'',
      comprimentoVao:'',
      numeroVaos:'',
      sobrecarga:'',
      idTipoMaterial:'',
      tiposMaterial:[],
      errorsTipoMaterial:'',

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
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ],

    }
  },
  methods:{
    preencherCaminhos(){
      this.caminhos[1].text = this.$route.params.refProjeto;
      this.caminhos[1].href = '/projetos/'+this.$route.params.refProjeto;
      this.caminhos[2].text = this.$route.params.refEstrutura;
    },
    getProjeto(){
      this.$axios.$get('/api/projetos/'+this.$route.params.refProjeto)
        .then((projeto) => {
          this.projeto = projeto;
        })
    },
    getEstrutura(){
      this.loading_text = "A procurar produtos..."
      this.$axios.$get('/api/estruturas/'+this.$route.params.refEstrutura)
        .then((estrutura) => {
          this.estrutura = estrutura;
          this.variantes = estrutura.variantes;
          this.idTipoMaterial = estrutura.idTipoMaterial
          // for (let aux in this.variantes){
          //   this.$axios.$get('/api/produtos/'+this.variantes[aux].produtoID)
          //     .then((produto) => {
          //       this.variantes[aux].produtoID = produto.nome;
          //     })
          // }
      })
      .then(() => {
        this.preencherProps();
      })
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    preencherProps(){
      this.nome = this.estrutura.nome;
      this.sobrecarga = this.estrutura.sobrecarga;
      this.comprimentoVao = this.estrutura.comprimentoVao;
      this.numeroVaos = this.estrutura.numeroVaos;
    },
    getTiposMateriais(){
      this.$axios.$get('/api/tipos_material/all')
        .then((response) => {
          this.tiposMaterial = response;
        })
    },
    // --------------------Métodos para o Cliente
    aprovarEstrutura(){
      this.loading = true;
      this.loading_text = 'A enviar pombos correio...'
      this.$axios.$put('/api/projetos/'+this.projeto.referencia+'/aprove/'+this.estrutura.referencia)
        .then(() => {
          this.getEstrutura()
        })
    },
    rejeitarEstrutura(){
      this.loading = true;
      this.loading_text = 'A enviar pombos correio...'
      this.$axios.$put('/api/projetos/'+this.projeto.referencia+'/reject/'+this.estrutura.referencia)
        .then(() => {
          this.getEstrutura()
        })
    },
    editarObservacao(){
      this.$axios.put('/api/estruturas/'+this.$route.params.refEstrutura+'/observacoes',{
        observacao: this.observacao
      })
        .then(() => {
          this.color = 'green';
          this.text = 'Observação alterada com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.dialog_observacao = false;
          this.getEstrutura();
        })
        .catch(error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro com a alteração da observação.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.dialog_observacao = false;
        })
    },
    limparObservacao(){
      this.$axios.put('/api/estruturas/'+this.$route.params.refEstrutura+'/observacoes', {
        observacao: ''
      })
        .then(() => {
          this.color = 'green';
          this.text = 'Observação limpa com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.getEstrutura();
        })
        .catch(error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro com a limpeza da observação.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
        })

    },

    //-------------------------------Métodos para o projetista
    removerProdutos(item){
      this.loading = true;
      this.loading_text = 'A processar dados...'
      this.$axios.$put('/api/estruturas/'+this.estrutura.referencia+'/removeVariante/'+item.codigo)
      .then(() => {
        this.color = 'green';
        this.text = 'Produto removido com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.getEstrutura()
      })
    },
    changeAnalisar(){
      this.loading = true;
      this.loading_text = 'A processar dados...'
      this.$axios.$put('/api/projetos/'+this.projeto.referencia+'/analise/'+this.estrutura.referencia)
        .then(() => {
          this.getEstrutura()
        })
    },
    simular(){
      this.$axios.$get('api/estruturas/'+this.$route.params.refEstrutura+'/simular')
      .then((response)=> {
        this.variantes_recomendadas = response;
        if (response.length > 0){
          this.dialog_variantes_simuladas = true;
          this.loading_simulador = false;
        }else{
          this.color = 'blue';
          this.text = 'Produtos simulados já adicionados.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
        }
      })
    },
    editarEstrutura(){
      if(this.$refs.observer_dialog.validate()){
        //Enviar os dados para o update da estrutura
        this.$axios.$put('api/estruturas/'+this.$route.params.refEstrutura, {
          nome: this.nome,
          idTipoMaterial: this.idTipoMaterial,
          numeroVaos: this.numeroVaos,
          comprimentoVao: this.comprimentoVao,
          sobrecarga: this.sobrecarga,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
          })
      }
      this.dialog_editar_estrutura = false;
      this.getEstrutura()
    },
    eliminarEstrutura(){
      this.$axios.delete('api/estruturas/'+this.$route.params.refEstrutura).then((response) => {
        this.color = 'green';
        this.text = 'A Estrutura foi eliminada com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);

        setTimeout(() => {
          this.$router.push("/projetos/"+this.projeto.referencia);
        }, 1000);
      })
    },
    adicionarProdutos(){
      this.active = true;
      this.loading_simulador = true;
      this.loading_simulador_text = "A adicionar produtos..."
      for (let i in this.selected) {
        this.$axios.$put('/api/estruturas/' + this.$route.params.refEstrutura + '/addVariante/' + this.selected[i].codigo)
          .then(()=> {
            console.log("Adicionado produto")
          })
      }
      setTimeout(() => {
        this.dialog_variantes_simuladas = false
        this.active = false;
        this.selected = []
        this.getEstrutura();
      }, 1000);

    },
    // Métodos gerais
    //detalhes do produto
    toDetalhes (item){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+this.estrutura.referencia+'/variantes/'+item.codigo);
    },
    goToCatalogo(){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+this.estrutura.referencia+'/catalogo');
    }
  },
  created() {
    this.getEstrutura()
    this.getProjeto()
    this.getTiposMateriais()
    this.preencherCaminhos()
    if(this.$auth.user.groups[0] === 'Cliente'){
      this.cabecalhos = this.cabecalhos_variantes_cliente;
    }else{
      this.cabecalhos = this.cabecalhos_variantes;
    }
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_snackbar,
  },
}
</script>
