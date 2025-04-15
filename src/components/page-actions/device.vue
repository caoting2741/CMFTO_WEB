<template>
  <div class="page-actions">
    <el-button 
      v-if="showButton('create')" 
      :type="buttonType('create', 'primary')" 
      :icon="buttonIcon('create', 'el-icon-plus')" 
      :disabled="buttonDisabled('create')"
      @click="handleAction('create')"
    >
      {{ buttonText('create', '创建') }}
    </el-button>
    
    <el-button 
      v-if="showButton('import')" 
      :type="buttonType('import', 'info')" 
      :icon="buttonIcon('import', 'el-icon-upload2')" 
      :disabled="buttonDisabled('import')"
      @click="handleAction('import')"
    >
      {{ buttonText('import', '导入') }}
    </el-button>
    
    <el-button 
      v-if="showButton('export')" 
      :type="buttonType('export', 'success')" 
      :icon="buttonIcon('export', 'el-icon-download')" 
      :disabled="buttonDisabled('export')"
      @click="handleAction('export')"
    >
      {{ buttonText('export', '导出') }}
    </el-button>
    
    <el-button 
      v-if="showButton('batchDelete')" 
      :type="buttonType('batchDelete', 'danger')" 
      :icon="buttonIcon('batchDelete', 'el-icon-delete')" 
      :disabled="buttonDisabled('batchDelete')"
      @click="handleAction('batchDelete')"
    >
      {{ buttonText('batchDelete', '批量删除') }}
    </el-button>
  </div>
</template>

<script>
import BaseActions from './BaseActions'
import EventBus, { PAGE_ACTION_EVENTS } from '@/utils/event-bus'

export default {
  name: 'DevicePageActions',
  extends: BaseActions,
  methods: {
    handleAction(action) {
      // 根据不同操作触发不同事件
      switch(action) {
        case 'create':
          EventBus.$emit(PAGE_ACTION_EVENTS.DEVICE_CREATE)
          break
        case 'import':
          EventBus.$emit(PAGE_ACTION_EVENTS.DEVICE_IMPORT)
          break
        case 'export':
          EventBus.$emit(PAGE_ACTION_EVENTS.DEVICE_EXPORT)
          break
        case 'batchDelete':
          EventBus.$emit(PAGE_ACTION_EVENTS.DEVICE_BATCH_DELETE)
          break
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