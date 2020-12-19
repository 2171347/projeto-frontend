<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>
    <aux_dialog_confirmacao ref="confirm"/>
    <v-container v-if="loading" fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
      <v-layout column justify-center align-center fill-height>
        <v-progress-circular indeterminate color="loading" :size="70" :width="7" style="margin-right: 10px">
        </v-progress-circular>
        A convocar utilizadores
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-card>
        <v-toolbar>
          <v-text-field
            v-model="search"
            label="Pesquisa"
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="shrink"
            style="margin-left: 15px"
          ></v-text-field>
        </v-toolbar>
        <v-card-text>
          <v-data-table :items="users"  :headers="cabecalhos" :search="search">
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>

  </div>
</template>

<script>
import aux_dialog_confirmacao from "../../components/aux_dialog_confirmacao";
import aux_snackbar from "../../components/aux_snackbar";
export default {
  name: "index",
  data: () => {
    return {
      // ---- SNACKBAR INFO -----
      color: '',
      snackbar: false,
      text: '',
      // ------------------------
      loading:true,
      loading_text:'',
      users:'',
      search:'',
      cabecalhos:[
        {  text: 'Nome ', value: 'nome',},
      ],

    }
  },
  methods:{
    getUsers(){
      this.$axios.get('/api/users/all').then((response)=>{
        this.users = response.data;
        this.loading = false;
      })
    },

  },
  created() {
    this.getUsers();

  },
  components: {
    aux_dialog_confirmacao,
    aux_snackbar
  }
}
</script>

<style scoped>

</style>
