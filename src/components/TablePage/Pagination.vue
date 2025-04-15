<template>
  <div class="pagination-container">
    <div class="pagination-wrapper">
      <div class="range-info">
        第 <span class="highlight">{{ startIndex }}-{{ endIndex }}</span> 条 / 总共 <span class="highlight">{{ total }}</span> 条
      </div>
      
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        :pager-count="6"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :disabled="disabled"
        :hide-on-single-page="hideOnSinglePage"
      >
      </el-pagination>
      
      <div v-if="showTotal" class="pagination-total">
        共 <span class="pagination-total-count">{{ total }}</span> 条记录
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
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
    // 是否使用背景色
    background: {
      type: Boolean,
      default: true
    },
    // 组件布局
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper'
    },
    // 每页条数选项
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100]
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 总条数少于一页时是否隐藏
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    // 是否显示总条数
    showTotal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: this.page,
      pageSize: this.limit
    }
  },
  computed: {
    // 计算当前页的起始索引
    startIndex() {
      if (this.total === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    // 计算当前页的结束索引
    endIndex() {
      if (this.total === 0) return 0;
      return Math.min(this.currentPage * this.pageSize, this.total);
    }
  },
  watch: {
    page(val) {
      this.currentPage = val
    },
    limit(val) {
      this.pageSize = val
    }
  },
  methods: {
    // 页码变化事件
    handleCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('pagination', { page: val, limit: this.pageSize })
    },
    // 每页条数变化事件
    handleSizeChange(val) {
      this.$emit('update:limit', val)
      this.$emit('pagination', { page: this.currentPage, limit: val })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 10px 0;
  background-color: transparent;
  text-align: center;
  border-radius: 0;
  margin: 0;
  
  .pagination-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: 0;
    border-radius: 4px;
    box-shadow: none;
  }
  
  .range-info {
    margin-right: 20px;
    color: #606266;
    font-size: 13px;
    
    .highlight {
      color: #067288;
      font-weight: bold;
    }
  }
  
  .el-pagination {
    padding: 0;
    
    ::v-deep {
      .el-pagination__sizes {
        margin-right: 16px;
        
        .el-select .el-input.is-focus .el-input__inner,
        .el-select:hover .el-input__inner {
          border-color: #067288 !important;
        }
        
        .el-select-dropdown__item.selected {
          color: #067288 !important;
        }
      }
      
      .el-input__inner:focus {
        border-color: #067288 !important;
      }
      
      .btn-prev, .btn-next {
        padding: 0 10px;
        border-radius: 4px;
        min-width: 32px;
      }
      
      .el-pager li {
        border-radius: 4px;
        min-width: 32px;
        
        &.active {
          background-color: #067288 !important;
          color: #fff;
        }
        
        &:hover {
          color: #067288;
        }
      }
      
      // 页码输入框
      .el-pagination__jump .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
  }
  
  .pagination-total {
    margin-left: 16px;
    color: #666;
    font-size: 14px;
    
    .pagination-total-count {
      color: #067288;
      font-weight: bold;
      margin: 0 4px;
    }
  }
}

// 注入全局样式
::v-deep {
  // 确保下拉列表使用正确的主题色
  .el-select-dropdown__item.selected {
    color: #067288 !important;
  }
  
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: rgba(6, 114, 136, 0.1) !important;
  }
}
</style> 