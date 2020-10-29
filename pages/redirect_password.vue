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
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="headline" style="justify-content: center">
            Recuperar a palavra-chave
          </v-card-title>
          <v-card-text style="justify-content: center; max-width: 900px; margin: auto ">
            <p class="text-center">Para recuperar a sua palavra-chave insira o email que utilizou para registo da sua conta na caixa de texto abaixo.
              De seguida receberá um email com as instruções para criar uma nova palavra-chave.</p>
            <div class="text-center" style="margin: auto">
            <v-text-field
              label="Email"
              prepend-icon='mdi-at'
              type="email"
              v-model="email"
            ></v-text-field>
            <v-btn @click="submeter"> Submeter</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  layout: "before_login",
  data:function () {
    return {
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
    submeter(){
      // Verificar se o email existe na BD
      this.$axios.$get('/api/clien/'+this.$route.params.referencia).then((projeto) => {
        this.projeto = projeto;
        this.estruturas = projeto.estruturas;
      })

      this.text = "Email enviado com sucesso."
      this.snackbar = true;

    }
  }
}

</script>
