<template>
  <div class="app-detail">
    <h1>{{ appDetail.name }}</h1>
    <h5>{{ appDetail.version }}<h5>
    <p>{{ appDetail.description }}</p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      'appDetail': {
        'name': '荔枝fm',
        'version': '1.7.21',
        'description': '看过这两个地方之后，我们把思维发散开来，应该就能触类'
      }
    }
  }
}
</script>
