<template>
  <div class="page-actions">
    <el-button 
      v-if="showButton('back')" 
      :type="buttonType('back', 'primary')" 
      :icon="buttonIcon('back', 'el-icon-back')" 
      :disabled="buttonDisabled('back')"
      @click="handleAction('back')"
    >
      {{ buttonText('back', '返回') }}
    </el-button>   
    
  </div>
</template>

<script>
import BaseActions from './BaseActions'
import EventBus from '@/utils/event-bus'

export default {
  name: 'ProductDetailPageActions',
  extends: BaseActions,
  methods: {
    handleAction(action) {
      // 获取当前产品ID
      const productId = this.$route.params.id
      
      // 根据不同操作触发不同事件
      switch(action) {
        case 'back':
          EventBus.$emit('product-detail:back', productId)
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