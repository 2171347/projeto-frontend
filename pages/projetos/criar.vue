<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-form ref="form" v-model="valid" lazy-validation>
      <p class="subtitle-1 text-center">Criar um novo projeto</p>
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
      <v-btn color="error" class="mr-4"  >
        Cancelar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import aux_snackbar from "../../components/aux_snackbar";
export default {
name: "novo",
  components:{
    aux_snackbar
  },
  data: () =>{
    return{
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
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
      // Verificar se o email do cliente existe na BD:
      this.$axios.get('/api/users/'+this.email).then((response) => {
        if (response.data.value !== true) {
          this.text = "O email inserido não corresponde a nenhum cliente registado."
          this.snackbar = true;
          this.color = "error"
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          return null;
        }
      })
      // Verificar se o email do cliente corresponde a um cliente:

      this.$axios.$get('/api/clientes/'+this.emailCliente+'/iscliente').then((response) => {
        if(response.value !== true){
          this.text = "O email inserido não corresponde a um email de um cliente. Por favor tente novamente."
          this.color = "error"
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
          return null;
        }
      })

      // Criar o novo projeto:
      this.$axios.$post('/api/projetos', {
        nome: this.nome,
        referencia: "PR_"+this.nome,
        emailCliente: this.emailCliente,
        emailProjetista: this.$auth.user.sub
      }).then(()=>{
        this.color = 'green lighten-1';
        this.text = 'Projeto criado com sucesso.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
        setTimeout(() => {
          this.$router.push('/home');
        }, 1500);
      }).catch(error =>{
        console.log(error)
        this.color = 'red';
        this.text = 'Ocorreu um erro na criação no projeto. Tente novamente.';
        this.snackbar = true;
        setTimeout(() => {
          this.snackbar= false;
        }, 2000);
      })
    }
  }
}
</script>

<style scoped>

</style>
