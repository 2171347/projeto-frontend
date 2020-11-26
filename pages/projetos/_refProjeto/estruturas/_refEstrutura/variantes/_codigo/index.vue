<template>
  <div>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'" :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

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

    <!--    LOADING-->
    <v-container v-if="this.loading === true" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>

    <v-container v-if="this.loading === false">
      <v-toolbar>
        <v-btn @click="$router.go(-1)">Voltar</v-btn>
        <v-breadcrumbs :items="caminhos">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
      <v-row>
        <v-col md="6">
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Dados do Produto
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col>
                  <p><b>Nome:</b> {{ produto.nome }}</p>
                  <p><b>Variante:</b> {{ variante.nome }}</p>
                  <p><b>Fabricante:</b> {{ produto.emailFabricante }}</p>
                  <p><b>Tipo Material:</b> {{ produto.nomeTipoMaterial }}</p>
                  <p><b>Familia Material:</b> {{ produto.nomeFamiliaMaterial }}</p>
                </v-col>
                <v-col>
                  <p><b>Referencia Fabricante:</b> {{ produto.referenciaFabricante }}</p>
                  <p><b>Código Variante:</b> {{ variante.codigo }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6">
          <v-card>
            <v-toolbar>
              <v-toolbar-title class="d-flex justify-center" style="margin-right: 10px">
                Dimensões e Características
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p><b>Área:</b> {{ variante.ar }}</p>
              <p><b>Peso próprio:</b> {{ variante.pp }} </p>
              <p><b>Tensão de cedência (Σ):</b> {{ variante.sigmaC }}</p>
              <p><b>Modo Elástico Positivo:</b> {{ variante.weff_p }}</p>
              <p><b>Modo Elástico Negativo:</b> {{ variante.weff_n  }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
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
      produto: "",
      estrutura:"",
      variante:"",
      fabricante:"",
      subject:'',
      message:'',
      observacao:'',
      date:'',

      loading: true,
      loading_text:'',

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
      this.caminhos[2].href = '/projetos/'+this.$route.params.refProjeto+'/estruturas/'+this.$route.params.refEstrutura;
      this.caminhos[3].text = 'Produto: '+this.$route.params.codigo;
    },
    getProduto(id){
      this.$axios.$get('/api/produtos/'+id)
        .then((produto) => {
          this.produto = produto;
          this.loading = false;
        })
    },
    getVariante(){
      this.loading_text = "A desinfetar..."
      this.$axios.$get('/api/variantes/'+this.$route.params.codigo)
        .then((variante) => {
          this.variante = variante;
          this.getProduto(variante.produtoID);
        })
    },
    getEstrutura(){
      this.$axios.$get('/api/estruturas/'+this.$route.params.refEstrutura)
        .then((estrutura) => {
          this.estrutura = estrutura;
        })
    },
    getFabricante(email){
      //TODO é forbidden
      this.$axios.$get('/api/fabricantes/'+email)
        .then((fabricante) => {
          this.fabricante = fabricante;
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
  },
  created() {
    this.getEstrutura();
    this.getVariante();
    this.preencherCaminhos()
  }
}
</script>
