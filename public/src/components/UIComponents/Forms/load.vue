<template>
  <div id="loader-wrapper" v-show="this.execProcess">
    <div id="loader">
      <h4 class="text-center">
        <img src='static/img/load3_B.gif' alt=''>
      </h4>
      <h1 class="text-center">Aguarde</h1>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loading',
  data() {
    return {
      execProcess: false
    }
  },
  methods: {
    show() {
      this.execProcess = true
    },
    hide() {
      this.execProcess = false
    },
    getLoadingState() {
      return this.execProcess
    }
  }
}
</script>
<style>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #000000;
  opacity: 0.5;
  filter: alpha(opacity=50); /* For IE8 and earlier */
}
#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 30px;
  height: 30px;
  margin: -150px 0 0 -150px;
  z-index: 1500;
}
</style>
