<template>
  <div>
    <v-btn @click="$router.go(-1)">Voltar</v-btn>
    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-card style="margin-top: 10px">
      <v-card-title>
        Editar Estrutura
      </v-card-title>
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
              <v-text-field
                v-model="estrutura.nome"
                :counter="30"
                :error-messages="errors"
                label="Nome:"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="numeroVaos" rules="required|numeric">
              <v-text-field
                v-model="estrutura.numeroVaos"
                :error-messages="errors"
                label="Número de Vãos:"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="comprimentoVao" rules="required|numeric" >
              <v-text-field
                :error-messages="errors"
                label="Comprimento de Vão:"
                v-model="estrutura.comprimentoVao"
              ></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="sobrecarga" rules="required|numeric">
              <v-text-field
                v-model="estrutura.sobrecarga"
                :error-messages="errors"
                label="NIF:"
                required
              ></v-text-field>
            </validation-provider>
            <v-btn class="mr-4" type="submit" color="success" :disabled="invalid">
              Guardar
            </v-btn>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {ValidationProvider, ValidationObserver} from "vee-validate";

export default {
name: "editar",

  data: () => {
    return {
      //TODO terminar de construir a página
      estrutura:'',
      estrutura_dados_originais:'',
      nome:'',
      numeroVaos:'',
      comprimentoVao:'',
      sobrecarga:'',
      tipoMaterial:'',


      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------
    }
  },
  methods:{
    submit () {
      if(this.$refs.observer.validate()){
        //Validar os campos



        //Enviar os dados para o update do utilizador
        this.$axios.$put('api/estruturas/'+this.$route.params.refEstrutura, {

        })
          .then(() => {
            this.color = 'green';
            this.text = 'O seu registo foi feito com sucesso.';
            this.snackbar = true;

            setTimeout(() => {
              this.$router.go(-1)
            }, 1500);
          })
          .catch(error => {
            this.color = 'error';
            this.text = 'Ocorreu um erro com o seu registo.';
            this.snackbar = true;
          })
      }
    },
    getEstrutura(){
      this.$axios.$get('/api/estruturas/'+this.$route.params.refEstrutura)
        .then((estrutura) => {
          this.estrutura = estrutura;
          this.estrutura_dados_originais = estrutura;
        })
    }

  },
  created() {
    this.getEstrutura()
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}

</script>
<style scoped>
</style>
