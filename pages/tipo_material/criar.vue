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
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <p class="subtitle-1 text-center">Criar um novo projeto</p>
      <v-text-field
        v-model="nome"
        :counter="30"
        :rules="nomeRules"
        label="Nome"
        required
      ></v-text-field>
      <v-text-field
        v-model="emailCliente"
        :counter="30"
        :rules="emailClienteRules"
        label="Email do cliente"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" class="mr-4" color="success" @click="createProject">
        Submeter
      </v-btn>

      <v-btn color="error" class="mr-4">
        Reset Formulário
      </v-btn>

      <v-btn color="warning" class="mr-4">
        Reset Validação
      </v-btn>
      <v-btn color="error" class="mr-4">
        Cancelar
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
name: "criar"
}
</script>

<style scoped>

</style>
