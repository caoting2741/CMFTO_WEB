<template>
  <div class="tab-view">
    <el-tabs size="small" v-model="activeTab" type="card" @tab-click="handleTabClick" class="custom-tabs">
      <el-tab-pane 
        v-for="(tab, index) in tabs" 
        :key="index"
        :label="tab.label"
        :name="tab.name"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabView',
  props: {
    // 标签页配置
    tabs: {
      type: Array,
      default: () => [],
      required: true
    },
    // 当前激活的标签页
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeTab: this.value || (this.tabs.length > 0 ? this.tabs[0].name : '')
    }
  },
  watch: {
    value(val) {
      this.activeTab = val
    },
    tabs: {
      handler(val) {
        if (val.length > 0 && !this.activeTab) {
          this.activeTab = val[0].name
        }
      },
      immediate: true
    }
  },
  methods: {
    // 标签点击事件
    handleTabClick(tab) {
      this.activeTab = tab.name
      this.$emit('input', tab.name)
      this.$emit('tab-click', tab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  
  .custom-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
    
    :deep(.el-tabs__item) {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      padding: 0 15px;
      
      &.is-active {
        color: #067288;
        border-bottom-color: #067288;
      }
      
      &:hover {
        color: #067288;
      }
    }
    
    &.el-tabs--card {
      :deep(.el-tabs__header) {
        //border-bottom: none;
      }
      
      :deep(.el-tabs__nav-wrap::after) {
        display: none;
      }
    }
    
    &:not(.el-tabs--card) {
      :deep(.el-tabs__active-bar) {
        background-color: #067288;
      }
    }
  }
  
  .tab-content {
    flex: 1;
    overflow: auto;
    padding: 16px 0;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>