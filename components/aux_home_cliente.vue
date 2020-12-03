<template>
  <div>
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
      <v-row>
        <v-col>
          <v-card>
            <v-btn @click="teste">Teste</v-btn>
            <aux_dialog_confirmacao ref="confirm"/>

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
export default {
name: "aux_home_projetista",
  data () {
    return {
      notificacoes:'',
    }
  },
  methods:{
    async teste(){
      if (await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete this record?"
        )
      ) {
        console.log("Aceitou")
      }
    },


  },
  components:{
    vcard_notificacoes_homepage,
    aux_dialog_confirmacao
  }
}
</script>

<style scoped>

</style>
