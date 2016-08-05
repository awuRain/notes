<template>
  <!-- 如果需要达到动态切换的效果，需要将is属性绑定成动态的 -->
	<component :is="currentView" transition="fade" transition-mode="out-in"></component>
  <button @click="toggleView">a {{ c }}</button>
</template>

<script>
  import EventBox from './EventBox'
  import AnimationBox from './AnimationBox'
  import ToggleButton from './ToggleButton'
  export default {
    data: function () {
      return {
        viewsIndex: 0
      }
    },
    computed: {
      'c': function () {
        return 'newc'
      }
    },
    methods: {
      toggleView: function () {
        this.viewsIndex = this.viewsIndex === 2 ? 0 : this.viewsIndex + 1
      },
      currentView: function () {
        this.$set('c', 'newc')
        var views = ['component1', 'component2', 'component3']
        console.log(this.viewsIndex)
        return views[this.viewsIndex]
      }
    },
    components: {
      'component1': EventBox,
      'component2': AnimationBox,
      'component3': ToggleButton
    }
    // active: function (done) {
    //   console.log(this)
    //   done()
    // }
  }
</script>

<style scoped>
  .fade-transition {
    transition: all .3s ease;
    opacity: 1;
  }

  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>