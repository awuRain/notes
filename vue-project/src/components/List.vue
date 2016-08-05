<template>
	<div class="list">
		<!-- <ul v-on:click.stop="pushItem('哈哈哈', $event)"> stop修饰符阻止冒泡，同stoppropagation -->
		<!-- <ul v-on:click.prevent="pushItem('哈哈哈', $event)"> prevent修饰符阻止原dom事件触发，同preventDefault -->
		<!-- v-on: === @ -->
		<h1>{{ a }}</h1>
		<h2>{{ b }}</h2>
		<h3>{{ c }}</h3>
		<ul @click="pushItem('哈哈哈', $event)">
			<li v-for="item in list" :transition="transitionName">
				{{ item.text }} - {{ $index }}
			</li>
		</ul>
	</div>
</template>

<script>
  import Vue from 'vue'
  Vue.transition(
    'listTransition', {
      beforeEnter: function (el) {
        console.log('beforeEnter')
      },
      enter: function (el) {
        console.log('enter')
      },
      afterEnter: function (el) {
        console.log('afterEnter')
      }
    }
  )
  // 配合动画库时可以使用1.0.4新增的过渡类切换
  // Vue.transition('bounce', {
  //   enterClass: 'bounceInLeft',
  //   leaveClass: 'bounceOutRight'
  // })
  export default {
    data: function () {
      return {
        list: [
          {text: '我就是第一啦'},
          {text: '我是第二'},
          {text: '我是第三'}
        ],
        a: 1,
        transitionName: 'listTransition'
      }
    },
    computed: {
      b: function () {
        return this.a + 10
      },
      c: {
        get: function () {
          return this.a + this.b
        },
        set: function () {

        }
      }
    },
    methods: {
      pushItem: function (text, event) {
        this.list.push({text: text})
      }
    },
    components: {

    }
  }
</script>

<style scoped>
	.list {
		color: #fff;
	}

	.listTransition-transition {
		transition: all .3s ease;
		opacity: 1;
	}

	.listTransition-enter, .listTransition-leave {
		opacity: 0;
	}
</style>