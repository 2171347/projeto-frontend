<template>
<!--TODO implementar esta funcionalidade.-->
<!--  <div style="background-color: #59595b">
    <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'"
                :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'"
                :vertical="mode === 'vertical'">
      {{ text }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-row>
      <v-card>
        <v-card-title>
          Repor a palavra-chave
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nova Palavra-Chave" :error-messages="error_new" :rules="passwordRules"
                        v-model="new_password" type="password"></v-text-field>
          <v-text-field label="Confirmação da nova Palavra-Chave" :error-messages="error_confirmation"
                        :rules="passwordRules" v-model="confirmation_password" type="password"></v-text-field>
        </v-card-text>
        <v-btn color="success" text @click="updatePassword">
          Guardar
        </v-btn>
      </v-card>
    </v-row>
  </div>-->
  <div>
  <v-snackbar v-model="snackbar" :bottom="y === 'bottom'" :color="color" :left="x === 'left'"
              :multi-line="mode === 'multi-line'" :timeout="timeout" :top="y === 'top'"
              :vertical="mode === 'vertical'">
    {{ text }}
    <v-btn dark text @click="snackbar = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
  <v-row align="center" justify="center">
    <v-col cols="4">
      <v-card >
        <v-card-title>
          Repor a palavra-chave
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nova Palavra-Chave" :error-messages="error_new" :rules="passwordRules"
                        v-model="new_password" type="password"></v-text-field>
          <v-text-field label="Confirmação da nova Palavra-Chave" :error-messages="error_confirmation"
                        :rules="passwordRules" v-model="confirmation_password" type="password"></v-text-field>
        </v-card-text>
        <v-btn color="success" text @click="updatePassword">
          Guardar
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  layout:'empty' ,
  data: function () {
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
      new_password:'',
      confirmation_password:'',
      passwordRules:[
        v => !!v || 'Password é um campo obrigatório',
      ],
      error_new:'',
      error_confirmation:'',
    }
  },
  methods:{
    updatePassword() {
      if (this.new_password !== this.confirmation_password) {
        this.error_new = "Nova palavra-chave deve coincidir com a confirmação."
      } else {
        this.error_new = '';
      }

      this.$axios.put('/api/users/' + this.$route.params.token, {
        password: this.new_password
      }).then((response) => {
        this.color="success"
        this.text = "Palavra-chave alterada com sucesso."
        this.snackbar = true;
        setTimeout(() => {
          this.$router.push('/');
        }, 2200);
      }).catch(error =>{
        this.color="error"
        this.text = "Ocorreu um erro. Por favor tente novamente."
        this.snackbar = false;
      })
    }
  }
}

</script>

<style scoped>

</style>
