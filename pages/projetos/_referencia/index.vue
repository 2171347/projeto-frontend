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

    <!--    DIALOG para adicionar uma observação ao projeto           -->
    <v-dialog v-model="dialog_observacao" max-width="490">
      <v-card>
        <v-card-title class="headline">
         Adicionar uma observação
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
      <v-col md="5">
        <v-card>
          <v-card-title>Dados do Projeto</v-card-title>
          <v-card-text>
            <p><b>Referencia Projeto:</b> {{ projeto.referencia }}</p>
            <p><b>Nome Projeto:</b> {{ projeto.nome }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="5">
        <!--  Ações para o cliente  -->
        <v-card v-if="this.$auth.user.groups.includes('Cliente')">
          <v-card-title>Ações</v-card-title>
          <v-card-text >
            <v-row>
              <v-col>
                <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="perfilProjetista" small>Perfil Projetista</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn @click="aprovarProjeto" color="success" small>Aprovar Projeto</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="rejeitarProjeto" color="error" small> Rejeitar Projeto</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!--  Ações para o projetista  -->
        <v-card v-if="this.$auth.user.groups.includes('Projetista')">
          <v-card-title>Ações</v-card-title>
          <v-card-text >
            <!--TODO criar botões para a vista do projetista-->

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Estruturas</v-card-title>
          <v-card-text>
            <v-data-table :items="estruturas" :headers="cabecalhos_estruturas">
              <template v-slot:item.actions="{ item }">
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
          <v-card-title>
            Observações
            <v-spacer></v-spacer>
            <div class="d-flex justify-end" style="margin-right: 2px;" v-if="this.$auth.user.groups.includes('Cliente')">
              <v-btn x-small  @click.stop="dialog_observacao = true">Editar</v-btn>
              <v-btn x-small>Limpar</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
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
      projeto:[],
      estruturas:[],
      subject:'',
      message:'',
      observacao:'',
      date:'',
      cabecalhos_estruturas:[{
        text: 'Nome Projeto',
        align: 'start',
        sortable: true,
        value: 'nome',
      },{
        text: 'Tipo Material',
        align: 'start',
        sortable: true,
        value: 'tipoMaterial',
      },{
        text: 'Ações',
        value: 'actions',
      },
      ]
    }
  },
  methods:{
    getProjeto(){
      this.$axios.$get('/api/projetos/'+this.$route.params.referencia).then((projeto) => {
        this.projeto = projeto;
        this.estruturas = projeto.estruturas;
      })
    },
    editarObservacao(){
      //TODO criar rota para adicionar uma observação ao projeto
    },
    aprovarProjeto(){
      //TODO criar rota para aprovar um projeto
      // Enviar email ao projetista da plataforma a informar que o projeto foi aprovado
    },
    rejeitarProjeto(){
      //TODO criar rota para rejeitar projeto
      // Enviar email ao projetista da plataforma a informar que o projeto foi rejeitado

    },
    perfilProjetista(){
      //TODO redirecionar para o perfil do cliente
    },
    sendEmail(){
      this.date = this.getDate();

      this.$axios.post('/api/emails/'+this.projeto.emailProjetista+'/sendto/'+this.$auth.user.sub,{
        subject: '[Projeto +] ['+this.projeto.referencia+'] '+this.subject,
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
    toDetalhes (item){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+item.referencia);
    },
    getDate(){
      var currentDate = new Date();
      return currentDate;
    }
  },
  created() {
    this.getProjeto()
  },
}

</script>
