<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <v-dialog v-model="dialog_password" max-width="490">
      <v-card>
        <v-card-title class="headline">
          Alterar a Palavra-Chave
        </v-card-title>
        <v-card-text>
          <form>
          <v-text-field label="Palavra-Chave antiga" :error-messages="error_old" v-model="old_password" type="password"></v-text-field>
          <v-text-field label="Nova Palavra-Chave" :error-messages="error_new" :rules="passwordRules"  v-model="new_password" type="password"></v-text-field>
          <v-text-field label="Confirmação da nova Palavra-Chave" :error-messages="error_confirmation" :rules="passwordRules"  v-model="confirmation_password" type="password"></v-text-field>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog_password = false">
            Cancelar
          </v-btn>
          <v-btn color="success" text  @click="updatePassword">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar>
      <v-btn @click="$router.go(-1)">Voltar</v-btn>
      <v-breadcrumbs :items="caminhos">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-toolbar>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>Dados do Utilizador
          <v-spacer></v-spacer>
          <v-btn x-small to="/user/perfil/editar">Editar Perfil</v-btn>
          <v-btn x-small @click.stop="dialog_password = true">Alterar Password</v-btn></v-card-title>
          <v-card-text>
            <p><b>Nome:</b> {{this.user.nome}}</p>
            <p><b>Email:</b> {{this.user.email}}</p>
            <p><b>Rua:</b> {{this.rua}}</p>
            <p><b>Código Postal:</b> {{this.codigoPostal}}</p>
            <p><b>Localidade:</b> {{this.localidade}}</p>
            <p><b>NIF:</b> {{this.user.numContribuinte}}</p>
            <p><b>Telefone/Telemóvel:</b> {{this.user.contactoTelefonico}}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import aux_snackbar from "../../../components/aux_snackbar";
export default {
  name: "perfil",
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
      auxiliarMorada:'',
      rua:'',
      localidade:'',
      codigoPostal:'',
      caminhos: [
        {
          text: 'Home',
          disabled: false,
          href: '/home',
        },
        {
          text:'Perfil',
          disabled: true,
          href: '/perfil',
        },
      ],


      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
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
          this.splitMorada();
        })
      }
      if (this.$auth.user.groups.includes('Fabricante')){
        this.$axios.$get('/api/fabricantes/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.splitMorada();
        })
      }
      if (this.$auth.user.groups.includes('Administrador')){
        this.$axios.$get('/api/administradores/'+this.$auth.user.sub).then((utilizador) => {
          this.user = utilizador;
          this.splitMorada();
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
          this.text = "Palavra-Chave alterada com sucesso."
          this.color = 'success';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);

          this.cleanFields();
          this.dialog_password = false;

        }).catch(error =>{
          this.text = "Ocorreu um erro.Por favor tente novamente mais tarde.."
          this.color = 'error';
          this.snackbar = true;
          setTimeout(() => {
            this.snackbar= false;
          }, 2000);
        })
      }).catch(error =>{
        this.error_old = "A palavra-chave introduzida não coincide com a palavra-chave atual."
      })
    },
    splitMorada(){
      this.auxiliarMorada = this.user.morada.split('|');
      this.rua = this.auxiliarMorada[0];
      this.codigoPostal = this.auxiliarMorada[1];
      this.localidade = this.auxiliarMorada[2];
    },
  },
  mounted() {
    this.getUser()
  },
  components:{
    aux_snackbar
  },



}
</script>

<style scoped>

</style>
