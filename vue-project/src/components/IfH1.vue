<template>
	<div class="if-h1">
		<h1 v-if="a">a</h1>
		<h1 v-else>b</h1>
		<button @click="toggleA">toggleA</button>
	</div>
</template>

<script>
  export default {
    data: function () {
      return {
        a: true
      }
    },
    methods: {
      toggleA: function () {
        this.a = !this.a
        // 只能通过非法访问私有才能获取当前组件的data对象吗？
        console.log(this._data)
      }
    },
    components: {

    }
  }
</script>

<style scoped>
	h1 {
		color: blue;
	}
</style>