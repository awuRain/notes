<template>
  <div id="app">
    <top-bar></top-bar>
    <left-bar></left-bar>
    <cont-container></cont-container>
  </div>
</template>

<script>
var TopBar = require('./components/base/TopBar')
var LeftBar = require('./components/base/LeftBar')
var ContContainer = require('./components/base/ContContainer')

export default {
  components: {
    'top-bar': TopBar,
    'left-bar': LeftBar,
    'cont-container': ContContainer
  }
}
</script>


