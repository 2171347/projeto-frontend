<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-row justify="center" align="center" style="background-color: #ffffff" >
      <v-col md="12" class="d-flex justify-center align-center" >
        <logo_projeto  class="d-flex justify-center align-center" style="width: 50vw"/>
      </v-col>
    </v-row>
      <v-col md="12" class="d-flex justify-center align-center" >
        <div class="text-h2 font-weight-light"><p>O melhor de 3 mundos</p></div>
      </v-col>
    <v-row justify="center" align="center">
      <v-col md="12" class="d-flex justify-center align-center" >
        <div id="h2"><p>A plataforma nº 1 para a construção do seu projeto</p></div>
      </v-col>
    </v-row>
    <v-row>
      <v-divider style="margin-bottom: 20px"></v-divider>
    </v-row>
    <v-row>
      <v-col>
        <v-card height="500px">
          <v-card-title class="headline" style="justify-content: center">
            Clientes
          </v-card-title>
          <v-card-text style="justify-content: center">
            <photo_client class="d-block" style="margin: auto"/>
            <p class="text-justify" style="margin-top: 10px; margin-left: 20px; margin-right: 20px">
              Os clientes têm acesso a todas as partes do processo de decisão do seu projeto! Ver sugestões de estruturas, fazer modificações, dar opiniões, tudo à distância de um click!
            </p>
          </v-card-text>
          <v-card-actions>
          </v-card-actions>
        </v-card>
      </v-col><v-col>
      <v-card height="500px">
        <v-card-title class="headline" style="justify-content: center">
          Projetistas
        </v-card-title>
        <v-card-text>
          <photo_projetista class="d-block" style="margin: auto"/>
          <p class="text-justify" style="margin-top: 10px; margin-left: 20px; margin-right: 20px">
            Os projetistas têm uma plataforma onde podem organizar todos os projetos que têm em desenvolvimento. O Projeto + permite também o acesso a uma base de dados onde podem encontrar uma enorme variedade de produtos, de fabricantes reais, que facilita o processo de decisão.
          </p>
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-col><v-col>
      <v-card height="500px">
        <v-card-title class="headline" style="justify-content: center">
          Fabricantes
        </v-card-title>
        <v-card-text>
          <photo_fabricante class="d-block" style="margin: auto"/>
          <p class="text-justify" style="margin-top: 10px; margin-left: 20px; margin-right: 20px">
            Os fabricantes podem dar a conhecer os seus materiais. Sempre que um  produto seja escolhido para um projeto aprovado, o fabricante é notificado e pode começar a preparar a sua encomenda!
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col md="12">
        <v-card>
          <v-row align="center" justify="center">
            <v-col class="d-flex align-center justify-center">
              <photo_computer style="max-width: 80vw" class="d-flex align-center justify-center"/>
            </v-col>
            <v-col>
              <div class="d-flex align-center justify-center">
                <p id="h_help">Precisa de ajuda?</p></div>
                <div class="d-flex align-center justify-center">
                  Preencha o formulário a baixo e fale connosco.</div>
              <div class="d-flex align-center justify-center" style="margin-top: 20px">
                <v-btn style="margin: auto" @click="formContacto = true">Formulário</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="formContacto">
      <v-divider style="margin-bottom: 20px; margin-top: 20px"></v-divider>
    </v-row>
    <v-row v-if="formContacto" align="center" justify="center">
      <v-col md="8" >
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Formulário de Contacto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon  @click="formContacto = false" >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form @submit.prevent="submit">
                  <validation-provider v-slot="{ errors }" name="Name" rules="alpha_spaces|required">
                    <v-text-field
                      v-model="nome"
                      :error-messages="errors"
                      label="Nome"
                      required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Email" rules="email|required">
                    <v-text-field
                      v-model="email"
                      :error-messages="errors"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Assunto" rules="required">
                    <v-text-field
                      v-model="assunto"
                      :error-messages="errors"
                      label="Assunto"
                      required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Mensagem" rules="required">
                    <v-textarea
                      v-model="texto"
                      :error-messages="errors"
                      label="Mensagem"
                      required
                      outlined
                    ></v-textarea>
                  </validation-provider>
                  <v-btn
                    color="grey"
                    text
                    class="body-2 font-weight-bold"
                    @click="formContacto = false"
                  >Cancelar</v-btn>
                  <v-btn
                    color="success"
                    class="body-2 font-weight-bold"
                    outlined
                    @click="sendEmail"
                    :disabled="invalid"
                  >Enviar</v-btn>
                </v-form>
              </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import aux_snackbar from "../components/aux_snackbar";

import VuetifyLogo from '../components/photos/logo_projeto.vue';
import Photo_client from "../components/photos/photo_client";
import Photo_projetista from "../components/photos/photo_projetista";
import Photo_fabricante from "../components/photos/photo_fabricante";
import Logo_projeto from "../components/photos/logo_projeto";
import Photo_computer from "../components/photos/photo_computer"


export default {
  layout: "before",
  components: {
    Logo_projeto,
    Photo_fabricante,
    Photo_projetista,
    Photo_client,
    VuetifyLogo,
    Photo_computer,
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
    aux_snackbar
  },
  data:function (){
    return {
      formContacto: false,
      email:'',
      nome:'',
      assunto:'',
      texto:'',
      date:'',
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
    }
  },
  methods:{
    sendEmail(){
      this.date = new Date();
      this.$axios.post('/api/emails/'+this.$store.state.emailNoReply+'/sendto/'+this.email,{
        subject: this.assunto,
        message: '[Formulário de Contacto] \n [Data]:' + this.date + '\n [Mensagem]: ' + this.texto
      }).then((response) => {
        this.color = 'success';
        this.text = 'Email enviado com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar = false;
        }, 2000);
      }).catch(error =>{
        this.color = 'error';
        this.text = 'Ocorreu um erro ao enviar o email.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar = false;
        }, 2000);
      })
    }
  },
  created() {
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');

#h2{
  font-family: "Montserrat";
  font-size: 20px;
}
#h_help{
  font-family: 'Dosis', sans-serif;
  font-size: 40px;
}
</style>
