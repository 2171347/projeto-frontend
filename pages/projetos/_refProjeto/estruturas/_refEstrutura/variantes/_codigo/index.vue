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
    <!--    -->
    <v-btn @click="$router.go(-1)">Voltar</v-btn>

    <p>Variante {{ this.variante }}</p>
    <p>Produto {{ this.produto }}</p>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>Dados do Produto</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p><b>Nome:</b> {{ produto.nome }}</p>
                <p><b>Referencia:</b> {{ produto.refere }}</p>
              </v-col>
              <v-col>
                <p><b>Fabricante:</b> {{ produto.emailFabricante }}</p>
                <p><b>Tipo Material:</b> {{ estrutura.nomeTipoMaterial }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6">
        <!--  Ações para o cliente  -->
        <v-card v-if="this.$auth.user.groups.includes('Cliente')">
          <v-card-title>Ações</v-card-title>
          <v-card-text >
            <v-row>
              <v-col>
                <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="" small>Perfil Projetista</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="" color="success" small>Aprovar Estrutura</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="" color="error" small> Rejeitar Estrutura</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!--  Ações para o projetista  -->
        <v-card v-if="this.$auth.user.groups.includes('Projetista')">
          <v-card-title>Ações</v-card-title>
          <v-card-text >
            <!--TODO rever formatação dos botões-->
            <v-btn x-small color="primary" @click="">Editar</v-btn>
            <v-btn x-small color="error" @click="">Eliminar</v-btn>
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
    }
  },
  methods:{
    getProduto(id){
      this.$axios.$get('/api/produtos/'+id)
        .then((produto) => {
          this.produto = produto;
          this.getFabricante(produto.emailFabricante);
        })
    },
    getVariante(){
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
  }
}
</script>
