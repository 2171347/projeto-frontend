<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
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
import aux_snackbar from "../../../components/aux_snackbar";
export default {
  layout:'empty' ,
  components:{
    aux_snackbar
  },
  data: function () {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
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
          this.snackbar= false;
        }, 2000);
        setTimeout(() => {
          this.$router.push('/');
        }, 2200);
      }).catch(error =>{
        this.color="error"
        this.text = "Ocorreu um erro. Por favor tente novamente."
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
