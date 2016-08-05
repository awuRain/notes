<template>
	<div class="left-bar">
		<list></list>
		<toggle-button></toggle-button>
		<if-h1></if-h1>
	</div>
</template>

<script>
  import List from './List'
  import ToggleButton from './ToggleButton'
  import IfH1 from './IfH1'

  export default {
    data: function () {
      return {
        text: '顶部barbar'
      }
    },
    components: {
      'list': List,
      'toggle-button': ToggleButton,
      'if-h1': IfH1
    }
  }
</script>

<style scoped>
	.left-bar {
		background-color: #999;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		display: block;
		width: 20%;
		margin-top: 40px;
	}
</style>