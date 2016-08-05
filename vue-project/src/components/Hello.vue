<template>
  <div class="hello">
    <!-- <img class="logo" src="../assets/logo.png"> -->
    <!-- 当标签属性是词组时，需要将对应的驼峰名改成短线隔开名，例如<span my-message="hello">对应js中的myMessage -->
    <animation-box :msg="msg"></animation-box>
    <event-box @child-msg="fireChildMsgEvent"></event-box>
    <ref-box v-ref:refbtn></ref-box>
    <slot-box>
      <animation-box></animation-box>
      <event-box @child-msg="fireChildMsgEvent"></event-box>
    </slot-box>
    <p>
      Welcome to your Vue.js app!
    </p>
    <p>
      To get a better understanding of how this boilerplate works, check out
      <a href="http://vuejs-templates.github.io/webpack" target="_blank">its documentation</a>.
      It is also recommended to go through the docs for
      <a href="http://webpack.github.io/" target="_blank">Webpack</a> and
      <a href="http://vuejs.github.io/vue-loader/" target="_blank">vue-loader</a>.
      If you have any issues with the setup, please file an issue at this boilerplate's
      <a href="https://github.com/vuejs-templates/webpack" target="_blank">repository</a>.
    </p>
    <p>
      You may also want to checkout
      <a href="https://github.com/vuejs/vue-router/" target="_blank">vue-router</a> for routing and
      <a href="https://github.com/vuejs/vuex/" target="_blank">vuex</a> for state management.
    </p>
    </br>
    <active-box></active-box>
    <directive-box></directive-box>
    <div id="router">
      <a v-link="{path:'/foo'}">foo</a>
      <a v-link="{path:'/bar'}">bar</a>
    </div>
  </div>
</template>

<script>
  import AnimationBox from './AnimationBox'
  import EventBox from './EventBox'
  import RefBox from './RefBox'
  import SlotBox from './SlotBox'
  import ActiveBox from './ActiveBox'
  import DirectiveBox from './DirectiveBox'
  import Vue from 'Vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)

  var router = new VueRouter()

  var Foo = Vue.extend({
    template: '<p>this is foo!</p>'
  })

  var Bar = Vue.extend({
    template: '<p>this is bar!</p>'
  })

  var RouterRoot = Vue.extend({})

  router.map({
    '/#!/foo': {
      component: Foo
    },
    '/#!/bar': {
      component: Bar
    }
  })

  router.start(RouterRoot, '#router')

  export default {
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'hello world!'
      }
    },
    components: {
      'animation-box': AnimationBox,
      'event-box': EventBox,
      'ref-box': RefBox,
      'slot-box': SlotBox,
      'active-box': ActiveBox,
      'directive-box': DirectiveBox
    },
    methods: {
      fireChildMsgEvent: function (msg) {
        console.log(msg)
        var refbtn = this.$refs.refbtn
        console.log(refbtn)
      }
    },
    events: {
      // 'child-msg': function (msg) {
      //   console.log(1)
      //   console.log(msg)
      // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.hello {
  display: block;
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

.hello a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}
</style>