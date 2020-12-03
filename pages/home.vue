<template>
  <div>
      <template v-if="this.$auth.user.groups[0] === 'Projetista'">
        <layout_projetista></layout_projetista>
      </template>
      <template v-if="this.$auth.user.groups[0] === 'Cliente'">
        <layout_cliente></layout_cliente>
      </template>
      <template v-if="this.$auth.user.groups[0] === 'Fabricante'">
        <layout_fabricante/>
      </template>
      <template v-if="this.$auth.user.groups[0] === 'Administrador'">
        <layout_administrador/>
      </template>
  </div>
</template>

<script>
import layout_projetista from '../components/home/aux_home_projetista'
import layout_fabricante from '../components/home/aux_home_fabricante'
import layout_cliente from '../components/home/aux_home_cliente'
import layout_administrador from '../components/home/aux_home_administrador'
export default {
  name: "home",
  components:{
    layout_projetista,
    layout_administrador,
    layout_cliente,
    layout_fabricante
  }
}
</script>

<style scoped>

</style>
