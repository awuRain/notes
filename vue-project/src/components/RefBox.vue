<template>
	<div class="ref-box">
		<button @click="dispatchEvent">我就是带ref的按钮啦</button>
	</div>
</template>

<script>
  export default {
    data: function () {
      return {
        msg: '哼，我就是子级组件的msg咯'
      }
    },
    methods: {
      dispatchEvent: function () {
        console.log(this.$refs)
        console.log(this.$refs.refbtn)
      }
    },
    components: {

    }
  }
</script>

<style scoped>

</style>