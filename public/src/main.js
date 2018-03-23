import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'
import resource from 'vue-resource'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import VModal from './components/UIComponents/Modal'
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import App from './App'

// router setup
import routes from './routes/routes'

// library imports
import Chartist from 'chartist'
import { EventBus } from './event-bus.js';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)
Vue.use(VModal, { dialog: true })
Vue.use(VueFormWizard)
Vue.use(resource)
Vue.use(VueSocketio, location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''))

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get() {
    return this.$root.Chartist
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  },
  mounted() {
    this.$socket.on('hdmistatus', (data) => {
      console.log('Receive hdmistatus', data)
    })
  },
  sockets: {
    connect: (val) => {
      if (val) {
        console.log('socket connected -> val: ', val)
      } else {
        console.log('socket connected')
      }
    },
    cmd: function(cmd){
      EventBus.$emit('cmd', cmd);
    }
  }
})
