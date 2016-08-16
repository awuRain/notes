var Vue = require('vue');
var App = require('./App');
var AppList = require('./components/routerView/AppList');
var AppDetail = require('./components/routerView/AppDetail');
var VueRouter = require('vue-router');
require('./assets/styles/main.less');

new Vue({
  el: 'body',
  components: { App }
})

var VueRouter = require('vue-router')
var Vue = require('vue')

Vue.use(VueRouter)

var RouterRoot = Vue.extend({})

var router = new VueRouter()

router.map({
  '/app-list': {
  	name: 'AppList',
    component: AppList
  },
  '/app-detail': {
  	name: 'AppDetail',
    component: AppDetail
  }
})

router.start(RouterRoot, '#cont-container')