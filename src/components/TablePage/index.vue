<template>
  <div class="table-page">
    <!-- 搜索区域 - 固定在顶部 -->
    <div class="search-wrapper">
      <search-header ref="searchHeader" v-if="searchItems.length" :search-items="searchItems" :search-model="searchModel" @search="handleSearch"
        @reset="handleReset">
        <template v-for="item in Object.keys(searchSlots)" v-slot:[item]="scope">
          <slot :name="item" v-bind="scope"></slot>
        </template>

        <template #operation-buttons>
          <slot name="operation-buttons"></slot>
        </template>
      </search-header>
    </div>

    <!-- 表格区域 - 固定高度，可滚动 -->
    <div class="content-wrapper">
      <div class="content-container">
        <table-content ref="tableContent" :loading="loading" :table-data="tableData" :columns="columns"
          :show-selection="showSelection" :show-index="showIndex" :show-operation="showOperation" :row-key="rowKey"
          :current-page="currentPage" :page-size="pageSize" @selection-change="handleSelectionChange"
          @sort-change="handleSortChange" @row-click="handleRowClick" @row-dblclick="handleRowDblClick">
          <template v-for="item in Object.keys(tableSlots)" v-slot:[item]="scope">
            <slot :name="item" v-bind="scope"></slot>
          </template>

          <template #operation="scope">
            <slot name="operation" v-bind="scope"></slot>
          </template>

          <template #empty>
            <slot name="empty">
              <div class="empty-block">
                <el-empty description="暂无数据"></el-empty>
              </div>
            </slot>
          </template>
        </table-content>
      </div>
    </div>
    
    <!-- 分页区域 - 固定在底部 -->
    <div class="pagination-wrapper">
      <table-pagination v-if="showPagination" :page.sync="currentPage" :limit.sync="pageSize" :total="total"
        :page-sizes="pageSizes" :hide-on-single-page="hidePaginationOnSinglePage" :show-total="false"
        @pagination="handlePagination"></table-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePage',
  props: {
    // 组件高度
    height: {
      type: String,
      default: 'calc(95vh - 74px)'
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => []
    },
    // 搜索项配置
    searchItems: {
      type: Array,
      default: () => []
    },
    // 搜索表单值
    searchModel: {
      type: Object,
      default: () => ({})
    },
    // 表格加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否显示选择列
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否显示索引列
    showIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示操作列
    showOperation: {
      type: Boolean,
      default: true
    },
    // 行数据的 Key
    rowKey: {
      type: String,
      default: 'id'
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 每页条数
    limit: {
      type: Number,
      default: 10
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 每页条数选项
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100]
    },
    // 总条数少于一页时是否隐藏分页
    hidePaginationOnSinglePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: this.page,
      pageSize: this.limit,
      searchSlots: {},
      tableSlots: {},
    }
  },
  watch: {
    page(val) {
      this.currentPage = val
    },
    limit(val) {
      this.pageSize = val
    },
    searchItems() {
      this.searchSlots = this.getSearchSlots()
    },
    columns: {
      handler() {
        this.tableSlots = this.getTableSlots()
        console.log('tableSlots updated:', this.tableSlots)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // 使用setTimeout延迟组件初始化，避免在动态路由切换时的问题
    setTimeout(() => {
      // 初始化插槽
      this.searchSlots = this.getSearchSlots();
      this.tableSlots = this.getTableSlots();
      console.log('Initialized tableSlots:', this.tableSlots);
    }, 300);
  },
  methods: {
    // 获取搜索区域的所有插槽
    getSearchSlots() {
      const slots = {}
      // 处理查询表单中的自定义插槽
      if (Array.isArray(this.searchItems)) {
        this.searchItems.forEach(item => {
          if (item && item.type === 'slot' && item.prop) {
            const slotName = 'search-item-' + item.prop
            slots[slotName] = true
          }
        })
      }
      // 添加其他默认插槽
      slots['before-search-items'] = true
      slots['after-search-items'] = true
      slots['search-buttons'] = true
      return slots
    },
    // 获取表格区域的所有插槽
    getTableSlots() {
      const slots = {}
      // 处理表格中的自定义列插槽
      if (Array.isArray(this.columns)) {
       
        this.columns.forEach(col => {
          // 添加防御性检查，确保 col 是有效对象且有 slotName 属性
          if (col && typeof col === 'object' && col.slotName) {
            slots[col.slotName] = true
          }
        })
      }
      
      return slots
    },
    // 搜索事件
    handleSearch(form) {
      this.currentPage = 1
      this.$emit('search', { ...form, page: 1, limit: this.pageSize })
    },
    // 重置事件
    handleReset(form) {
      this.currentPage = 1
      this.$emit('reset', { ...form, page: 1, limit: this.pageSize })
    },
    // 分页事件
    handlePagination({ page, limit }) {
      this.$emit('pagination', { page, limit })
      this.$emit('update:page', page)
      this.$emit('update:limit', limit)
    },
    // 表格多选变化
    handleSelectionChange(selection) {      
      const safeSelection = Array.isArray(selection) ? selection : [];
      this.$emit('selection-change', safeSelection)
    },
    // 表格排序变化
    handleSortChange(column) {
      this.$emit('sort-change', column)
    },
    // 行点击事件
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    // 行双击事件
    handleRowDblClick(row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    // 获取选中的行数据
    getSelectionRows() {
      return this.$refs.tableContent ? this.$refs.tableContent.getSelectionRows() : []
    },
    // 清空选中的行
    clearSelection() {
      if (this.$refs.tableContent) {
        this.$refs.tableContent.clearSelection()
      }
    },
    // 切换行的选中状态
    toggleRowSelection(row, selected) {
      if (this.$refs.tableContent) {
        this.$refs.tableContent.toggleRowSelection(row, selected)
      }
    },
    // 获取搜索表单值
    getSearchForm() {
      return this.$refs.searchHeader ? this.$refs.searchHeader.getSearchForm() : {}
    },
    // 设置搜索表单值
    setSearchForm(form) {
      if (this.$refs.searchHeader) {
        this.$refs.searchHeader.setSearchForm(form)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-page {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
  position: relative;
  /* 可自定义高度 */

  .search-wrapper {
    flex: 0 0 auto;    
  }

  .content-wrapper {
    flex: 1;
    overflow: hidden;
    padding: 0 16px;
    margin-bottom: 16px;
    
    .content-container {
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      
      ::v-deep .el-table {
        flex: 1;
        overflow: auto;
        
        .el-table__body-wrapper {
          overflow-y: auto;
        }
      }
    }
  }

  .empty-block {
    padding: 32px 0;
  }

  .pagination-wrapper {
    flex: 0 0 auto;
    padding: 0 16px 16px;
    // background-color: #f5f7fa;
    // border-top: 1px solid #e6e6e6;
  }

  .table-loading {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;

    .loading-container {
      padding: 0;

      .loading-card {
        margin-bottom: 0;
        border: none;

        .loading-header {
          padding: 12px 0;

          .loading-bar {
            height: 20px;
            background: #f2f2f2;
            margin-bottom: 8px;
            border-radius: 4px;
            animation: loading-pulse 1.5s infinite;
          }
        }

        .loading-content {
          padding: 0 0 16px 0;

          .loading-row {
            display: flex;
            margin-bottom: 8px;

            .loading-col {
              flex: 1;
              height: 40px;
              background: #f5f5f5;
              margin-right: 8px;
              border-radius: 4px;
              animation: loading-pulse 1.5s infinite;

              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
}

@keyframes loading-pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.6;
  }
}
</style>