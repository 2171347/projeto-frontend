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

    <!--    DIALOG para adicionar uma observação à estrutura           -->
    <v-dialog v-model="dialog_observacao" max-width="490">
      <v-card>
        <v-card-title class="headline">
          Adicionar/Editar uma observação
        </v-card-title>
        <v-card-text>
          <v-textarea solo v-model="observacao"></v-textarea>
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

    <v-btn @click="$router.go(-1)">Voltar</v-btn>

    <v-row>
      <!-- Dados Estrutura -->
      <v-col md="6">
        <v-card>
          <v-card-title>Dados da Estrutura</v-card-title>
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
          <v-card-title>Ações</v-card-title>
          <v-card-text>
            <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>
            <v-btn small @click="changeAprovado" color="success" >Aprovar Estrutura</v-btn>
            <v-btn small @click="changeRejeitado" color="error" > Rejeitar Estrutura</v-btn>
          </v-card-text>
        </v-card>
        <!--  Ações para o projetista  -->
        <v-card v-if="this.$auth.user.groups.includes('Projetista')">
          <v-card-title>Ações</v-card-title>
          <v-card-text>
            <!--TODO rever formatação dos botões-->
            <!--            <v-btn x-small color="primary" @click="editarEstrutura">Editar</v-btn>-->
            <v-btn x-small color="primary" @click="dialog_editar_estrutura = true">Editar</v-btn>
            <v-btn x-small color="error" @click="eliminarEstrutura">Eliminar</v-btn>
            <v-btn x-small color="info" @click="simular">Simular</v-btn>
          </v-card-text>
        </v-card>
        <!--  Ações para o administrador  -->
        <v-card v-if="this.$auth.user.groups.includes('Administrador')">
          <v-card-title>Ações</v-card-title>
          <v-card-text>
            <!--TODO rever formatação dos botões-->
            <v-row>
              <v-col>
                <v-btn x-small color="primary" @click="dialog_editar_estrutura = true">Editar</v-btn>
              </v-col>
              <v-col>
                <v-btn x-small color="error" @click="eliminarEstrutura">Eliminar</v-btn>
              </v-col>
              <v-col>
                <v-btn x-small color="info" @click="simular">Simular</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="changeAprovado" color="success" small>Aprovar Estrutura</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="changeRejeitado" color="error" small> Rejeitar Estrutura</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="changeAnalisar" color="error" small> Analisar Estrutura</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>Dados Geométricos Estrutura</v-card-title>
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
          <v-card-title>
            Produtos
            <v-spacer></v-spacer>
            <div class="d-flex justify-end" style="margin-right: 2px;" v-if="this.$auth.user.groups.includes('Projetista')">
              <v-btn x-small @click="">Catálogo</v-btn>
            </div>
          </v-card-title>
          <v-card-text v-if="loading_produtos === true">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
          <template v-if="loading_produtos === false">
            <v-card-text v-if="variantes.length!==0">
              <v-data-table :items="variantes" :headers="cabecalhos_variantes">
                <template v-slot:item.actions="{ item }">
                  <v-btn x-small @click="toDetalhes(item)">Detalhes</v-btn>
                  <v-btn x-small color="error" @click="removerProdutos(item)">Remover</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Observações
            <v-spacer></v-spacer>
            <div class="d-flex justify-end" style="margin-right: 2px;" v-if="this.$auth.user.groups.includes('Cliente')">
              <v-btn x-small  @click.stop="dialog_observacao = true">Editar</v-btn>
              <v-btn v-if="estrutura.observacoes" x-small>Limpar</v-btn>
            </div>
          </v-card-title>
          <v-card-text v-if="estrutura.observacoes">
            {{ estrutura.observacoes}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {

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

      email_app:'noreply@projeto.com',
      email_assunto:'[Projeto +]',
      dialog_observacao: false,
      dialog_email: false,
      projeto: '',
      estrutura:'',
      variantes:[],
      subject:'',
      message:'',
      observacao:'',
      date:'',
      loading_produtos: true,
      cabecalhos_variantes:[{
        text: 'Produto',
        align: 'start',
        sortable: true,
        value: 'produtoID',
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
      //variaveis para o dialog de editar
      nome:'',
      comprimentoVao:'',
      numeroVaos:'',
      sobrecarga:'',
      idTipoMaterial:'',
      tiposMaterial:[],
      dialog_editar_estrutura: false,
      errorsTipoMaterial:'',
    }
  },
  methods:{
    getProjeto(){
      this.$axios.$get('/api/projetos/'+this.$route.params.refProjeto)
        .then((projeto) => {
          this.projeto = projeto;
        })
    },
    getEstrutura(){
      //TODO - JOANA verificar assincrono
      this.$axios.$get('/api/estruturas/'+this.$route.params.refEstrutura)
        .then((estrutura) => {
          this.estrutura = estrutura;
          this.variantes = estrutura.variantes;
          for (let aux in this.variantes){
            this.$axios.$get('/api/produtos/'+this.variantes[aux].produtoID)
              .then((produto) => {
                this.variantes[aux].produtoID = produto.nome;
              })
          }
          this.$axios.$get('/api/tipos_material/'+estrutura.idTipoMaterial)
            .then((tipoMaterial) => {
              this.idTipoMaterial = tipoMaterial.id;
            })
          this.loading_produtos = false;
      })
      .then(() => {
        this.preencherProps();
      })
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
    changeAprovado(){
      this.$axios.$put('/api/projetos/'+this.projeto.referencia+'/aprove/'+this.estrutura.referencia)
        .then(() => {
          this.getEstrutura()
        })
    },
    changeRejeitado(){
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
      this.$axios.put('/api/estruturas/'+this.$route.params.refEstrutura+'/observacoes', {
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
    sendEmail(){
      this.date = this.getDate();
      this.$axios.post('/api/emails/'+this.projeto.emailProjetista+'/sendto/'+this.$auth.user.sub,{
        subject: '[Estrutura +] ['+this.estrutura.referencia+'] '+this.subject,
        message: '[Mensagem do cliente] \n '+this.message + '\n ['+this.date+']'
      }).then((response) => {
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
    //-------------------------------Métodos para o projetista
    removerProdutos(item){
      this.$axios.$put('/api/estruturas/'+this.estrutura.referencia+'/removeVariante/'+item.codigo)
      .then(() => {
        this.getEstrutura()
      })
    },
    changeAnalisar(){
      this.$axios.$put('/api/projetos/'+this.projeto.referencia+'/analise/'+this.estrutura.referencia)
        .then(() => {
          this.getEstrutura()
        })
    },
    simular(){

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
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
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
          this.$router.push("/projetos/"+this.projeto.referencia);
        }, 1000);
      })
    },
    // Métodos gerais
    //detalhes do produto
    toDetalhes (item){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+this.estrutura.referencia+'/variantes/'+item.codigo);
    },
  },
  created() {
    this.getEstrutura()
    this.getProjeto()
    this.getTiposMateriais()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}
</script>
