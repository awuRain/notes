<template>
	<div class="animation-box">
		<div v-show="show" transition="bounce"><span>a<span></div>
		<button @click="toggleShow">toggleShow</button>
		<span>{{ myMsg }}</span>
	</div>
</template>

<script>
  export default {
    data: function () {
      return {
        text: '顶部barbar',
        show: true
      }
    },
    props: {
      msg: {
        type: [String, Number],
        require: true,
        default: 'default-mya'
      }
    },
    computed: {
      'myMsg': function () {
        return 'my' + ' ' + this.msg
      }
    },
    methods: {
      toggleShow: function () {
        this.show = !this.show
        // 虽然可以依靠Vue暴露的$parent和$root来访问父组件和根组件，但是Vue并不鼓励这样做
        console.log(this.$parent)
        console.log(this.$root)
      }
    },
    components: {

    }
  }
</script>

<style scoped>
	.bounce-transition {
		display: inline-block;
	}
	.bounce-enter {
		animation: bounce-in .5s;
	}
	.bounce-leave {
		animation: bounce-out .5s;
	}
	@keyframes bounce-in {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes bounce-out {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(0);
		}
	}
</style>