import Sidebar from './SideBar.vue'

const mode = {
  advanced: true,
  auto: false
}

const advanced = [
  {
    name: 'sidebar.diagnosis.title',
    icon: 'ti-heart',
    path: '/vitabox/exames',
    text: 'sidebar.diagnosis.text'
  },
  {
    name: 'sidebar.diagnosisHistory.title',
    icon: 'ti-pie-chart',
    path: '/vitabox/exameshistorico',
    text: 'sidebar.diagnosisHistory.text'
  },
  {
    name: 'sidebar.showData.title',
    icon: 'ti-bell',
    path: '/vitabox/showdata',
    text: 'sidebar.showData.text'
  },
  {
    name: 'sidebar.ambienteHistory.title',
    icon: 'ti-rss-alt',
    path: '/vitabox/ambientehistorico',
    text: 'sidebar.ambienteHistory.text'
  },
  {
    name: 'sidebar.warning.title',
    icon: 'ti-bell',
    path: '/vitabox/warnings',
    text: 'sidebar.warning.text'
  }
]

const basic = [
  {
    name: 'sidebar.diagnosis.title',
    icon: 'ti-heart',
    path: '/vitabox/exames',
    text: 'sidebar.diagnosis.text'
  },
  {
    name: 'sidebar.showData.title',
    icon: 'ti-bell',
    path: '/vitabox/showDataBasic',
    text: 'sidebar.showData.text'
  },
  {
    name: 'sidebar.warning.title',
    icon: 'ti-bell',
    path: '/vitabox/warnings',
    text: 'sidebar.warning.text'
  }
]

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: basic,
  mode: mode,
  sidebarLinksMode: {
    advanced: advanced,
    basic: basic
  },
  displaySidebar(value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install(Vue) {
    Vue.mixin({
      data() {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get() {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
