<template>
  <div>
    <aux_snackbar :text="text" :snackbar="snackbar" :color="color"/>

    <!--TODO finalizar formulário com todos os dados do produto -->


  </div>
</template>

<script>
import aux_snackbar from "../../components/aux_snackbar";
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

    }
  }
}
</script>
