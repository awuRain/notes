<template>
  <div id="app">
    <top-bar></top-bar>
    <left-bar></left-bar>
    <hello><hello>
  </div>
</template>

<script>
import TopBar from './components/TopBar'
import Hello from './components/Hello'
import LeftBar from './components/LeftBar'

// 这一步是注册
export default {
  components: {
    'hello': Hello,
    'top-bar': TopBar,
    'left-bar': LeftBar
  }
}
</script>

<style>
html {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}

body {
  height: 100%;
}

</style>
