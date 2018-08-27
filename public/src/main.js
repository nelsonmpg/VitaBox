import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'
import i18n from './lang/lang'
import store from './store'
import resource from 'vue-resource'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import fontawesome from '@fortawesome/fontawesome'
import faFreeRegular from '@fortawesome/fontawesome-free-regular'
import faFreeSolid from '@fortawesome/fontawesome-free-solid'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import VModal from './components/UIComponents/Modal'
import VMarqueeMsg from 'components/UIComponents/Forms'
import ToggleButton from 'vue-js-toggle-button'
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
Vue.use(Tooltip)
Vue.use(VMarqueeMsg)
Vue.use(ToggleButton)
Vue.use(resource)
Vue.use(VueSocketio, location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''))

fontawesome.library.add(faFreeSolid)
fontawesome.library.add(faFreeRegular)
fontawesome.dom.i2svg()

// configure router
var router = new VueRouter({
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
export const app = new Vue({
  el: '#app',
  store,
  i18n,
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist,
    interval: null,
    show: false,
    settings: false,
    timeout: null
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
    ttsPath(path) {
      var self = this
      if (document.getElementById('audioElem')) {
        document.getElementById('audioElem').remove()
      }
      if (this.show) {
        EventBus.audioBasicMode('./static/.temp/' + path, () => {
          self.$modal.hide('alert')
          self.timeout = setTimeout(() => {
            self.$modal.show('alert', '')
            self.$socket.emit('ttsText', self.$t('dictionary.warnings.warning'))
          }, 5000)
        })
      } else {
        EventBus.audioBasicMode('./static/.temp/' + path, null)
      }
    },
    hdmistatus: function(data) {
      console.log('Receive hdmistatus', data)
    },
    vitaWarning: function(data) {
      this.show = true
      this.$modal.show('alert', '')
      this.$socket.emit('ttsText', this.$t('dictionary.warnings.warning'))
      this.$marqueemsg.show('Ver Mensagem', 'Aviso')
      EventBus.$emit('changeTab')
    },
    informationVita: function(data) {
      this.$marqueemsg.show(data.shortMessage, data.longMessage)
    },
    unblock: function() {
      this.$marqueemsg.hide()
      EventBus.removeAudio('off')
      this.show = false
      clearTimeout(this.timeout)
      this.$modal.hide('alert')
    },
    blocked: function() {
      this.$notifications.notify({
        message: '<h4>' + this.$t("remote.title") + '</h4>',
        icon: 'ti-bell',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'warning'
      })
      this.$socket.emit('ttsText', this.$t("remote.text"))
    },
    cmd: function(cmd) {
      EventBus.$emit('key-help', cmd)
      switch (cmd) {
        case 'up':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', -1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              EventBus.$emit('move-components', cmd)
            }
          }
          break;
        case 'down':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', 1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              EventBus.$emit('move-components', cmd)
            }
          }
          break;
        case 'right':
          EventBus.currentComponent = EventBus.correntRightComponent
          EventBus.$emit('move-components', cmd)
          break;
        case 'left':
        case 'exit':
          if (EventBus.currentComponent !== EventBus.sidebarName) {
            EventBus.$emit('move-components', cmd)
          }
          if (/* (cmd === 'settings' && !EventBus.examEmExec) || */ (cmd === 'exit' && !EventBus.examEmExec)) {
            if (this.settings) {
              this.settings = false
              this.$modal.hide('settings')
            }
          }
          break;
        case 'ok_btn':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', cmd)
          } else {
            EventBus.$emit('move-components', cmd)
          }
          break;
        case 'settings':
          if (!EventBus.examEmExec) {
            if (this.settings) {
              this.settings = false
              this.$modal.hide('settings')
            } else {
              this.settings = true
              this.$modal.show('settings')
            }
          }
          break;
        default:
          break;
      }
    }
  }
})

window.store = store
window['vue'] = app

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
  } else if (charCode === 113) { // 'q'
    sendCmd = '29';
  } else if (charCode === 99) { // 'c'
    sendCmd = 'green';
  }
  if (sendCmd !== "") {
    app.$socket.emit('keypress', sendCmd);
    sendCmd = "";
  }
});
