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
            Guardar
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
              <template v-if="this.projeto.estado === 'ANALISE'">
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
              <!--TODO rever formatação dos botões-->
              <v-btn small color="primary" @click.stop="dialog_editar_projeto=true">Editar</v-btn>
              <v-btn small color="error" @click="eliminarProjeto()">Eliminar</v-btn>
              <template v-if="this.projeto.visivelCliente === false">
                <v-btn small color="accent" @click="disponibilizar()">Disponibilizar</v-btn>
              </template>
              <template v-if="this.projeto.visivelCliente === true">
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
              <!--TODO rever formatação dos botões-->
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
      <v-row>
        <v-col>
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">Estruturas</v-toolbar-title>
                <v-text-field
                  v-model="search"
                  label="Pesquisa"
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="shrink"
                  style="margin-left: 15px"
                ></v-text-field>
                <v-spacer></v-spacer>
              <v-tooltip bottom v-if="this.tipo_utilizador ==='Projetista' || this.tipo_utilizador ==='Administrador'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="criarEstrutura">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Criar um nova estrutura.</span>
              </v-tooltip>

            </v-toolbar>
            <v-card-text>
              <v-data-table :items="estruturas" :headers="cabecalhos_estruturas" :search="search">
                <template v-slot:item.actions="{ item }">
                  <template v-if="tipo_utilizador ==='Projetista'">
                    <v-btn x-small @click="toDetalhesEstrutura(item)">Detalhes</v-btn>
                    <v-btn x-small color="error" @click="eliminarEstrutura(item)">Eliminar</v-btn>
                  </template>
                  <template v-if="tipo_utilizador ==='Cliente'">
                    <v-btn x-small @click="toDetalhesEstrutura(item)">Detalhes</v-btn>
                    <template v-if="item.estado === 'ANALISE'">
                      <v-btn x-small color="success" @click="aprovarEstrutura(item)">Aprovar</v-btn>
                      <v-btn x-small color="error" @click="rejeitarEstrutura(item)">Rejeitar</v-btn>
                    </template>
                  </template>
                  <template v-if="tipo_utilizador ==='Administrador'">
                    <v-btn x-small @click="toDetalhesEstrutura(item)">Detalhes</v-btn>
                    <v-btn x-small color="success" @click="aprovarEstrutura(item)">Aprovar</v-btn>
                    <v-btn x-small color="warning" @click="rejeitarEstrutura(item)">Rejeitar</v-btn>
                    <v-btn x-small color="error" @click="eliminarEstrutura(item)">Eliminar</v-btn>
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
              <v-tooltip bottom v-if="tipo_utilizador === 'Cliente'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_observacao = true">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar observação.</span>
              </v-tooltip >
              <v-tooltip bottom v-if="tipo_utilizador === 'Cliente'">
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
              <v-tooltip bottom v-if="tipo_utilizador === 'Cliente' || tipo_utilizador === 'Administrador'">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" @click="dialog_ficheiro = true">
                    <v-icon>mdi-file-upload</v-icon>
                  </v-btn>
                </template>
                <span>Inserir ficheiro.</span>
              </v-tooltip >
            </v-toolbar>
            <v-card-text v-if="ficheiros.length !== 0">
              <v-data-table :items="ficheiros" :headers="cabecalhos_ficheiros" :search="search_ficheiro">
                <template v-slot:item.actions_ficheiros="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" @click="">
                        <v-icon>mdi-file-download</v-icon>
                      </v-btn>
                    </template>
                    <span>Descarregar ficheiro.</span>
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

