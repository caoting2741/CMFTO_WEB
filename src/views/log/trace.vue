<template>
  <div class="audit-trace">
    <el-card>
      <div slot="header" class="clearfix">
        <span>审计追踪</span>
      </div>
      
      <el-form :inline="true" class="filter-form">
        <el-form-item label="追踪ID">
          <el-input v-model="filters.traceId" placeholder="请输入追踪ID"></el-input>
        </el-form-item>
        <el-form-item label="操作对象">
          <el-input v-model="filters.targetObject" placeholder="请输入操作对象"></el-input>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTrace">查询</el-button>
        </el-form-item>
      </el-form>
      
      <div v-if="traceList.length > 0">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in traceList"
            :key="index"
            :timestamp="activity.timestamp"
            :type="activity.type">
            <el-card class="trace-card">
              <h4>{{ activity.title }}</h4>
              <p>操作人: {{ activity.operator }}</p>
              <p>IP地址: {{ activity.ip }}</p>
              <p>详细信息: {{ activity.content }}</p>
              <el-tag
                :type="activity.result === 'success' ? 'success' : 'danger'"
                size="small">
                {{ activity.result === 'success' ? '成功' : '失败' }}
              </el-tag>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-empty v-else description="暂无追踪数据"></el-empty>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AuditTrace',
  data() {
    return {
      traceList: [
        {
          timestamp: '2023-05-01 09:30:00',
          type: 'primary',
          title: '用户登录',
          operator: 'admin',
          ip: '192.168.1.100',
          content: '用户登录系统',
          result: 'success'
        },
        {
          timestamp: '2023-05-01 10:15:00',
          type: 'success',
          title: '创建设备',
          operator: 'admin',
          ip: '192.168.1.100',
          content: '创建新设备：测试设备001',
          result: 'success'
        },
        {
          timestamp: '2023-05-01 10:30:00',
          type: 'warning',
          title: '更新设备',
          operator: 'admin',
          ip: '192.168.1.100',
          content: '更新设备信息：测试设备001',
          result: 'success'
        },
        {
          timestamp: '2023-05-01 11:45:00',
          type: 'danger',
          title: '删除设备',
          operator: 'admin',
          ip: '192.168.1.100',
          content: '删除设备：测试设备001',
          result: 'success'
        }
      ],
      filters: {
        traceId: '',
        targetObject: ''
      },
      dateRange: null
    };
  },
  methods: {
    searchTrace() {
      this.$message.info('查询功能开发中...');
    }
  }
};
</script>

<style lang="scss" scoped>
.audit-trace {
  padding: 20px;
  
  .filter-form {
    margin-bottom: 20px;
  }
  
  .trace-card {
    h4 {
      margin-top: 0;
    }
    
    p {
      margin: 5px 0;
      font-size: 14px;
    }
  }
}
</style> 