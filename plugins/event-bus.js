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
  }
}

Vue.use(EventBus)

