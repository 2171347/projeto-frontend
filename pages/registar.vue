<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <p class="subtitle-1 text-center">Registo de novo utilizador</p>
    <v-text-field
      v-model="nome"
      :counter="30"
      :rules="nomeRules"
      label="Nome"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
<!-- TODO Completar formulário de registo de utilizador   -->
    <v-text-field
      v-model="morada"
      :rules="moradaRules"
      label="Morada"
      :counter="80"
      required
    ></v-text-field>
    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >Submeter </v-btn>

    <v-btn color="error" class="mr-4" @click="reset">
      Reset Formulário
    </v-btn>
    <v-btn color="warning" class="mr-4" @click="resetValidation">
      Reset Validação
    </v-btn>
    <v-btn color="error" class="mr-4" @click="cancel">
      Cancelar
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: "registar",
  layout:"before",
  data: () => ({
    valid: true,


    // ---- SNACKBAR INFO -----
    color: '',
    mode: '',
    snackbar: false,
    text: '',
    timeout: 4000,
    x: null,
    y: 'top',
    // ------------------------

    // TODO Fazer verificação dos valores de entrada para registo de utilizadores

    morada: '',
    moradaRules:[
      v => !!v || 'Morada é um campo obrigatório',
      v => (v && v.length <= 80 ) || 'Morada deve ter menos de 80 caracteres.',],

    nome: '',
    nomeRules: [
      v => !!v || 'Name é um campo obrigatório',
      v => (v && v.length <= 30) || 'Nome deve ter até 30 caracteres',
    ],

    email: '',
    emailRules: [
      v => !!v || 'Email é um campo obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    ],

  }),

  methods: {

    validate () {
      if (this.$refs.form.validate()) {
        this.$axios.$post('/api/inscricoes', {
          nome: this.nome,
          email: this.email,

        })
          .then(() => {
            this.color = 'green';
            this.text = 'Inscrição submetida com sucesso! A sua inscrição ficará a aguardar aceitação. ' +
              'Receberá novas informações no seu email.';
            this.snackbar = true;
            setTimeout(() => {
              this.$router.push('/');
            }, 5000);

          })
          .catch(error => {
            console.log(error)
          })
      }

    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    cancel(){
      this.$router.push('/')

    }
  },
  created() {
  },

  }
</script>

<style scoped>

</style>
