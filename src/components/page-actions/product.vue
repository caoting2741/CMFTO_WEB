<template>
  <div class="page-actions">
    <el-button v-if="showButton('create')" :type="buttonType('create', 'primary')"
      :icon="buttonIcon('create', 'el-icon-plus')" :disabled="buttonDisabled('create')" @click="handleAction('create')">
      {{ buttonText('create', '创建') }}
    </el-button>

    <el-button v-if="showButton('batchDelete')" :type="buttonType('batchDelete', 'danger')"
      :icon="buttonIcon('batchDelete', 'el-icon-delete')" :disabled="buttonDisabled('batchDelete')"
      @click="handleAction('batchDelete')">
      {{ buttonText('batchDelete', '批量删除') }}
    </el-button>
  </div>
</template>

<script>
import BaseActions from './BaseActions'
import EventBus, { PAGE_ACTION_EVENTS } from '@/utils/event-bus'

export default {
  name: 'ProductPageActions',
  extends: BaseActions,
  data() {
    return {
      selectedCount: 0
    }
  },
  created() {
    // 监听表格选择变化事件，使用直接的字符串常量
    EventBus.$on('selection_change', this.handleSelectionChange)
  },
  beforeDestroy() {
    // 移除事件监听，使用直接的字符串常量
    EventBus.$off('selection_change', this.handleSelectionChange)
  },
  computed: {
    // Override the computed property with a new computed property
    buttonDisabled() {
      return (action) => {
        if (action === 'batchDelete') {
          // 当没有选中项时禁用批量删除按钮
          return this.selectedCount === 0
        }
        
        // 调用父类方法的安全方式
        if (typeof BaseActions.computed?.buttonDisabled === 'function') {
          return BaseActions.computed.buttonDisabled.call(this)(action)
        }
        
        // 默认不禁用
        return false
      }
    }
  },
  methods: {
    handleAction(action) {
      // 根据不同操作触发不同事件
      switch (action) {
        case 'create':
          EventBus.$emit(PAGE_ACTION_EVENTS.PRODUCT_CREATE)
          break     
        case 'batchDelete':
          EventBus.$emit(PAGE_ACTION_EVENTS.PRODUCT_BATCH_DELETE)
          break
      }
    },
    // 处理表格选择变化
    handleSelectionChange(data) {
      // 检查数据类型
      if (data.type === 'product') {
        this.selectedCount = data.count
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>