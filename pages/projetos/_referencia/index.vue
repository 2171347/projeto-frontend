<template>
  <div>
    <v-dialog
      v-model="dialog_observacao"
      max-width="490"
    >
      <v-card>
        <v-card-title class="headline">
         Adicionar uma observação
        </v-card-title>

        <v-card-text>
          <v-textarea solo v-model="observacao"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog_observacao = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="editarObservacao"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_email"
      max-width="490"
    >
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

          <v-btn
            color="green darken-1"
            text
            @click="dialog_email = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="sendEmail"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn @click="$router.go(-1)">Voltar</v-btn>
    <v-row>
      <v-col  md="5">
        <v-card>
          <v-card-title>Dados do Projeto</v-card-title>
          <v-card-text>
            <p><b>Referencia Projeto:</b> {{ projeto.referencia }}</p>
            <p><b>Nome Projeto:</b> {{ projeto.nome }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col  md="5">
        <v-card>
          <v-card-title>Ações</v-card-title>
          <v-card-text >
            <v-btn small @click.stop="dialog_email = true">Contactar Projetista</v-btn>

            <v-btn small>Perfil Projetista</v-btn>
            <v-btn color="success" small>Aprovar Projeto</v-btn>
            <v-btn color="error" small> Rejeitar Projeto</v-btn>
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
            <div class="d-flex justify-end" style="margin-right: 2px;">
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
      dialog_observacao: false,
      dialog_email: false,
      projeto:[],
      estruturas:[],
      subject:'',
      message:'',
      observacao:'',
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

    },
    sendEmail(){
      this.$axios.post('/api/emails/'+"projetista1@projetista.com"+'/sendto/'+"cliente1@cliente.com",{
        subject: this.subject,
        message: this.message
      }).then((response) => {
          this.dialog_email = false;
         this.subject = "";
          this.message = ""
      }).catch(error =>{
        console.log(error)

      })
    },
    toDetalhes (item){
      this.$router.push('/projetos/'+ this.projeto.referencia+'/estruturas/'+item.referencia);
    },
  },
  created() {
    this.getProjeto()
  }
}

</script>
