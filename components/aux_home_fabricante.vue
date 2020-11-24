<template>
  <v-card>
    <v-card-title style="justify-content: center">Painel Geral do {{this.$auth.user.groups[0]}}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card>


          </v-card>
        </v-col>
        <v-col md="3">
          <vcard_notificacoes_homepage/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import vcard_notificacoes_homepage from "@/components/vcard_notificacoes_homepage";

export default {
name: "aux_home_projetista",
  components:{
    vcard_notificacoes_homepage
  }
}
</script>

<style scoped>

</style>
