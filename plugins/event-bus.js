import Vue from 'vue'

const EventBus = {
  install (Vue, options) {
    const VueEventBus = new Vue();

    Vue.prototype.$globalOn = function (event, handler) {
      VueEventBus.$on(event, handler)
    }

    Vue.prototype.$globalEmit = function (event, ...args) {
      VueEventBus.$emit(event, ...args)
    }

    Vue.prototype.$storeGetNotificacoes = function (){
      this.$axios.get('/api/notificacoes/' + this.$store.state.emailUser).then((notificacoes) => {
        this.$store.commit("setNotificacoes",notificacoes.data);
        this.$store.commit("setNumNotificacoes",notificacoes.data.length);
      })
    }
  }
}

Vue.use(EventBus)

