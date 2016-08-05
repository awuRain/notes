<template>
	<div :class="{ 'toggle-button': true, 'bg-color': isBgClor }">
		<button @click="toggleClass">toggle</button>
	</div>
</template>

<script>
  export default {
    data: function () {
      return {
        isBgClor: false
      }
    },
    methods: {
      toggleClass: function () {
        this.isBgClor = !this.isBgClor
      }
    },
    components: {

    }
  }
</script>

<style scoped>
	.toggle-button {
		width: 100px;
		height: 100px;
	}

	.bg-color {
		background-color: red;
	}
</style>