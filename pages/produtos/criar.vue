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
      :vertical="mode === 'vertical'"
    >
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <!--TODO finalizar formulário com todos os dados do projeto -->

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <p class="subtitle-1 text-center">Criar um novo produto</p>
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

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="createProject">
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
  name: "criar",
  data: () =>{
    return{
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
      nome: '',
      nomeRules: [
        v => !!v || 'Name é um campo obrigatório',
        v => (v && v.length <= 30) || 'Nome deve no máximo 30 caracteres',
      ],
      emailCliente: '',
      emailClienteRules: [
        v => !!v || 'Email é um campo obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
    }
  },
  methods:{
    createProject(){
      this.$axios.$post('/api/projetos', {
        nome: this.nome,
        referencia: "PR_"+this.nome,
        emailCliente: this.emailCliente,
        emailProjetista: "projetista1@projetista.com"
      }).then(()=>{
        this.color = 'indigo';
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
