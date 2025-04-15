<template>
  <div class="params-container">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="系统参数" name="system">
        <el-form :model="systemParams" label-width="120px" class="params-form">
          <el-form-item label="系统名称">
            <el-input v-model="systemParams.systemName"></el-input>
          </el-form-item>
          <el-form-item label="最大连接数">
            <el-input-number v-model="systemParams.maxConnections" :min="1" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item label="数据保存天数">
            <el-input-number v-model="systemParams.dataSaveDays" :min="1" :max="365"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveParams">保存配置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通知设置" name="notification">
        <el-empty description="暂无通知配置"></el-empty>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'ParamsIndex',
  data() {
    return {
      activeTab: 'system',
      systemParams: {
        systemName: '物联网设备管理平台',
        maxConnections: 100,
        dataSaveDays: 30
      }
    };
  },
  methods: {
    saveParams() {
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.params-container {
  padding: 20px;
  
  .params-form {
    max-width: 600px;
    margin-top: 20px;
  }
}
</style> 