<template>
	<div class="slot-box">
    <p>以下就是插槽咯<p>
    <slot name="one"><slot>
    <slot name="two"><slot>
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