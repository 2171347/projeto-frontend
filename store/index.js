
import axios from '@nuxtjs/axios'
export const state = () =>({
  user: '',
  firstLogin: false,
  emailUser:'',
  emailNoReply: 'noreply@projeto.com'
})

export const  mutations = {

  getUser: async state => {
    const ip = await axios.get('/api/projetistas/' + this.$store.state.emailUser)
    state.user = ip;
  },
  setEmailUser: (state, email) => {
      state.emailUser = email;
  },
  setUser: state => {
      state.user = utilizador;

    /*if (this.$store.state.auth.user.groups.includes('Projetista')) {
      this.$axios.$get('/api/projetistas/' + this.$store.state.auth.user.sub).then((utilizador) => {
        state.user = utilizador;
      })
    }
    if (this.$store.state.auth.user.groups.includes('Fabricante')) {
      this.$axios.$get('/api/fabricantes/' + this.$store.state.auth.user.sub).then((utilizador) => {
        state.user = utilizador;
      })
    }
    if (this.$auth.user.groups.includes('Administrador')) {
      this.$axios.$get('/api/administradores/' + this.$auth.user.sub).then((utilizador) => {
        state.user = utilizador;
      })
    }*/
  },
  setFirstLogin: state => {
    state.firstLogin = true
  },
  setNotificacoes: (state, lista) => {
    state.notificacoes = lista
  },
  setNumNotificacoes: (state, numero) => {
    state.num_notificacoes = numero
  },

}


