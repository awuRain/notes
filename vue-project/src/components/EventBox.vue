<template>
	<div class="event-box">
		<button @click="dispatchEvent">dispatchEvent</button>
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
        this.$dispatch('child-msg', this.msg)
      }
    },
    components: {

    }
  }
</script>

<style scoped>

</style>