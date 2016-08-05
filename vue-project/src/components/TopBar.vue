<template>
	<div class="top-bar">
		<h1>{{ text }}</h1>
	</div>
</template>

<script>
  export default {
    data: function () {
      return {
        text: '顶部barbar'
      }
    },
    components: {

    }
  }
</script>

<style scoped>
  .top-bar {
    background-color: #777;
    height: 40px;
  }
  h1 {
    line-height: 40px;
    color: #fff;
  }
</style>