<template>
	<div class="event-box">
		<span v-my-directive="msg">{{ msg }}</span>
    <input v-model="msg"></input>
	</div>
</template>

<script>
  import Vue from 'vue'
  /*
    怎么全局定义自定义的指令
   */
  Vue.directive('my-directive', {
    // 这个列表将作为访问绑定元素的属性目标名,这一步骤是自动的
    params: ['a'],
    // 如果指令的属性值是一个object或者指向一个动态的object的话，其实object的改动并不会触发update,因为update只监听指针变化
    // 如果需要监听object内部属性变化的话，需要将指令项的deep项设置成为true
    deep: false,
    // 可以让指令值接受单行语句
    acceptStatement: false,
    // 设置priority值代表指令的优先值，优先值越高则
    priority: 2000,
    bind: function () {

    },
    update: function (newValue, oldValue) {
      if (this.params.a) {
        console.log('a:')
        console.log(this.params.a)
      }
      console.log('el:')
      console.log(this.el)
      console.log('vm:')
      console.log(this.vm)
      console.log('expression:')
      console.log(this.expression)
      console.log('arg:')
      console.log(this.arg)
      console.log('name:')
      console.log(this.name)
      console.log('modifiers:')
      console.log(this.modifiers)
      console.log('descriptor:')
      console.log(this.descriptor)
    },
    unbind: function () {

    }
  })
  export default {
    data: function () {
      return {
        msg: 'aaa'
      }
    },
    methods: {

    },
    components: {

    }
  }
</script>

<style scoped>
  
</style>