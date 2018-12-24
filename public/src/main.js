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
    timeout: null,
    warning_type: null
  },
  mounted() {
    // self.$socket.emit('ttsText', self.$t('modal.procedure.' + EventBus.warning_type + '.0') +
    // self.$t('modal.procedure.' + EventBus.warning_type + '.1') + self.$t('modal.procedure.' + EventBus.warning_type + '.2'))
  },
  beforeCreate() {
  },
  sockets: {
    ttsPath(path) {
      var self = this
      if (document.getElementById('audioElem')) {
        document.getElementById('audioElem').remove()
      }
      if (EventBus.warnings) {
        EventBus.audioBasicMode('./static/.temp/' + path, () => {
          self.$modal.hide('alert')
          self.timeout = setTimeout(() => {
            self.$modal.show('alert', '')
            self.$socket.emit('ttsText', self.$t('modal.procedure.warnings'))
            // self.$socket.emit('ttsText', self.$t('modal.procedure.' + EventBus.warning_type + '.0') +
            // self.$t('modal.procedure.' + EventBus.warning_type + '.1') + self.$t('modal.procedure.' + EventBus.warning_type + '.2'))
          }, 5000)
        })
      } else {
        EventBus.audioBasicMode('./static/.temp/' + path, null)
      }
    },
    vitaWarning: function(data) {
      EventBus.warning_type = data.warning_type
      EventBus.warnings = true
      EventBus.notifications = false
      EventBus.wifi = false
      EventBus.settings = false
      this.$modal.hide('wifi-settings')
      this.$modal.hide('settings')
      this.$modal.show('alert', '')
      // this.$socket.emit('ttsText', this.$t('modal.procedure.' + EventBus.warning_type + '.0') +
      // this.$t('modal.procedure.' + EventBus.warning_type + '.1') + this.$t('modal.procedure.' + EventBus.warning_type + '.2'))
      this.$socket.emit('ttsText', this.$t('modal.procedure.warnings'))
      this.$marqueemsg.show('Informação', 'Prima ok para desbloquear a aplicação.', { speed: 15, fontSize: '3vw' })
      EventBus.$emit('changeTab', '/vitabox/warnings')
      this.$modal.show('procedure', data)
    },
    informationVita: function(data) {
      var self = this
      // if (EventBus.notificationList.length === 5) {
      //   EventBus.notificationList.shift()
      // }
      if (data.msg) {
        EventBus.notificationList.push({
          classControl: 'btn-success control-remote',
          icon: (function() {
            let srtIcon = ""
            if (data.msg.type === 'notification') {
              srtIcon = '<img src="static/img/vitabox/alert4.svg" width="40" height="40">'
            } else if (data.msg.type === 'schedule') {
              srtIcon = '<img src="static/img/vitabox/schedule3.svg" width="40" height="40">'
            }
            return srtIcon
          })(),
          titleCard: (function() {
            let srtTitle = ""
            if (data.msg.type === 'notification') {
              srtTitle = 'Mensagem'
            } else if (data.msg.type === 'schedule') {
              srtTitle = 'Agendamento'
            }
            return srtTitle + ' <img src="static/img/vitabox/unchecked.svg" width="30" height="30">'
          })(),
          content: (function() {
            let str = '<h5><i>Data: </i><b>' + EventBus.dateFormat(data.msg.date) + '</b>'
            if (data.msg.from) {
              str += '<br><i>' + self.$t("dictionary.from") + '</i> ' + data.msg.from
            }
            if (data.msg.to) {
              str += '<br><i>' + self.$t("dictionary.to") + '</i> ' + data.msg.to
            }
            str += '<br><i>' + self.$t("dictionary.message") + '</i> ' + data.msg.message + '</h5>'
            return str
          })()
        })
      }
      // if (!data.alert && !EventBus.examEmExec) {
      //   EventBus.$emit('changeTab', '/vitabox/bemvindo')
      //   EventBus.notifications = true
      //   EventBus.$emit('notification', '')
      //   this.$modal.hide('settings')
      //   EventBus.wifi = false
      //   EventBus.settings = false
      //   this.$marqueemsg.show(data.shortMessage, data.longMessage)
      this.$marqueemsg.show('Mensagems', 'Possui novas mensagens, utilizando o comando navegue para o separador "Bem Vindo" para verificar as mensagens.')
      // }
    },
    unblock: function(type) {
      this.$marqueemsg.hide()
      if (type === 'alert') {
        EventBus.removeAudio('off')
        EventBus.warnings = false
        clearTimeout(this.timeout)
        this.$modal.hide('alert')
        this.$modal.hide('procedure')
      }
      if (type === 'notification') {
        EventBus.removeAudio('off')
        EventBus.notifications = false
      }
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
      EventBus.cmd(cmd)
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
    sendCmd = '26';
  } else if (charCode === 118) { // 'v'
    sendCmd = '27';
  } else if (charCode === 99) { // 'c'
    sendCmd = 'green';
  }
  if (sendCmd !== "") {
    app.$socket.emit('keypress', sendCmd);
    sendCmd = "";
  }
});
