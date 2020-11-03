<template>
  <div>
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
        Fechar
      </v-btn>
    </v-snackbar>

    <v-btn @click="$router.go(-1)">Voltar</v-btn>

    <v-form ref="form" v-model="valid" lazy-validation>
      <p class="subtitle-1 text-center">Criar Nova Estrutura</p>
      <v-text-field
        v-model="nome"
        :counter="30"
        :rules="nomeRules"
        label="Nome"
        required
      ></v-text-field>
      <v-text-field
        v-model="emailCliente"
        :counter="30"
        :rules="emailClienteRules"
        label="Email do cliente"
        required
      ></v-text-field>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="createEstrutura">
        Submeter
      </v-btn>
      <v-btn color="error" class="mr-4">
        Reset Formulário
      </v-btn>
      <v-btn color="warning" class="mr-4">
        Reset Validação
      </v-btn>
      <v-btn color="error" class="mr-4">
        Cancelar
      </v-btn>
    </v-form>
  </div>
</template>

<script>

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
    }
  },
  methods:{
    createEstrutura(){
      this.$axios.$post('/api/estruturas', {
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
}
</script>

<style scoped>

</style>
