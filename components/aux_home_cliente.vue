<template>
  <div>
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
      <v-row>
        <v-col>
          <v-card>
            <v-btn @click="teste">Teste</v-btn>
              <aux_snackbar :text="text" :color="color" :snackbar="snackbar"/>

          </v-card>
        </v-col>
        <v-col md="3">
         <vcard_notificacoes_homepage/>
        </v-col>
      </v-row>
  </div>
</template>

<script>
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";
import aux_dialog_confirmacao from "./aux_dialog_confirmacao";
import aux_snackbar from "./aux_snackbar";
export default {
name: "aux_home_projetista",
  data () {
    return {
      notificacoes:'',
      text:'',
      snackbar:'',
      color:'',
    }
  },
  methods:{
    teste(){
      this.text="Olá";
      this.color="red";
      this.snackbar = true;
      setTimeout(() => {
        this.snackbar= false;
      }, 200);

    },


  },
  components:{
    vcard_notificacoes_homepage,
    aux_dialog_confirmacao,
    aux_snackbar
  },
}
</script>

<style scoped>

</style>
