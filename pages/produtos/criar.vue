<template>
  <div>
    <aux_snackbar v-bind:snackbar="snackbar" v-bind:text="text" v-bind:color="color"></aux_snackbar>

    <!--TODO finalizar formulário com todos os dados do produto -->


  </div>
</template>

<script>
export default {
  name: "criar",
  data: () =>{
    return{
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',

      // ------------------------
      valid:true,
    }
  },
  methods:{
    submit(){
      this.$axios.$post('/api/variantes', {
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