export default {
  data: () => {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 3000,
      x: null,
      y: 'top',
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

      file: null,

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
        this.dialog_ficheiro = false;
        this.loading = true;
        this.getProjeto();
      })
      promisse.catch(() => {
        this.color = 'error';
        this.text = 'Ocorreu um erro, ficheiro não carregado.';
        this.snackbar = true;
      })
    },
    getProjeto(){
      this.loading_text= 'A limpar ferrugem...'
      this.$axios.$get('/api/projetos/'+this.$route.params.refProjeto)
        .then((projeto) => {
          console.log(projeto)
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
          this.dialog_observacao = false;
          this.getProjeto();
        })
        .catch(error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro com a alteração da observação.';
          this.snackbar = true;
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
          this.getProjeto();
        })
        .catch(error => {
          this.color = 'error';
          this.text = 'Ocorreu um erro com a limpeza da observação.';
          this.snackbar = true;
        })

    },
    aprovarProjeto(){
      this.loading = true;
      this.loading_text = 'A carregar os seus dados...'
      //TODO criar rota para aprovar um projeto
      this.$axios.put('/api/projetos/aprove/'+this.projeto.referencia)
      .then(() => {
        this.color = 'green';
        this.text = 'O projeto foi aprovado.';
        this.snackbar = true;
        this.getProjeto();

      })
    },
    rejeitarProjeto(){
      this.loading = true;
      this.loading_text = 'A carregar os seus dados...'
      this.$axios.put('/api/projetos/reject/'+this.projeto.referencia)
        .then(() => {
          this.color = 'green';
          this.text = 'O projeto foi rejeitado.';
          this.snackbar = true;
          this.getProjeto();
        })
    },
    aprovarEstrutura(item){
      this.loading = true;
      this.loading_text = 'A carregar os seus dados...'
      this.$axios.put('/api/projetos/'+this.projeto.referencia+'/aprove/'+item.referencia)
        .then(() => {
          this.color = 'green';
          this.text = 'O Estrutura foi aprovada.';
          this.snackbar = true;
          this.getProjeto();
        })
    },
    rejeitarEstrutura(item){
      this.loading = true;
      this.loading_text = 'A carregar os seus dados...'
      this.$axios.put('/api/projetos/'+this.projeto.referencia+'/reject/'+item.referencia)
        .then(() => {
          this.color = 'green';
          this.text = 'O Estrutura foi rejeitada.';
          this.snackbar = true;
          this.getProjeto();
        })
    },

  //#############################################Funções para o projetista
    disponibilizar(){
      this.loading = true;
      this.loading_text = 'A processar dados...'
      this.$axios.put('/api/projetos/provide/'+this.projeto.referencia)
        .then(() => {
          this.color = 'green';
          this.text = 'O projeto foi disponibilizado ao cliente com sucesso.';
          this.snackbar = true;
          this.getProjeto();
        })
    },
    indisponibilizar(){
      this.loading = true;
      this.loading_text = 'A processar dados...'
      this.$axios.put('/api/projetos/unavailable/'+this.projeto.referencia)
        .then(() => {
          this.color = 'green';
          this.text = 'O projeto foi indisponibilizado ao cliente com sucesso.';
          this.snackbar = true;
          this.getProjeto();
        })
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
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com a edição do projeto.';
            this.snackbar = true;
          })
      }
      this.dialog_editar_projeto = false;
      this.getProjeto();
    },
    eliminarProjeto(){
      this.$axios.delete('/api/projetos/'+this.projeto.referencia+'/')
      .then((response) => {
        this.color = 'green';
        this.text = 'O projeto foi eliminado com sucesso.';
        this.snackbar = true;

        setTimeout(() => {
          this.$router.push("/projetos");
        }, 1500);
      })
    },
    eliminarEstrutura(item){
      this.$axios.delete('/api/estruturas/'+item.referencia+'/')
        .then((response) => {
          this.color = 'green';
          this.text = 'A Estrutura foi eliminada com sucesso.';
          this.snackbar = true;
          this.getProjeto();
        })
    },
    sendEmail(){
      this.date = new Date();
      this.$axios.post('/api/emails/'+this.projeto.emailProjetista+'/sendto/'+this.$auth.user.sub,{
        subject: '[Projeto +] ['+this.projeto.referencia+'] '+this.subject,
        message: '[Mensagem do cliente] \n '+this.message + '\n ['+this.date+']'
      }).then(() => {
          this.color = 'green lighten-1';
          this.text = 'Email enviado com sucesso.';
          this.snackbar = true;
          this.dialog_email = false;
          this.subject = "";
          this.message = ""
      }).catch(error =>{
        console.log(error)
        this.color = 'red darken-1';
        this.text = 'Ocorreu um erro ao enviar o email.';
        this.snackbar = true;
      })
    },
    toDetalhesEstrutura (item){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+item.referencia);
    },
    criarEstrutura(){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/criar');
    },
    getTipoUtilizador(){
      this.tipo_utilizador = this.$auth.user.groups[0];
    }
  },
  created() {
    this.getProjeto()
    this.getTipoUtilizador()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}

</script>
