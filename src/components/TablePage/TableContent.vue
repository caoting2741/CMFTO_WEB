<template>
  <div class="table-content">
    <!-- 使用v-if条件渲染表格，确保只在所有数据都就绪时才渲染 -->
    <el-table
      v-if="shouldRenderTable"
      ref="table"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :row-key="rowKey"
      :default-sort="defaultSort"
      :tree-props="treeProps"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblClick"
      :class="tableClass"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"        
      ></el-table-column>
      
      <!-- 索引列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        width="80"
        :label="indexLabel"
        :index="handleIndexMethod"
        align="center"       
      ></el-table-column>
      
      <!-- 表格列 - 使用内部安全的列配置 -->
      <template v-for="(column, index) in internalColumns">
        <!-- 普通列 -->
        <el-table-column
          v-if="!column.slotName && !column.render"
          :key="column.prop || 'col-' + index"
          :prop="column.prop"
          :label="column.label || ''"
          :width="column.width"
          :min-width="column.minWidth || '100'"
          :fixed="column.fixed"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
          :sortable="column.sortable"
          :align="column.align || 'center'"
        >
          <template slot-scope="scope">
            <template v-if="column.formatter">
              {{ column.formatter(scope.row, scope.column, scope.$index) }}
            </template>
            <template v-else-if="column.type === 'tag'">
              <el-tag
                :type="column.tagType ? (typeof column.tagType === 'function' ? column.tagType(scope.row) : column.tagType) : ''"
                :effect="column.tagEffect || 'light'"
              >
                {{ scope.row[column.prop] }}
              </el-tag>
            </template>
            <template v-else>
              {{ column.prop && scope.row ? scope.row[column.prop] : '' }}
            </template>
          </template>
        </el-table-column>
        
        <!-- 插槽列 -->
        <el-table-column
          v-else-if="column.slotName"
          :key="column.slotName || 'slot-' + index"
          :prop="column.prop"
          :label="column.label || ''"
          :width="column.width"
          :min-width="column.minWidth || '100'"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'center'"
        >
          <template slot-scope="scope">
            <slot :name="column.slotName" :row="scope.row" :index="scope.$index"></slot>
          </template>
        </el-table-column>
        
        <!-- 渲染函数列 -->
        <el-table-column
          v-else-if="column.render"
          :key="'render-' + index"
          :prop="column.prop"
          :label="column.label || ''"
          :width="column.width"
          :min-width="column.minWidth || '100'"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'center'"
        >
          <template slot-scope="scope">
            <render-cell :render="column.render" :row="scope.row" :index="scope.$index"></render-cell>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        :label="operationLabel"
        :width="operationWidthComputed"       
        :align="operationAlign || 'center'"
        class-name="operation-column"
      >
        <template slot-scope="scope">
          <div class="operation-container">
            <slot name="operation" :row="scope.row" :index="scope.$index"></slot>
          </div>
        </template>
      </el-table-column>
      
      <!-- 空数据显示 -->
      <template slot="empty">
        <slot name="empty">
          <div class="empty-block">
            <span class="empty-text">暂无数据</span>
          </div>
        </slot>
      </template>
    </el-table>
    
    <!-- 表格加载占位符，在表格未准备好时显示 -->
    <div v-else class="table-loading-placeholder">
      <el-skeleton :loading="true" animated>
        <template slot="template">
          <div style="padding: 20px">
            <el-skeleton-item variant="rect" style="width: 100%; height: 300px" />
          </div>
        </template>
        <template>
          <!-- 这里的内容在加载完成后展示，由于我们有v-else条件，这部分实际上不会被显示 -->
          <div></div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script>
// 渲染单元格组件
const RenderCell = {
  functional: true,
  props: {
    render: Function,
    row: Object,
    index: Number
  },
  render: (h, ctx) => {
    return ctx.props.render(h, {
      row: ctx.props.row,
      index: ctx.props.index
    })
  }
}

