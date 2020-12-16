<template>
  <div>
    <v-dialog @keydown.esc="dialogInfoPedido = false" v-model="dialogInfoPedido" max-width="500px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            Informação do Pedido de Suporte
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon v-bind="attrs" v-on="on" @click="dialogInfoPedido = false" >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="margin-top: 20px;">
          <p><b>Tipo de Pedido:</b> {{infoPedido.tipoPedido}}</p>
          <p><b>Mensagem:</b> {{infoPedido.mensagem}}</p>
          <p><b>Enviado por:</b> {{infoPedido.emailEmissor}}</p>
          <p><b>Data de Envio:</b> {{infoPedido.createdAt}}</p>
          <p><b>Data de 'Taken by':</b> {{infoPedido.acceptedAt}}</p>
          <p><b>Utilizador Responsavel:</b> {{infoPedido.emailResponsavel}}</p>
          <p><b>Data de Resolução:</b> {{infoPedido.answeredAt}}</p>
        </v-card-text>
        <v-card-actions class="pt-3">
          <v-spacer></v-spacer>
          <v-btn color="grey" text class="body-2 font-weight-bold" @click="dialogInfoPedido = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <aux_dialog_confirmacao ref="confirm"/>
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        {{ loading_text }}
      </v-layout>
    </v-container>
    <v-container v-if="!loading">
        <v-toolbar class="d-flex justify-center align-center" style="margin-bottom: 20px;">
          Pedidos de Suporte
        </v-toolbar>
        <v-card>
          <v-toolbar >
            <v-toolbar-title>Todos os pedidos</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="Pesquisa"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="shrink"
            ></v-text-field>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :items="pedidosSuporte"
              :headers="headers"
              :search="search"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }" >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on}">
                      <v-btn v-on="on" icon @click="toDetalhes(item)"><v-icon>mdi-information</v-icon></v-btn>
                  </template>
                  <span>Informação do pedido</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon @click="takePedido(item)"><v-icon>mdi-briefcase-check</v-icon></v-btn>
                  </template>
                  <span>Aceitar o pedido</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                      <v-btn v-on="on" v-if="item.acceptedAt !== '' && item.answeredAt === ''" icon @click="pedidoConcluido(item)"><v-icon>mdi-check</v-icon></v-btn>
                  </template>
                  <span>Resolução do pedido concluida</span>
                </v-tooltip>
              </template>
              <template v-slot:item.estado="{ item }">
                <div v-if="item.acceptedAt !== '' && item.answeredAt === ''">
                  <v-chip class="white--text" color="orange">Em Resolução</v-chip>
                </div>
                <div v-if="item.answeredAt !== ''">
                  <v-chip class="white--text"  color="green">Resolvido</v-chip>
                </div>
                <div v-if="item.acceptedAt === '' && item.answeredAt === ''">
                  <v-chip  class="white--text" color="red">Em Espera...</v-chip>
                </div>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
    </v-container>
  </div>
</template>

<script>
import aux_snackbar from "../../components/aux_snackbar";
import aux_dialog_confirmacao from "../../components/aux_dialog_confirmacao";
export default {
  name: "index",
  data () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      pedidosSuporte:[],
      search:'',
      loading:true,
      loading_text:'',
      headers: [
        {  text: 'Tipo', sortable: true, value: 'tipoPedido'},
        {  text: 'Utilizador', sortable: true, value: 'emailEmissor'},
        {  text: 'Taken by',sortable: true, value: 'responsavelEmissor'},
        {  text: 'Estado',sortable: true, value: 'estado'},
        {  text: 'Ações', sortable: true,value: 'actions'},

      ],
      infoPedido:'',
      dialogInfoPedido:false,
    }
  },
  methods:{
    getPedidosSuporte(){
      this.loading_text = "A organizar pedidos..."
      this.loading = true;
      this.$axios.$get('/api/support_message/all').then((response)=> {
        this.pedidosSuporte = response;
        console.log(response)
        this.loading = false;
      })
    },
    async pedidoConcluido(item) {
      if (await this.$refs.confirm.open(
        "Concluir resolução do pedido de suporte",
        "Tem a certeza que quer concluir a resolução deste pedido de suporte?")
      ) {
        this.$axios.$put('api/support_message/' + item.id + '/answered_at/')
          .then((response) => {
            this.$axios.$post('api/notificacoes/',{
              emissor: this.$auth.user.sub,
              recetor: item.emailEmissor,
              texto: "Pedido de Suporte enviado a "+item.createdAt + " resolvido com sucesso.",
              refProjeto: '',
              refEstrutura:'',
            })
            this.color = "success"
            this.text = "Pedido concluido com sucesso."
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
            this.getPedidosSuporte()
          }).catch((error) => {
          this.color = "error"
          this.text = "Ocorreu um erro."
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
        })
      }


    },
    toDetalhes(item){
      this.infoPedido = item;
      this.dialogInfoPedido = true;
    },
    /*async btnDelete(item) {
      if (await this.$refs.confirm.open(
        "Eliminar pedido de suporte",
        "Tem a certeza que quer eliminar este pedido de suporte?")
      ) {
        this.$axios.$delete('api/support_message/' + item.id + '/accepted_by/' + this.$auth.user.sub)
          .then((response) => {
            this.color = "success"
            this.text = "Pedido aceite com sucesso."
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
            this.getPedidosSuporte()
          }).catch((error) => {
          this.color = "error"
          this.text = "Ocorreu um erro."
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
        })
      }
    },*/
    async takePedido(item) {
      if (await this.$refs.confirm.open(
        "Aceitar pedido de suporte",
        "Tem a certeza que quer aceitar este pedido de suporte?")
      ) {
        this.$axios.$put('api/support_message/' + item.id + '/accepted_by/' + this.$auth.user.sub)
          .then((response) => {
            this.color = "success"
            this.text = "Pedido aceite com sucesso."
            this.snackbar = true;
            setTimeout(() => {
              this.snackbar = false;
            }, 2000);
            this.getPedidosSuporte()
          }).catch((error) => {
          this.color = "error"
          this.text = "Ocorreu um erro."
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar = false;
          }, 2000);
        })
      }
    },
  },
  components:{
    aux_snackbar,
    aux_dialog_confirmacao
  },
  created() {
    this.getPedidosSuporte();
  }
}
</script>

<style scoped>

</style>
