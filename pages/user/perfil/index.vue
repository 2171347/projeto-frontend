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
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog_password" max-width="490">
      <v-card>
        <v-card-title class="headline">
          Alterar a Palavra-Chave
        </v-card-title>
        <v-card-text>
          <v-text-field label="Palavra-Chave antiga" :error-messages="error_old" v-model="old_password" type="password"></v-text-field>
          <v-text-field label="Nova Palavra-Chave" :error-messages="error_new" :rules="passwordRules"  v-model="new_password" type="password"></v-text-field>
          <v-text-field label="Confirmação da nova Palavra-Chave" :error-messages="error_confirmation" :rules="passwordRules"  v-model="confirmation_password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog_password = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text  @click="updatePassword">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Dados do Utilizador
          <v-spacer></v-spacer>
          <v-btn x-small to="/user/perfil/editar">Editar Perfil</v-btn>
          <v-btn x-small @click.stop="dialog_password = true">Alterar Password</v-btn></v-card-title>
          <v-card-text>
            <p><b>Nome:</b> {{this.user.nome}}</p>
            <p><b>Email:</b> {{this.user.email}}</p>
            <p><b>Morada:</b> {{this.user.morada}}</p>
            <p><b>NIF:</b> {{this.user.numContribuinte}}</p>
            <p><b>Telefone/Telemóvel:</b> {{this.user.contactoTelefonico}}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "perfil",
  middleware: 'authenticated',
  data: () => {
    return {
      user:'',
      // Dados para editar password:
      dialog_password: false,
      old_password:'',
      new_password:'',
      confirmation_password:'',
      error_old:'',
      error_new:'',
      error_confirmation:'',


      // ---- SNACKBAR INFO -----
      color: '',
      mode: '',
      snackbar: false,
      text: '',
      timeout: 4000,
      x: null,
      y: 'top',
      // ------------------------

      passwordRules:[
        v => !!v || 'Password é um campo obrigatório',
      ],

    }
  },
  methods:{
    getUser(){
      if (this.$auth.user.groups.includes('Cliente')){
        this.$axios.$get('/api/clientes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
        })
      }
      if (this.$auth.user.groups.includes('Projetista')){
        this.$axios.$get('/api/projetistas/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
        })
      }
      if (this.$auth.user.groups.includes('Fabricante')){
        this.$axios.$get('/api/fabricantes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
        })
      }
      if (this.$auth.user.groups.includes('Administrador')){
        this.$axios.$get('/api/administradores/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
        })
      }
    },
    cleanFields(){
      this.new_password = '';
      this.old_password = '';
      this.confirmation_password = '';
    },
    updatePassword(){

      // Verificar se a nova password é igual à confirmação
      if(this.new_password !== this.confirmation_password){
        this.error_new = "Nova palavra-chave deve coincidir com a confirmação."
      }else{
        this.error_new = '';
      }

      // Verificar se a password velha é igual à do perfil do utilizador
      this.$axios.$post('/api/users/'+this.user.email+'/confirm_password',{
        password : this.old_password
      }).then((response) => {
        this.$axios.$put('/api/users/'+this.user.email+'/change_password', {
          password : this.new_password
        }).then((response) => {
          this.snackbar = true;
          this.text = "Palavra-Chave alterada com sucesso."
          this.color = 'success';

          this.cleanFields();
          this.dialog_password = false;

        }).catch(error =>{
          this.snackbar = true;
          this.text = "Ocorreu um erro.Por favor tente novamente mais tarde.."
          this.color = 'error';
        })
      }).catch(error =>{
        this.error_old = "A palavra-chave introduzida não coincide com a palavra-chave atual."
        console.log(error)
      })
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<style scoped>

</style>
