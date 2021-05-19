import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'

import VueMaterial from 'vue-material'

import 'vue-material/dist/vue-material.min.css'
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2',
    getDefaultEventDetails() {
      return {
        title: 'Inventory',
        description: '',
        location: '',
        color: this.getDefaultEventColor(),
        forecolor: '#ffffff',
        calendar: '',
        busy: true,
        icon: ''
      }
    }
  },
  data: {
    supports: {
      location: false,
      calendar: false,
      icon: false,
      guests: true,
      description: true,
      busy: true
    },
    features: {
      move: false,
      moveDuplicate: false,
      moveInstance: false,
      moveAll: false,
      forecast: false,
      hideOnMove: false
    }
  }
})

Vue.use(VueMaterial)

// Currently Material Design Vue-Select has a known but when selecting invput value
// https://github.com/vuematerial/vue-material/issues/2285
// This patch suppresses the reporting of this error
Vue.config.errorHandler = (err, vm, info) => {
  if (process.env.NODE_ENV !== 'production') {
    // Show any error but this one
    if (err.message !== "Cannot read property 'badInput' of undefined") {
      console.error(err)
    }
  }
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
