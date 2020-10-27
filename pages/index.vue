<template>
  <div style="justify-content: center">
    <v-row justify="center" align="center">
      <v-col>
        <div class="text-center" >
          <vuetify-logo/>
          <div class="text-h2 font-weight-light">O melhor de 3 mundos</div>
          <div id="h2">A plataforma nº 1 para a construção do seu projeto</div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="headline" style="justify-content: center">
            Clientes
          </v-card-title>
          <v-card-text style="justify-content: center">
            <photo_client class="d-block" style="margin: auto"/>
            <p class="text-center" style="margin-top: 10px;">
            Aqui os clientes têm acesso a todas as partes do processo de decisão do seu projeto! Ver sugestões de estruturas, fazer modificações, dar opiniões, tudo à distância de um click!
            </p>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
        </v-card>
      </v-col><v-col>
        <v-card>
          <v-card-title class="headline" style="justify-content: center">
            Projetistas
          </v-card-title>
          <v-card-text>
            <photo_projetista class="d-block" style="margin: auto"/>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
        </v-card>
      </v-col><v-col>
        <v-card>
          <v-card-title class="headline" style="justify-content: center">
            Fabricantes
          </v-card-title>
          <v-card-text>
            <photo_fabricante class="d-block" style="margin: auto"/>
          </v-card-text>
          <v-card-actions>

          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '@/components/logo_projeto.vue'
import Photo_client from "@/components/photo_client";
import Photo_projetista from "@/components/photo_projetista";
import Photo_fabricante from "@/components/photo_fabricante";


export default {
  layout: "before_login",
  components: {
    Photo_fabricante,
    Photo_projetista,
    Photo_client,
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
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');

#h2{
  font-family: "Montserrat";
  font-size: 20px;
}
</style>
