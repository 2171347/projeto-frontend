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
          <v-text-field label="Palavra-Chave antiga" v-model="old_password" type="password"></v-text-field>
          <v-text-field label="Nova Palavra-Chave" :rules="passwordRules"  v-model="new_password" type="password"></v-text-field>
          <v-text-field label="Confirmação da nova Palavra-Chave"  :rules="passwordRules"  v-model="confirmation_password" type="password"></v-text-field>
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
          <v-btn x-small>Editar Perfil</v-btn>
          <v-btn x-small @click.stop="dialog_password = true">Alterar Password</v-btn></v-card-title>
          <v-card-text>
            <p><b>Nome:</b> {{this.user.nome}}</p>
            <p><b>Email:</b> {{this.user.email}}</p>
            {{this.user}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "perfil",
  data: () => {
    return {
      user:'',
      dialog_password: false,
      old_password:'',
      new_password:'',
      confirmation_password:'',

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
        v => (v && v.length >= 4 ) || 'Password deve ter pelo menos 4 digitos.',
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
    updatePassword(){
      if (this.new_password != this.confirmation_password){
        this.snackbar = true;
        this.text = "Palavras-Chave não coincidem."
        this.color = 'red darken-1';
      }

      //TODO enviar pedido ao servidor para ver se a password velha coincide
        // TODO dar mensagem de validação ao utilizador e fechar snackbar
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>

<style scoped>

</style>
