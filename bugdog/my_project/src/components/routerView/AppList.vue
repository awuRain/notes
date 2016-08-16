<template>
  <div class="app-list">
    <table cellpadding="0" cellspacing="0" class="table table-striped">
      <tr>
        <th>名称</th><th>版本</th><th>描述</th>
      </tr>
      <tr v-for="item in appList">
        <td>{{ item.name }}</td><td>{{ item.version }}</td><td>{{ item.description }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      'appList': [
        {'name': '荔枝FM', 'version': '2.3.11', 'description': '好听的广播app'},
        {'name': '淘宝', 'version': '1.7.9', 'description': '汇聚马云爸爸的爱'}
      ] 
    }
  }
}
</script>
