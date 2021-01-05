<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <!--  DIALOG para confirmação de "eliminar" e "disponibilizar"/"indiponibilizar"  -->
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

    <!--    DIALOG para adicionar uma observação ao projeto           -->
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
            v-model="observacao"
          ></v-textarea>
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

<!--    DIALOG PARA EDITAR O PROJETO-->
    <v-dialog v-model="dialog_editar_projeto" max-width="490">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Editar Projeto
        </v-card-title>
        <v-card-text>
          <validation-observer ref="observer_projeto" v-slot="{invalid}">
            <validation-provider v-slot="{errors}" name="Nome" rules="required|max:50">
              <v-text-field
                v-model="nome"
                :counter="50"
                :error-messages="errors"
                label="Nome:"
                ></v-text-field>
            </validation-provider>
            <v-btn color="green darken-1" text @click="editarProjeto">
              Guardar
            </v-btn>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
<!--    FIM DO EDITAR PROJETO-->

<!-- DIALOG PARA ADICIONAR ESTRUTURA-->
    <v-dialog v-model="dialog_adicionar_estrutura" max-width="490">
      <v-card style="margin-top: 10px">
        <v-card-title>
          Adicionar Estrutura
        </v-card-title>
      <v-card-text>
        <validation-observer ref="observer_add_estrutura" v-slot="{ invalid }">
          <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
            <v-text-field
              v-model="nome_estrutura"
              :counter="30"
              :error-messages="errors"
              label="Nome:"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="nVaos" rules="required|numeric">
            <v-text-field
              v-model="nVaos_estrutura"
              :counter="30"
              :error-messages="errors"
              label="Número de vãos:"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="comprimentoVaos" rules="required|numeric">
            <v-text-field
              v-model="comprimentoVaos_estrutura"
              :counter="30"
              :error-messages="errors"
              label="Comprimento dos Vãos (metros):"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Sobrecarga" rules="required|numeric">
            <v-text-field
              v-model="sobrecarga_estrutura"
              :counter="30"
              :error-messages="errors"
              label="Sobrecarga:"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="TipoMaterial" rules="required">
            <v-select :items="tiposMaterial" item-text="nome"  item-value="id" label="Tipo de Material:" v-model="tipoMaterialSelected"  :hint="tipoMaterialSelected.descricao" return-object>
            </v-select>
          </validation-provider>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog_adicionar_estrutura = false">
          Cancelar
        </v-btn>
        <v-btn color="green darken-1" text @click="adicionarEstrutura">
          Criar
        </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    DIALOG para enviar um email ao projetista         -->
    <v-dialog v-model="dialog_email" max-width="490">
      <v-card>
        <v-card-title class="headline">
         Enviar um email
        </v-card-title>
        <v-card-text>
          <v-text-field label="Assunto" v-model="subject">
          </v-text-field>
          <v-card-text>
            <v-textarea solo label="Conteúdo do email" v-model="message"></v-textarea>
          </v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_email = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="sendEmail">
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!-- LOADING-->
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="!loading">
<!--      TOOLBAR CAMINHOS-->
      <v-toolbar>
        <v-btn @click="$router.go(-1)">Voltar</v-btn>
        <v-breadcrumbs :items="caminhos">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
      <v-row>
        <!--      Dados Projeto-->
        <v-col md="6">
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Dados do Projeto
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on">
                    <v-btn icon v-on="on" v-if="tipo_utilizador !== 'Cliente' && projeto.estado !== 'APROVADO'" @click.stop="dialog_editar_projeto=true" >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                </template>
                <span>Editar dados do projeto</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <p><b>Referencia Projeto:</b> {{ projeto.referencia }}</p>
              <p><b>Nome Projeto:</b> {{ projeto.nome }}</p>
              <p><b>Estado:</b> {{ projeto.estado }}</p>
              <p v-if="this.projeto.visivelCliente === true"><b>Disponivel ao Cliente</b></p>
            </v-card-text>
          </v-card>
        </v-col>
        <!--      Coluna Ações-->
        <v-col md="6">
          <!--  Ações para o cliente  -->
          <v-card v-if="this.tipo_utilizador === 'Cliente'">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>
              <template v-if="this.projeto.estado === 'ANALISE' && this.projeto.visivelCliente">
                <v-btn small @click="aprovarProjeto" color="success">Aprovar Projeto</v-btn>
                <v-btn small @click="rejeitarProjeto" color="error"> Rejeitar Projeto</v-btn>
              </template>
            </v-card-text>
          </v-card>
          <!--  Ações para o projetista  -->
          <v-card v-if="this.tipo_utilizador ==='Projetista'">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-btn small color="error" @click="eliminarProjeto()" v-if="this.projeto.estado !== 'APROVADO'">Eliminar</v-btn>
              <template v-if="this.projeto.visivelCliente === false">
                <v-btn small color="accent" @click="disponibilizar()">Disponibilizar</v-btn>
              </template>
              <template v-if="this.projeto.visivelCliente === true && this.projeto.estado !== 'APROVADO'">
                <v-btn small color="accent" @click="indisponibilizar()">Indisponibilizar</v-btn>
              </template>
            </v-card-text>
          </v-card>
          <!--  Ações para o administrador  -->
          <v-card v-if="this.tipo_utilizador ==='Administrador'">
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ações
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row style="margin-bottom: 15px">
                <v-btn small color="primary" @click.stop="dialog_editar_projeto=true" style="margin-right: 5px">Editar</v-btn>
                <template v-if="this.projeto.visivelCliente === false">
                  <v-btn small color="accent" @click="disponibilizar()" style="margin-right: 5px">Disponibilizar</v-btn>
                </template>
                <template v-if="this.projeto.visivelCliente === true">
                  <v-btn small color="accent" @click="indisponibilizar()" style="margin-right: 5px">Indisponibilizar</v-btn>
                </template>
                <v-btn small color="error" @click="eliminarProjeto()">Eliminar</v-btn>
              </v-row>
              <v-row>
                <v-btn small @click="aprovarProjeto" color="success" style="margin-right: 5px">Aprovar Projeto</v-btn>
                <v-btn small @click="rejeitarProjeto" color="warning" style="margin-right: 5px"> Rejeitar Projeto</v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--      Tabela Estruturas-->
      <v-row v-if="this.tipo_utilizador === 'Cliente' && this.projeto.visivelCliente || this.tipo_utilizador !== 'Cliente'">
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">Estruturas</v-toolbar-title>
                <v-text-field
                  v-if="estruturas.length !== 0"
                  v-model="search"
                  label="Pesquisa"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="shrink"
                  style="margin-left: 15px"
                ></v-text-field>
                <v-spacer></v-spacer>
              <v-tooltip bottom v-if="(this.tipo_utilizador ==='Projetista' || this.tipo_utilizador ==='Administrador') && this.projeto.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_adicionar_estrutura = true">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Criar um nova estrutura.</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text v-if="tipo_utilizador !=='Cliente' && estruturas.length !== 0">
              <v-data-table :items="estruturas" :headers="cabecalhos_estruturas" :search="search" no-results-text="Nenhuma Estrutura Encontrada">
                <template v-slot:item.actions="{ item }">
                    <v-btn x-small @click="toDetalhesEstrutura(item)">Detalhes</v-btn>
                    <v-btn x-small color="error" @click="eliminarEstrutura(item)" v-if="item.estado === 'ANALISE' && tipo_utilizador ==='Projetista'">Eliminar</v-btn>
                  <template v-if="tipo_utilizador ==='Administrador'">
                    <v-btn x-small color="success" @click="aprovarEstrutura(item)">Aprovar</v-btn>
                    <v-btn x-small color="warning" @click="rejeitarEstrutura(item)">Rejeitar</v-btn>
                    <v-btn x-small color="error" @click="eliminarEstrutura(item)" >Eliminar</v-btn>
                  </template>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-text v-if="tipo_utilizador ==='Cliente' && this.projeto.visivelCliente">
              <v-data-table :items="estruturas" :headers="cabecalhos_estruturas" :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-btn x-small @click="toDetalhesEstrutura(item)">Detalhes</v-btn>
                  <template v-if="item.estado === 'ANALISE'">
                    <v-btn x-small color="success" @click="aprovarEstrutura(item)">Aprovar</v-btn>
                    <v-btn x-small color="error" @click="rejeitarEstrutura(item)">Rejeitar</v-btn>
                  </template>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--      Observações-->
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Observações
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="tipo_utilizador === 'Cliente' && this.projeto.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_observacao = true">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar observação.</span>
              </v-tooltip>
              <v-tooltip bottom v-if="tipo_utilizador === 'Cliente' && this.projeto.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="limparObservacao">
                    <v-icon>mdi-eraser-variant</v-icon>
                  </v-btn>
                </template>
                <span>Limpar conteúdo da observação.</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text v-if="projeto.observacoes">
              {{ projeto.observacoes }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!--      Ficheiros-->
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Ficheiros
              </v-toolbar-title>
              <v-text-field
                v-if="ficheiros.length !== 0"
                v-model="search_ficheiro"
                label="Pesquisa"
                hide-details
                prepend-inner-icon="mdi-magnify"
                class="shrink"
                style="margin-left: 15px"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-tooltip bottom v-if="(tipo_utilizador === 'Cliente' || tipo_utilizador === 'Administrador') && this.projeto.estado === 'ANALISE'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_ficheiro = true">
                    <v-icon>mdi-file-upload</v-icon>
                  </v-btn>
                </template>
                <span>Inserir ficheiro</span>
              </v-tooltip >
            </v-toolbar>
            <v-card-text v-if="ficheiros.length !== 0">
              <v-data-table :items="ficheiros" :headers="cabecalhos_ficheiros" :search="search_ficheiro">
                <template v-slot:item.actions_ficheiros="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" @click="download(item)">
                        <v-icon>mdi-file-download</v-icon>
                      </v-btn>
                    </template>
                    <span>Descarregar ficheiro</span>
                  </v-tooltip >
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
import error from "@/layouts/error";
import aux_dialog_confirmacao from "../../../components/aux_dialog_confirmacao";
import aux_snackbar from "../../../components/aux_snackbar";

export default {
  data: () => {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      caminhos: [
        {
          text: 'Projetos',
          disabled: false,
          href: '/projetos/',
        },
        {
          text:'',
          disabled: true,
          href: 'breadcrumbs_link_1',
        },
      ],

      loading: true,
      loading_text:'',

      email_app:'noreply@projeto.com',
      email_assunto:'[Projeto +]',
      subject:'',
      message:'',
      date:'',
      dialog_email: false,

      projeto:'',
      estruturas:[],
      ficheiros:[],
      search:'',
      search_ficheiro:'',

      dialog_observacao: false,
      observacao:'',

      tipo_utilizador:'',

      cabecalhos_estruturas:[
        {
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
      cabecalhos_ficheiros:[
        {
          text: 'Nome Ficheiro',
          align: 'start',
          sortable: true,
          value: 'filename',
        },
        {
          text: 'Ações',
          value: 'actions_ficheiros',
        },
      ],
      //props para o dialog de edição
      nome:'',
      dialog_editar_projeto:false,
      dialog_ficheiro: false,
      dialog_adicionar_estrutura: false,

      file: null,

      valid:true,
      tiposMaterial:[],
      nome_estrutura:'',
      nVaos_estrutura:'',
      comprimentoVaos_estrutura:'',
      sobrecarga_estrutura:'',
      tipoMaterialSelected:'',

    }
  },
  computed: {
    hasFile () {
      return this.file != null
    },
    formData () {
      let formData = new FormData()
      formData.append('referencia', this.$route.params.refProjeto)
      if (this.file) {
        formData.append('file', this.file)
      }
      return formData
    }
  },
  methods:{
    upload() {
      if (!this.hasFile) {
        return
      }
      let promisse = this.$axios.$post('/api/ficheiros/upload', this.formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      promisse.then(() => {
        this.color = 'green';
        this.text = 'Ficheiro carregado com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.dialog_ficheiro = false;
        this.loading = true;
        this.getProjeto();
      })
      promisse.catch(() => {
        this.color = 'error';
        this.text = 'Ocorreu um erro, ficheiro não carregado.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })
    },
    download(ficheiro) {
      const idFicheiro = ficheiro.id;
      this.$axios.$get('/api/ficheiros/download/' + idFicheiro, {
        responseType:
          'arraybuffer'
      })
        .then(file => {
          const url = window.URL.createObjectURL(new Blob([file]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', ficheiro.filename)
          document.body.appendChild(link)
          link.click()
        })
    },
    getProjeto(){
      this.loading_text= 'A limpar ferrugem...'
      this.$axios.$get('/api/projetos/'+this.$route.params.refProjeto)
        .then((projeto) => {
          this.projeto = projeto;
          this.estruturas = projeto.estruturas;
          this.ficheiros = projeto.ficheiros;
          this.observacao = projeto.observacoes;
          this.nome = projeto.nome;
          this.loading = false;
          this.caminhos[1].text = projeto.referencia;
      })
      .catch (error => {
        this.color = 'error';
        this.text = 'Ocorreu um erro.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        this.$router.push("/home");
      })
    },
    getEstruturas(){
      this.$axios.$get('/api/projetos/'+this.$route.params.refProjeto+'/estruturas')
        .then((response) => {
          this.estruturas = response;
        })
    },
    editarObservacao(){
      this.$axios.put('/api/projetos/'+this.$route.params.refProjeto+'/observacoes',{
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
          this.getProjeto();
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
      this.$axios.put('/api/projetos/'+this.$route.params.refProjeto+'/observacoes', {
        observacao: ''
      })
        .then(() => {
          this.color = 'green';
          this.text = 'Observação limpa com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          this.getProjeto();
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
    async aprovarProjeto() {

      if (await this.$refs.confirm.open(
        "Aprovar Projeto",
        "Tem a certeza que quer aprovar este projeto?")
      ) {
        this.loading = true;
        this.loading_text = 'A carregar os seus dados...'
        this.$axios.put('/api/projetos/aprove/' + this.projeto.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'O projeto foi aprovado.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })
      }else{
        return null;
      }

    },
    async rejeitarProjeto() {
      if (await this.$refs.confirm.open(
        "Rejeitar Projeto",
        "Tem a certeza que quer rejeitar este projeto?")
      ) {
        this.loading = true;
        this.loading_text = 'A carregar os seus dados...'
        this.$axios.put('/api/projetos/reject/' + this.projeto.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'O projeto foi rejeitado.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })
      } else {
        return null;
      }
    },
    async aprovarEstrutura(item) {
      if (await this.$refs.confirm.open(
        "Aprovar Estrutura",
        "Tem a certeza que quer aprovar esta estrutura?")
      ) {
        this.loading = true;
        this.loading_text = 'A carregar os seus dados...'
        this.$axios.put('/api/projetos/' + this.projeto.referencia + '/aprove/' + item.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'O Estrutura foi aprovada.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })

      } else {
        return null;
      }

    },
    async rejeitarEstrutura(item) {
      if (await this.$refs.confirm.open(
        "Rejeitar Estrutura",
        "Tem a certeza que quer rejeitar esta estrutura?")
      ) {
        this.loading = true;
        this.loading_text = 'A carregar os seus dados...'
        this.$axios.put('/api/projetos/' + this.projeto.referencia + '/reject/' + item.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'A Estrutura foi rejeitada.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })
      } else {
        return null;
      }
    },

  //#############################################Funções para o projetista
    async disponibilizar() {
      if (await this.$refs.confirm.open(
        "Disponibilizar Projeto",
        "Tem a certeza que quer disponibilizar este projeto?")
      ) {
        this.loading = true;
        this.loading_text = 'A processar dados...'
        this.$axios.put('/api/projetos/provide/' + this.projeto.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'O projeto foi disponibilizado ao cliente com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })
      } else {
        return null;
      }
    },
    async indisponibilizar() {
      if (await this.$refs.confirm.open(
        "Indisponibilizar",
        "Tem a certeza que quer indisponibilizar este projeto?")
      ) {
        this.loading = true;
        this.loading_text = 'A processar dados...'
        this.$axios.put('/api/projetos/unavailable/' + this.projeto.referencia)
          .then(() => {
            this.color = 'green';
            this.text = 'O projeto foi indisponibilizado ao cliente com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar= false;
            }, 2000);
            this.getProjeto();
          })
      } else {
        return null;
      }
    },
    editarProjeto(){
      if(this.$refs.observer_projeto.validate()){
        this.$axios.$put('/api/projetos/'+this.$route.params.refProjeto, {
          nome: this.nome,
          emailCliente: this.projeto.emailCliente,
          emailProjetista: this.projeto.emailProjetista,
          referencia: this.projeto.referencia,
        })
          .then(() => {
            this.color = 'green';
            this.text = 'Edição do Projeto realizado com sucesso.';
            this.snackbar = true;
            this.getProjeto()
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com a edição do projeto.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
          })
      }
      this.dialog_editar_projeto = false;
      this.getProjeto();
    },
    async eliminarProjeto() {
      if (await this.$refs.confirm.open(
        "Eliminar Projeto",
        "Tem a certeza que quer eliminar este projeto?")
      ) {
        this.$axios.delete('/api/projetos/' + this.projeto.referencia + '/')
          .then((response) => {
            this.color = 'green';
            this.text = 'O projeto foi eliminado com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);

            setTimeout(() => {
              this.$router.push("/projetos");
            }, 1500);
          })
      } else {
        return null;
      }
    },
    async eliminarEstrutura(item) {
      if (await this.$refs.confirm.open(
        "Eliminar Estrutura",
        "Tem a certeza que quer eliminar esta estrutura?")
      ) {
        this.$axios.delete('/api/estruturas/' + item.referencia + '/')
          .then((response) => {
            this.color = 'green';
            this.text = 'A Estrutura foi eliminada com sucesso.';
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
            this.getProjeto();
          })
      } else {
        return null;
      }
    },

    adicionarEstrutura(){
      if(this.$refs.observer_add_estrutura.validate()){
        this.loading = true;
        this.loading_text = 'A processar dados...'
        this.$axios.$post('/api/estruturas/', {
          idTipoMaterial: this.tipoMaterialSelected.id,
          nome: this.nome_estrutura,
          numeroVaos: this.nVaos_estrutura,
          comprimentoVao: this.comprimentoVaos_estrutura,
          sobrecarga: this.sobrecarga_estrutura

        }).then((response) => {
          this.tipoMaterialSelected.id = null;
          this.nome_estrutura = null;
          this.nVaos_estrutura = null;
          this.comprimentoVaos_estrutura = null;
          this.sobrecarga_estrutura = null;
          this.color = 'green lighten-1';
          this.text = 'Estrutura foi criada com sucesso.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
          this.dialog_adicionar_estrutura = false;
          this.$axios.$put('/api/projetos/' + this.projeto.referencia + '/add/' + response.referencia)
            .then(() => {
              this.getProjeto();
            })
        }).catch(error => {
          console.log(error)
          this.color = 'red';
          this.text = 'Ocorreu um erro.';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
        })
      }
    },

    sendEmail() {
      this.date = new Date();
      this.$axios.post('/api/emails/' + this.$auth.user.sub + '/sendto/' + this.projeto.emailProjetista, {
        subject: '[Projeto +] [' + this.projeto.referencia + '] ' + this.subject,
        message: '[Mensagem do cliente] \n ' + this.message + '\n [' + this.date + ']'
      }).then(() => {
        this.color = 'green lighten-1';
        this.text = 'Email enviado com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar = false;
        }, 2000);
        this.dialog_email = false;
        this.subject = "";
        this.message = ""
      }).catch(error => {
        console.log(error)
        this.color = 'red darken-1';
        this.text = 'Ocorreu um erro ao enviar o email.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar = false;
        }, 2000);
      })
    },
    toDetalhesEstrutura(item) {
      this.$router.push('/projetos/' + this.projeto.referencia + '/estruturas/' + item.referencia);
    },
    getTipoUtilizador() {
      this.tipo_utilizador = this.$auth.user.groups[0];
    },
    getTiposMaterial() {
      this.$axios.$get('/api/tipos_material/all')
        .then((response) => {
          this.tiposMaterial = response;

        }).catch(error => {
      })
    },


  },
  created() {
    this.getProjeto()
    this.getTipoUtilizador()
    this.getTiposMaterial()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_dialog_confirmacao,
    aux_snackbar,
  },
}

</script>
