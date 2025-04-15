<template>
  <div class="data-forward-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据转发配置</span>
      </div>
      <div class="empty-block">
        <el-empty description="暂无数据转发配置"></el-empty>
        <el-button type="primary" @click="handleAddConfig">添加配置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DataForward',
  data() {
    return {
      forwardingRules: []
    };
  },
  methods: {
    handleAddConfig() {
      this.$message({
        message: '功能开发中...',
        type: 'info'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.data-forward-container {
  padding: 20px;
  
  .empty-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
    
    .el-button {
      margin-top: 20px;
    }
  }
}
</style> 