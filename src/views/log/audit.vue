<template>
  <div class="audit-log" v-if="isReady">
    <div v-if="renderKey > 0">
      <table-page
        ref="tablePage"
        :key="renderKey"
        :table-data="auditList"
        :columns="safeColumns"
        :search-items="searchItems"
        :search-model="filters"
        :loading="loading"
        :page="currentPage"
        :limit="pageSize"
        :total="total"
        @search="handleSearch"
        @reset="handleReset"
        @pagination="handlePagination"
      >
        <template #result-column="{ row }">
          <el-tag :type="row.result === 'success' ? 'success' : 'danger'">
            {{ row.result === 'success' ? '成功' : '失败' }}
          </el-tag>
        </template>
        
        <template #operation-buttons>
          <el-button type="primary" icon="el-icon-refresh" @click="refreshLogs">刷新</el-button>
        </template>
      </table-page>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditLog',
  data() {
    // 预定义固定列配置
    const columnConfig = [
      {
        label: '时间',
        prop: 'timestamp',
        width: 180,
        sortable: false,
        align: 'center'
      },
      {
        label: '操作人',
        prop: 'operator',
        width: 120,
        sortable: false,
        align: 'center'
      },
      {
        label: 'IP地址',
        prop: 'ip',
        width: 140,
        sortable: false,
        align: 'center'
      },
      {
        label: '操作类型',
        prop: 'actionType',
        width: 100,
        sortable: false,
        align: 'center'
      },
      {
        label: '操作对象',
        prop: 'targetObject',
        width: 120,
        sortable: false,
        align: 'center'
      },
      {
        label: '详细描述',
        prop: 'detail',
        sortable: false,
        align: 'left'
      },
      {
        label: '结果',
        prop: 'result',
        width: 80,
        slotName: 'result-column',
        sortable: false,
        align: 'center'
      }
    ];
    
    return {
      isReady: false,
      renderKey: 1, // 用于强制重新渲染组件
      loading: false,
      auditList: [
        { 
          timestamp: '2023-05-01 09:30:00', 
          operator: 'admin', 
          ip: '192.168.1.100', 
          actionType: 'login', 
          targetObject: '系统', 
          detail: '用户登录系统',
          result: 'success'
        },
        { 
          timestamp: '2023-05-01 10:15:00', 
          operator: 'admin', 
          ip: '192.168.1.100', 
          actionType: 'create', 
          targetObject: '设备', 
          detail: '创建新设备：测试设备001',
          result: 'success'
        },
        { 
          timestamp: '2023-05-01 11:45:00', 
          operator: 'user1', 
          ip: '192.168.1.101', 
          actionType: 'update', 
          targetObject: '产品', 
          detail: '更新产品信息：智能灯',
          result: 'success'
        }
      ],
      filters: {
        actionType: '',
        operator: '',
        dateRange: null
      },
      searchItems: [
        {
          type: 'select',
          label: '操作类型',
          prop: 'actionType',
          options: [
            { label: '全部', value: '' },
            { label: '登录', value: 'login' },
            { label: '登出', value: 'logout' },
            { label: '创建', value: 'create' },
            { label: '更新', value: 'update' },
            { label: '删除', value: 'delete' }
          ]
        },
        {
          type: 'input',
          label: '操作人',
          prop: 'operator'
        },
        {
          type: 'daterange',
          label: '时间范围',
          prop: 'dateRange'
        }
      ],
      columnConfig: columnConfig, // 存储原始列配置
      columns: [], // 将被赋值
      currentPage: 1,
      pageSize: 10,
      total: 100
    };
  },
  computed: {
    // 安全的列配置，确保永远有有效的列
    safeColumns() {
      return this.columns && this.columns.length > 0
        ? this.columns
        : this.columnConfig;
    }
  },
  created() {
    // 复制原始列配置，不使用引用
    this.columns = JSON.parse(JSON.stringify(this.columnConfig));
    
    // 初始化时获取数据
    this.fetchLogs();
  },
  mounted() {
    // 延迟设置就绪标志，确保所有数据都准备好
    setTimeout(() => {
      this.isReady = true;
      
      // 再次短暂延迟后强制重新渲染
      setTimeout(() => {
        this.forceRerender();
      }, 50);
    }, 100);
  },
  methods: {
    // 强制表格重新渲染
    forceRerender() {
      this.renderKey += 1;
    },
    handleSearch(params) {
      console.log('搜索参数:', params);
      this.loading = true;
      
      // 模拟接口请求
      setTimeout(() => {
        this.loading = false;
        // 假设已获取数据
        this.$message.info('查询功能开发中...');
      }, 500);
    },
    handleReset(form) {
      console.log('重置搜索条件');
      this.fetchLogs();
    },
    refreshLogs() {
      this.loading = true;
      
      // 模拟刷新
      setTimeout(() => {
        this.loading = false;
        this.$message.success('日志已刷新');
      }, 500);
    },
    handlePagination({ page, limit }) {
      this.currentPage = page;
      this.pageSize = limit;
      this.fetchLogs();
    },
    fetchLogs() {
      this.loading = true;
      
      // 模拟获取数据
      setTimeout(() => {
        // 确保有数据
        if (!this.auditList || this.auditList.length === 0) {
          this.auditList = [
            { 
              timestamp: '2023-05-01 09:30:00', 
              operator: 'admin', 
              ip: '192.168.1.100', 
              actionType: 'login', 
              targetObject: '系统', 
              detail: '用户登录系统',
              result: 'success'
            },
            { 
              timestamp: '2023-05-01 10:15:00', 
              operator: 'admin', 
              ip: '192.168.1.100', 
              actionType: 'create', 
              targetObject: '设备', 
              detail: '创建新设备：测试设备001',
              result: 'success'
            },
            { 
              timestamp: '2023-05-01 11:45:00', 
              operator: 'user1', 
              ip: '192.168.1.101', 
              actionType: 'update', 
              targetObject: '产品', 
              detail: '更新产品信息：智能灯',
              result: 'success'
            }
          ];
        }
        
        // 每次获取数据后重新生成列配置
        this.columns = JSON.parse(JSON.stringify(this.columnConfig));
        
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.audit-log {
  padding: 20px;
}
</style> 