export default {
  name: 'TableContent',
  components: {
    RenderCell
  },
  props: {
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
    // 表格加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 表格高度
    height: {
      type: [String, Number],
      default: '100%'
    },
    // 表格最大高度
    maxHeight: {
      type: [String, Number],
      default: null
    },
    // 是否显示斑马纹
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true
    },
    // 行数据的 Key
    rowKey: {
      type: String,
      default: 'id'
    },
    // 树形数据配置
    treeProps: {
      type: Object,
      default: () => ({ children: 'children', hasChildren: 'hasChildren' })
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: true
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
    // 索引列标题
    indexLabel: {
      type: String,
      default: '序号'
    },
    // 是否显示操作列
    showOperation: {
      type: Boolean,
      default: true
    },
    // 操作列标题
    operationLabel: {
      type: String,
      default: '操作'
    },
    // 操作列宽度
    operationWidth: {
      type: [String, Number],
      default: 150
    },
    // 操作列是否固定
    operationFixed: {
      type: [String, Boolean],
      default: 'right'
    },
    // 操作列对齐方式
    operationAlign: {
      type: String,
      default: 'center'
    },
    // 表格其他类名
    tableClass: {
      type: String,
      default: ''
    },
    // 默认排序
    defaultSort: {
      type: Object,
      default: null
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 选中的行数据
      multipleSelection: [],
      // 内部安全的columns副本
      internalColumns: [],
      // 表格渲染标志
      shouldRenderTable: false,
      // 表格主体滚动容器引用
      tableBodyWrapper: null,
      // 窗口大小变化定时器
      resizeTimer: null
    }
  },
  computed: {
    // 提供一个安全的列配置，确保不会有null或undefined
    safeColumns() {
      if (!Array.isArray(this.columns) || this.columns.length === 0) {
        // 如果列为空，返回默认列
        return [{ prop: 'id', label: 'ID' }];
      }
      
      // 过滤和修复列配置
      return this.columns.filter(column => column && typeof column === 'object')
        .map(column => ({
          ...column,
          label: column.label || '',  // 确保label有值
          prop: column.prop || `col-${Math.random().toString(36).substr(2, 9)}` // 确保prop有值
        }));
    },
    
    // 动态计算操作列宽度，根据使用情况自动调整
    operationWidthComputed() {
      // 如果提供了明确的宽度，则使用它
      if (this.operationWidth) {
        // 确保它是一个数字字符串，并且足够宽
        const width = parseInt(this.operationWidth, 10);
        if (!isNaN(width)) {
          // 如果宽度小于特定值，自动增加宽度以适应多个按钮
          return Math.max(width, 220) + 'px';
        }
        return this.operationWidth;
      }
      
      // 默认提供更宽的操作列宽度
      return '220px';
    }
  },
  watch: {
    columns: {
      handler(newColumns) {
        // 当列配置变化时，延迟更新内部列配置
        this.$nextTick(() => {
          if (this.validateColumns(newColumns)) {
            this.internalColumns = [...newColumns];
            // 确保DOM更新后再渲染表格
            this.$nextTick(() => {
              this.shouldRenderTable = true;
            });
          } else {
            console.warn('TableContent: 提供了无效的列配置，将使用默认列', newColumns);
            // 使用默认安全列配置
            this.internalColumns = [{ prop: 'id', label: 'ID', align: 'center' }];
            this.shouldRenderTable = true;
          }
        });
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    // 延迟表格渲染，避免路由切换期间的问题
    setTimeout(() => {
      if (this.validateColumns(this.columns)) {
        this.internalColumns = [...this.columns];
      } else {
        console.warn('TableContent: 提供了无效的列配置，将使用默认列', this.columns);
        // 使用默认安全列配置
        this.internalColumns = [{ prop: 'id', label: 'ID', align: 'center' }];
      }
      this.shouldRenderTable = true;
    }, 300);
  },
  methods: {
    // 获取当前表格的索引值
    handleIndexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 表格多选变化
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      this.$emit('selection-change', selection)
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
      return this.multipleSelection
    },
    // 清空选中的行
    clearSelection() {
      if (this.$refs.table) {
        this.$refs.table.clearSelection()
        this.multipleSelection = []
      }
    },
    // 切换行的选中状态
    toggleRowSelection(row, selected) {
      if (this.$refs.table) {
        this.$refs.table.toggleRowSelection(row, selected)
      }
    },
    // 验证列配置是否有效
    validateColumns(columns = this.columns) {
      // 首先检查是否为数组
      if (!Array.isArray(columns) || columns.length === 0) {
        return false;
      }
      
      // 检查每个列对象是否有效
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        // 如果列为null或非对象，直接返回false
        if (!col || typeof col !== 'object') {
          return false;
        }
        
        // 针对非插槽和非渲染函数的列，必须有有效的prop属性
        if (!col.slotName && !col.render) {
          if (!col.prop || typeof col.prop !== 'string') {
            return false;
          }
        }
      }
      
      return true;
    },
    // 修复表格固定列与主体滚动同步问题
    fixTableScrollSync() {
      if (!this.$refs.table) return;
      
      this.$nextTick(() => {
        const tableEl = this.$refs.table.$el;
        if (!tableEl) return;
        
        const bodyWrapper = tableEl.querySelector('.el-table__body-wrapper');
        
        if (bodyWrapper) {
          // 确保表格内容渲染完成后再绑定事件
          setTimeout(() => {
            // 移除之前的监听器避免重复
            this.removeScrollListener();
            
            // 存储DOM元素引用
            this.tableBodyWrapper = bodyWrapper;
            
            // 绑定滚动事件
            bodyWrapper.addEventListener('scroll', this.handleTableScroll);
            
            // 首次触发一次滚动，确保固定列位置正确
            this.handleTableScroll({ target: bodyWrapper });
            
            // 强制重新布局表格
            if (this.$refs.table) {
              this.$refs.table.doLayout();
            }
            
            // 添加window resize事件监听
            window.addEventListener('resize', this.onWindowResize);
          }, 300);
        }
      });
    },
    
    // 处理表格滚动事件
    handleTableScroll(event) {
      if (!this.$refs.table || !this.$refs.table.$el) return;
      
      const tableEl = this.$refs.table.$el;
      const fixedRightTable = tableEl.querySelector('.el-table__fixed-right');
      const fixedBodyWrappers = tableEl.querySelectorAll('.el-table__fixed-right .el-table__fixed-body-wrapper');
      
      if (fixedBodyWrappers && fixedBodyWrappers.length > 0) {
        const scrollTop = event.target.scrollTop;
        
        // 同步所有固定列的垂直滚动位置
        fixedBodyWrappers.forEach(wrapper => {
          if (wrapper.scrollTop !== scrollTop) {
            wrapper.scrollTop = scrollTop;
          }
        });
        
        // 确保固定列的高度与主表格一致
        if (fixedRightTable) {
          const tableHeight = tableEl.offsetHeight;
          const headerHeight = tableEl.querySelector('.el-table__header-wrapper')?.offsetHeight || 0;
          
          // 调整固定列容器高度，确保与主表格对齐
          fixedRightTable.style.height = tableHeight + 'px';
          
          fixedBodyWrappers.forEach(wrapper => {
            // 设置固定列主体容器高度
            wrapper.style.height = (tableHeight - headerHeight) + 'px';
            wrapper.style.top = headerHeight + 'px';
          });
        }
      }
    },
    
    // 监听窗口大小变化
    onWindowResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.recalculateTableLayout();
      }, 200);
    },
    
    // 移除滚动事件监听器
    removeScrollListener() {
      if (this.tableBodyWrapper) {
        this.tableBodyWrapper.removeEventListener('scroll', this.handleTableScroll);
        this.tableBodyWrapper = null;
      }
      
      window.removeEventListener('resize', this.onWindowResize);
    },
    
    // 在窗口大小变化时重新计算表格布局
    recalculateTableLayout() {
      if (this.$refs.table) {
        this.$refs.table.doLayout();
        
        this.$nextTick(() => {
          // 强制同步固定列尺寸
          if (this.tableBodyWrapper) {
            this.handleTableScroll({ target: this.tableBodyWrapper });
          }
        });
      }
    }
  },
  mounted() {
    // 在组件挂载后验证数据
    this.$nextTick(() => {
      if (!this.validateColumns()) {
        console.warn('TableContent: 无效的列配置', this.columns);
      }
      
      // 监听表格滚动事件，修复固定列同步问题
      this.fixTableScrollSync();
    });
  },
  beforeDestroy() {
    // 移除事件监听器
    this.removeScrollListener();
  }
}
</script>

