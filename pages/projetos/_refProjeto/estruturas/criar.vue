<template>
  <div>
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'" :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'" :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-btn @click="$router.go(-1)">Voltar</v-btn>

    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <p class="subtitle-1 text-center">Criar Nova Estrutura</p>
        <validation-provider v-slot="{ errors }" name="Nome" rules="required|max:30">
          <v-text-field
            v-model="nome"
            :counter="30"
            :error-messages="errors"
            label="Nome:"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="nVaos" rules="required|numeric">
          <v-text-field
            v-model="nVaos"
            :counter="30"
            :error-messages="errors"
            label="Número de vãos:"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="comprimentoVaos" rules="required|numeric">
          <v-text-field
            v-model="comprimentoVaos"
            :counter="30"
            :error-messages="errors"
            label="Comprimento dos Vãos (metros):"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="Sobrecarga" rules="required|numeric">
          <v-text-field
            v-model="sobrecarga"
            :counter="30"
            :error-messages="errors"
            label="Sobrecarga:"
            required
          ></v-text-field>
        </validation-provider>
        <v-btn :disabled="!valid" color="success" @click="submit" small>
          Submeter
        </v-btn>
        <v-btn color="error" small>
          Cancelar
        </v-btn>
      </form>
    </validation-observer>

  </div>
</template>

<script>

import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  data: () =>{
    return{
      // TODO - Fazer a página de criar estruturas
      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------
      valid:true,
      tiposMaterial:'',
      nome:'',
      nVaos:'',
      comprimentoVaos:'',
      sobrecarga:'',
    }
  },
  methods:{
    submit(){
      if(this.$refs.observer.validate()){
        this.$axios.$post('/api/estruturas/', {
          nome: this.nome,
          referencia: "ES_"+this.nome,

        }).then(()=>{
          this.color = 'green lighten-1';
          this.text = 'Sucesso';
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push('/home');
          }, 3000);

        }).catch(error =>{
          console.log(error)
          this.color = 'red';
          this.text = 'ERRO';
          this.snackbar = true;
        })
      }

    }
  },
  created() {
    this.getTiposMaterial();
  },
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider,
  },
}
</script>

<style scoped>

</style>
