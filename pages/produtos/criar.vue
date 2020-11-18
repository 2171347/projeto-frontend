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
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

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
