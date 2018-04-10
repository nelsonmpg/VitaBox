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
var app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  },
  mounted() {
  },
  beforeCreate() {
  },
  sockets: {
    connect: (val) => {
      if (val) {
        console.log('socket connected -> val: ', val)
      } else {
        console.log('socket connected')
      }
    },
    hdmistatus: function(data) {
      console.log('Receive hdmistatus', data)
    },
    cmd: function(cmd) {
      switch (cmd) {
        case 'up':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', -1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              console.log("Not sidebar")
              EventBus.$emit('move-components', 'up')
            }
          }
          break;
        case 'down':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', 1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              console.log("Not sidebar")
              EventBus.$emit('move-components', 'down')
            }
          }
          break;
        case 'right':
          EventBus.currentComponent = EventBus.correntRightComponent
          EventBus.$emit('move-components', cmd)
          break;
        case 'left':
          if (EventBus.currentActiveRightComp === 0) {
            EventBus.currentComponent = EventBus.sidebarName
            if (!EventBus.firstRightEvent) {
              EventBus.$emit('move-components', cmd)
            }
          } else {
            EventBus.$emit('move-components', cmd)
          }
          break;
        case 'ok_btn':
        case 'exit':
          if (EventBus.currentComponent !== EventBus.sidebarName) {
            EventBus.$emit('move-components', cmd)
          }
          break;
        default:
          console.log("No event key")
          break;
      }
    }
  }
})

// var self = this;
window.addEventListener('keypress', function(e) {
  e = e || window.event;
  var charCode = e.keyCode || e.which;
  // console.log("Key:", charCode);
  var sendCmd = "";
  if (charCode === 119) { // 'w'
    sendCmd = '1';
  } else if (charCode === 115) { // 's'
    sendCmd = '2';
  } else if (charCode === 97) { // 'a'
    sendCmd = '3';
  } else if (charCode === 100) { // 'd'
    sendCmd = '4';
  } else if (charCode === 122) { // 'z'
    sendCmd = '0';
  } else if (charCode === 120) { // 'x'
    sendCmd = 'd';
  }
  if (sendCmd !== "") {
    app.$socket.emit('keypress', sendCmd);
    sendCmd = "";
  }
});
