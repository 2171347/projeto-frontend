
export const state = () =>({
  emailNoReply: 'noreply@projeto.com',
  notificacoes:'',
  num_notificacoes:'',
})

export const  mutations = {

  setNotificacoes: (state, lista) => {
    state.notificacoes = lista
  },
  setNumNotificacoes: (state, numero) => {
    state.num_notificacoes = numero
  },

}


