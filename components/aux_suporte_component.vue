<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_criar_pedido_suporte" max-width="800px" @keydown.esc="dialog_criar_pedido_suporte = false">
      <v-card>
        <v-card>
          <v-card-title class="headline">
            Pedido de Suporte
          </v-card-title>
          <v-card-text>
            <form>
              <v-select
                :items="tiposPedidoSuporte"
                label="Tipo de Pedido:"
                v-model="tipoPedido"
              ></v-select>
              <v-textarea
                outlined
                label="Mensagem"
                placeholder="Descreva o problema de forma sucinta"
                counter
                v-model="mensagem"
              ></v-textarea>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="dialog_criar_pedido_suporte = false">
              Cancelar
            </v-btn>
            <v-btn color="success" text  @click="sendPedido">
              Enviar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_detalhes">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            Informação sobre pedido de suporte
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pa-4">
        <p><b>Assunto:</b> {{pedidoDetails.tipoPedido}}</p>
        <p><b>Mensagem:</b> {{pedidoDetails.mensagem}}</p>
        <p><b>Data do Pedido:</b> {{pedidoDetails.createdAt}}</p>
        </v-card-text>
        <v-card-actions class="pt-3">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click="dialog_detalhes = false"
          >Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-toolbar >
        <v-toolbar-title class="d-flex justify-center">Pedido de Suporte</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on">
              <v-btn icon v-bind="attrs" v-on="on" @click="dialog_criar_pedido_suporte = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </template>
          <span>Registar novo pedido de suporte.</span>
        </v-tooltip>
      </v-toolbar>
      <template v-if="pedidosSuporte.length !== 0">
        <v-card-text>
          <v-data-table :headers="headers" :items="pedidosSuporte">
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="toDetalhes(item)">
                <v-icon>mdi-information-outline</v-icon></v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </template>
      <template v-if="pedidosSuporte.length === 0">
        <v-card-text style="margin-top: 15px">
          <p>Não fez nenhum pedido de suporte.</p>
        </v-card-text>
      </template>

    </v-card>
  </div>
</template>

<script>
import aux_snackbar from "./aux_snackbar";
export default {
  name: "aux_suporte_component",
  data () {
    return {
      dialog_criar_pedido_suporte:false,
      dialog_detalhes:false,
      pedidosSuporte:[],
      tiposPedidoSuporte: [],
      pedidoDetails:'',
      tipoPedido:'',
      mensagem:'',
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      headers: [
        {
          text: 'Assunto',
          value: 'tipoPedido',
        },
        {
          text: 'Data de Envio',
          value: 'createdAt',
        },
        { text: 'Ações',sortable: true, value: 'actions'},

      ],
    }
  },
  methods:{
    loadPedidosSuporte(){
      if(this.$auth.user.groups[0] === 'Cliente'){
        this.tiposPedidoSuporte = ['Reportar um erro', 'Outro'];
      }
      if(this.$auth.user.groups[0] === 'Fabricante'){
        this.tiposPedidoSuporte = ['Novo tipo de material', 'Nova familia de material', 'Reportar um erro', 'Outro'];
      }
      if(this.$auth.user.groups[0] === 'Projetista'){
        this.tiposPedidoSuporte = ['Erro em projeto', 'Reportar um erro', 'Outro'];
      }
    },
    toDetalhes(item){
      this.pedidoDetails = item;
      this.dialog_detalhes = true;
    },
    sendPedido(){
      this.$axios.$post('/api/support_message/', {
        mensagem: this.mensagem,
        tipoPedido: this.tipoPedido,
        emailEmissor: this.$auth.user.sub
      }).then((response) => {
        this.text = "Pedido de suporte enviado com sucesso."
        this.color = 'success';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      }).catch(error =>{
        this.text = "Ocorreu um erro ao enviar o pedido de suporte"
        this.color = 'error';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })
    },
    getPedidosSuporte(){
      this.$axios.$get('/api/support_message/send_by/'+this.$auth.user.sub).then((response)=>{
        this.pedidosSuporte = response;
      })
    }
  },
  created() {
    this.loadPedidosSuporte()
    this.getPedidosSuporte()
  },
  components:{
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