<style lang="scss" scoped>
.table-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative; /* 确保能够正确定位子元素 */
  
  ::v-deep .el-table {
    flex: 1;
    height: 100% !important; /* 确保表格填满容器 */
    width: 100%;
    table-layout: fixed;
    
    .el-table__header th {
      background-color: #f5f7fa;
      color: #333333;
      font-weight: bold;
    }
    
    .el-table__row:hover > td {
      background-color: #e6f7fa;
    }
    
    // 自定义表头颜色
    thead {
      color: #333333;
      th {
        background-color: #f5f7fa;
      }
    }
    
    // 调整单元格内边距
    td, th {
      padding: 6px 0;
    }
    
    // 确保表格内容可滚动
    .el-table__body-wrapper {
      overflow-x: auto !important;
      overflow-y: auto !important;
    }
    
    // 确保操作列内容不换行，在一行显示
    .operation-container {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      overflow: visible;
      width: 100%;
      max-width: 100%;
      
      .el-button {
        padding: 4px 6px;
        margin-left: 2px;
        margin-right: 2px;
        flex-shrink: 0;
        font-size: 12px;
        
        &:first-child {
          margin-left: 0;
        }
        
        &:last-child {
          margin-right: 0;
        }
        
        // 图标按钮样式优化
        &.is-circle {
          padding: 4px;
        }
        
        // 确保文本较长的按钮不会导致文本被截断
        span {
          display: inline-block;
          white-space: nowrap;
        }
      }
    }
    
    // 固定列样式优化
    .el-table__fixed-right {
      height: 100% !important; // 确保固定列高度与主表格一致
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      right: 0 !important;
      
      .el-table__fixed-body-wrapper {
        overflow: hidden !important; // 防止出现滚动条
        position: absolute !important; // 使用绝对定位确保正确位置
      }
      
      // 操作列特殊样式
      .operation-column {
        background-color: #fff;
      }
      
      // 修复固定列中表格行高度不一致问题
      .el-table__row {
        height: 100%;
      }
    }
    
    // 修复固定列错位问题
    .el-table__body {
      width: 100% !important;
      table-layout: fixed !important;
    }
    
    .el-table__header-wrapper,
    .el-table__fixed-header-wrapper {
      z-index: 2; // 确保表头在滚动时不被覆盖
    }
    
    // 确保行高一致
    .el-table__row {
      height: 100%;
      
      td {
        box-sizing: border-box;
        height: inherit;
        
        .cell {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  
  .empty-block {
    padding: 32px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .empty-text {
      color: #999;
      font-size: 14px;
    }
  }
  
  .table-loading-placeholder {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    
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
          
          .loading-bar-sm {
            height: 14px;
            width: 60%;
            background: #f2f2f2;
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