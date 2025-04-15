<template>
  <div class="device-detail">
    <el-card>
      <div slot="header">
        <span>设备详情</span>
        <el-button style="float: right" size="small" @click="$router.push('/device/list')">返回</el-button>
      </div>
      
      <div v-loading="loading">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="设备ID">{{ deviceId }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">测试设备001</el-descriptions-item>
          <el-descriptions-item label="设备状态">
            <el-tag type="success">在线</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">智能温湿度计</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DeviceDetail',
  data() {
    return {
      deviceId: this.$route.params.id,
      loading: false
    };
  },
  created() {
    // 模拟获取设备数据
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
.device-detail {
  padding: 20px;
}
</style> 