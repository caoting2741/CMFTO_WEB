<template>
  <div class="cloud-log">
    <div>
      <table-page ref="tablePage" :key="renderKey" :table-data="paginatedLogs" :columns="safeColumns"
        :search-items="searchItems" :search-model="filters" :loading="loading" :page="currentPage" :limit="pageSize"
        :total="total" :show-selection="true" @search="handleSearch" @reset="handleReset" @pagination="handlePagination"
        @selection-change="handleSelectionChange">
        <template #level-column="{ row }">
          <el-tag :type="row.level === 'error' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'">
            {{ row.level }}
          </el-tag>
        </template>
        <!-- 操作列插槽 -->
        <template #operation="{ row }">
          <el-button size="mini" >编辑</el-button>
          <el-button size="mini" >详情</el-button>
          <el-button size="mini" >编辑</el-button>
          <el-button size="mini" >详情</el-button>
        </template>
        <template #operation-buttons>
          <el-button type="primary" icon="el-icon-refresh" @click="refreshLogs">刷新</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="selectedLogs.length === 0"
            @click="handleBatchDelete">
            批量删除 ({{ selectedLogs.length }})
          </el-button>
          <el-button type="success" icon="el-icon-download" :disabled="selectedLogs.length === 0"
            @click="handleBatchExport">
            批量导出 ({{ selectedLogs.length }})
          </el-button>
        </template>
      </table-page>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CloudLog',
  data() {
    // 预定义固定列配置
    const columnConfig = [
      {
        label: '时间',
        prop: 'timestamp',
        width: 180,
        sortable: true,
        align: 'center'
      },
      {
        label: '级别',
        prop: 'level',
        width: 100,
        slotName: 'level-column',
        sortable: true,
        align: 'center'
      },
      {
        label: '模块',
        prop: 'module',
        width: 120,
        sortable: true,
        align: 'center'
      },
      {
        label: '内容',
        prop: 'content',
        sortable: false,
        align: 'left'
      }
    ];

    return {
      isReady: false,
      renderKey: 1, // 用于强制重新渲染组件
      loading: false,
      logList: [], // 当前显示的日志列表
      _allLogs: null, // 缓存所有日志用于搜索和筛选
      filters: {
        level: '',
        dateRange: null
      },
      searchItems: [
        {
          type: 'select',
          label: '日志级别',
          prop: 'level',
          options: [
            { label: '全部', value: '' },
            { label: '信息', value: 'info' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' }
          ]
        },
        {
          type: 'daterange',
          label: '时间范围',
          prop: 'dateRange'
        }
      ],
      columnConfig: columnConfig, // 存储原始列配置
      columns: [], // 将被赋值
      currentPage: 1, // 确保初始页码为1
      pageSize: 10, // 每页10条
      total: 0, // 初始化总条数为0
      selectedLogs: [], // 存储选中的日志记录
    };
  },
  computed: {
    // 安全的列配置，确保永远有有效的列
    safeColumns() {
      return this.columns && this.columns.length > 0
        ? this.columns
        : this.columnConfig;
    },

    // 分页后的日志数据
    paginatedLogs() {
      // 如果没有数据，直接返回空数组
      if (!this.logList || this.logList.length === 0) return [];

      // 计算当前页的起始索引和结束索引
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      // 返回当前页的数据
      return this.logList.slice(startIndex, endIndex);
    }
  },
  created() {
    // 复制原始列配置，不使用引用
    this.columns = JSON.parse(JSON.stringify(this.columnConfig));

    console.log('组件创建，即将获取日志数据');
    // 初始化时获取数据
    this.fetchLogs();
  },
  mounted() {
    console.log('组件挂载完成');
    // 延迟设置就绪标志，确保所有数据都准备好
    setTimeout(() => {
      this.isReady = true;
      console.log('就绪状态设置为 true');

      // 再次短暂延迟后强制重新渲染
      setTimeout(() => {
        console.log('强制重新渲染组件');
        this.forceRerender();

        // 检查数据状态
        console.log('日志数据状态:', {
          logListLength: this.logList.length,
          paginatedLogsLength: this.paginatedLogs.length,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          total: this.total
        });
      }, 50);
    }, 100);
  },
  updated() {
    // 检查如果数据存在但表格为空，则尝试强制刷新
    if (this.isReady && this.logList.length > 0 && this.$refs.tablePage && this.renderKey <= 2) {
      console.log('组件更新，检测到数据状态:', {
        logListLength: this.logList.length,
        paginatedLogsLength: this.paginatedLogs.length,
        renderKey: this.renderKey
      });

      // 如果渲染次数过少，再次尝试渲染
      if (this.renderKey < 3) {
        setTimeout(() => {
          console.log('强制再次渲染表格...');
          this.forceRerender();
        }, 200);
      }
    }
  },
  beforeDestroy() {
    // 清理数据，防止内存泄漏
    this._allLogs = null;
    this.logList = [];
  },
  methods: {
    // 强制表格重新渲染
    forceRerender() {
      this.renderKey += 1;
    },
    handleSearch(params) {
      console.log('搜索参数:', params);
      this.loading = true;

      // 保存过滤条件
      this.filters = { ...params };

      // 生成全部日志数据（如果尚未生成）
      if (!this._allLogs) {
        this._allLogs = this.generateRandomLogs(100);
      }

      // 根据条件过滤日志
      setTimeout(() => {
        let filteredLogs = [...this._allLogs];

        // 按日志级别过滤
        if (params.level) {
          filteredLogs = filteredLogs.filter(log => log.level === params.level);
        }

        // 按日期范围过滤
        if (params.dateRange && params.dateRange.length === 2) {
          const startDate = new Date(params.dateRange[0]);
          const endDate = new Date(params.dateRange[1]);
          endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间

          filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
          });
        }

        // 更新日志列表和总数
        this.logList = filteredLogs;
        this.total = filteredLogs.length;

        // 重置页码，确保从第一页开始显示
        this.currentPage = 1;

        this.loading = false;
      }, 500);
    },
    handleReset(form) {
      console.log('重置搜索条件');
      // 清除已保存的所有日志数据
      this._allLogs = null;
      // 重置过滤条件
      this.filters = {
        level: '',
        dateRange: null
      };
      // 重新获取日志
      this.fetchLogs();
    },
    refreshLogs() {
      console.log('刷新日志数据');
      this.loading = true;

      // 清除缓存的日志数据
      this._allLogs = null;

      // 重新生成日志数据
      setTimeout(() => {
        const logs = this.generateRandomLogs(100);
        console.log(`刷新生成了 ${logs.length} 条日志数据`);

        this.logList = logs;
        this.total = logs.length;

        // 缓存所有日志，用于搜索功能
        this._allLogs = [...logs];

        // 确保页码从第一页开始
        this.currentPage = 1;

        console.log('日志刷新完成，当前状态:', {
          logListLength: this.logList.length,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          total: this.total
        });

        this.loading = false;
        this.$message.success('日志已刷新');
      }, 500);
    },
    // 在获取日志前检查初始化状态
    checkAndInitData() {
      console.log('检查数据初始化状态');

      // 如果还没有数据，立即获取
      if (!this.logList || this.logList.length === 0) {
        console.log('没有检测到日志数据，立即获取');
        this.fetchLogs();
        return true;
      }

      return false;
    },
    // 处理分页变化
    handlePagination({ page, limit }) {
      console.log(`分页变化：页码=${page}, 每页条数=${limit}`);

      // 检查数据是否初始化
      if (this.checkAndInitData()) {
        return;
      }

      this.currentPage = page;
      this.pageSize = limit;

      console.log('分页后状态:', {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        total: this.total,
        logListLength: this.logList.length,
        paginatedLogsLength: this.paginatedLogs.length
      });
    },
    fetchLogs() {
      console.log('开始获取日志数据');
      this.loading = true;

      // 模拟获取数据
      setTimeout(() => {
        // 生成100条随机日志数据
        const logs = this.generateRandomLogs(100);
        console.log(`生成了 ${logs.length} 条日志数据`);

        this.logList = logs;

        // 设置总条数
        this.total = logs.length;

        // 缓存所有日志数据用于搜索和筛选
        this._allLogs = [...logs];

        // 确保页码从第一页开始
        this.currentPage = 1;

        // 每次获取数据后重新生成列配置
        this.columns = JSON.parse(JSON.stringify(this.columnConfig));

        console.log('日志数据加载完成，当前状态:', {
          logListLength: this.logList.length,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          total: this.total
        });

        this.loading = false;
      }, 500);
    },

    // 生成随机日志数据
    generateRandomLogs(count) {
      const logs = [];
      const levels = ['info', 'warning', 'error'];
      const modules = ['系统', '设备', '数据', '网络', '安全', '用户', '接口', '存储', '应用', '服务'];
      const contents = [
        '系统启动成功',
        '用户登录尝试',
        '数据同步完成',
        '设备连接超时',
        '网络连接断开',
        '请求处理失败',
        '数据库查询错误',
        '权限验证失败',
        '服务重启成功',
        '文件上传完成',
        '配置更新成功',
        '定时任务执行完成',
        'API请求超时',
        '内存使用率过高',
        'CPU负载过高',
        '磁盘空间不足',
        '数据备份完成',
        '用户会话过期',
        '非法请求拦截',
        '第三方接口调用失败'
      ];

      // 生成最近30天内的随机日志
      const now = new Date();

      for (let i = 0; i < count; i++) {
        // 生成过去30天内的随机时间
        const randomDate = new Date(now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
        const timestamp = this.formatDate(randomDate);

        // 随机选择日志级别、模块和内容
        const level = levels[Math.floor(Math.random() * levels.length)];
        const module = modules[Math.floor(Math.random() * modules.length)];
        let content = contents[Math.floor(Math.random() * contents.length)];

        // 根据级别添加额外信息
        if (level === 'error') {
          content += ` [错误码: E${Math.floor(Math.random() * 1000)}]`;
        } else if (level === 'warning') {
          content += ` [警告ID: W${Math.floor(Math.random() * 1000)}]`;
        }

        logs.push({
          timestamp,
          level,
          module,
          content
        });
      }

      // 按时间倒序排序
      return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 处理多选变化
    handleSelectionChange(selection) {
      this.selectedLogs = selection;
      console.log('选中的记录:', selection);
    },

    // 批量删除
    handleBatchDelete() {
      this.$confirm('确认删除选中的 ' + this.selectedLogs.length + ' 条日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里模拟删除操作
        this.loading = true;
        setTimeout(() => {
          // 从日志列表中移除选中项
          const selectedIds = this.selectedLogs.map(item => item.timestamp);
          this.logList = this.logList.filter(log => !selectedIds.includes(log.timestamp));
          this.total = this.logList.length;

          // 清空选中
          this.$refs.tablePage.clearSelection();
          this.selectedLogs = [];

          this.loading = false;
          this.$message.success('已删除 ' + selectedIds.length + ' 条日志记录');
        }, 500);
      }).catch(() => {
        this.$message.info('已取消删除操作');
      });
    },

    // 批量导出
    handleBatchExport() {
      this.$message.success('开始导出 ' + this.selectedLogs.length + ' 条日志记录，请稍候...');

      // 这里模拟导出操作
      setTimeout(() => {
        const exportData = this.selectedLogs.map(log => ({
          时间: log.timestamp,
          级别: log.level,
          模块: log.module,
          内容: log.content
        }));

        console.log('导出的数据:', exportData);
        this.$message.success('导出完成');
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.cloud-log {
  padding: 20px;
}
</style>