<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Vuetify + Nuxt.js template
        </v-card-title>
        <v-card-text>
          {{this.projetos}}
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'


export default {
  layout: "before_login",
  components: {
    Logo,
    VuetifyLogo
  },
  data:function (){
    return {
      projetos: [],
    }
  },
  methods:{
    getProjetos () {

      this.$axios.$get('/api/projetos/all')
        .then((response) => {
          this.projetos = response;
        })
    },
  },
  created() {
    this.getProjetos()
  }
}
</script>
