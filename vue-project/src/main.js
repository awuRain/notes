var Vue = require('vue')
var App = require('./App')
var VueRouter = require('vue-router')

Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})

