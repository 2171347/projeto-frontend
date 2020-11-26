<template>
  <div>
    <v-toolbar class="d-flex justify-center">
      <v-toolbar-title>Painel Geral do {{this.$auth.user.groups[0]}}</v-toolbar-title>
    </v-toolbar>
      <v-row>
        <v-col>
          <v-card>


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
export default {
name: "aux_home_projetista",
  data () {
    return {
      notificacoes:'',
    }
  },
  methods:{
    atualizarStore(){
      if(this.$store.state.firstLogin){
        this.$store.commit("setUser")
      }
    },

  },
  components:{
    vcard_notificacoes_homepage
  }
}
</script>

<style scoped>

</style>
