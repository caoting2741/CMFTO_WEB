<template>
  <div class="search-header">
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form" ref="searchForm">
        <slot name="before-search-items"></slot>
        
        <el-form-item 
          v-for="(item, index) in searchItems" 
          :key="index"
          :label="item.label" 
          :prop="item.prop"
        >
          <!-- 输入框 -->
          <el-input 
            v-if="item.type === 'input'" 
            v-model="searchForm[item.prop]" 
            :placeholder="item.placeholder || '请输入' + item.label" 
            clearable
            @keyup.enter.native="handleSearch"
          ></el-input>
          
          <!-- 选择框 -->
          <el-select 
            v-else-if="item.type === 'select'" 
            v-model="searchForm[item.prop]" 
            :placeholder="item.placeholder || '请选择' + item.label" 
            clearable
            style="width: 100%"
          >
            <el-option 
              v-for="option in item.options" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value"
            ></el-option>
          </el-select>
          
          <!-- 日期选择 -->
          <el-date-picker 
            v-else-if="item.type === 'date'" 
            v-model="searchForm[item.prop]" 
            :type="item.dateType || 'date'" 
            :placeholder="item.placeholder || '请选择' + item.label" 
            style="width: 100%"
          ></el-date-picker>
          
          <!-- 日期范围 -->
          <el-date-picker 
            v-else-if="item.type === 'daterange'" 
            v-model="searchForm[item.prop]" 
            type="daterange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期" 
            style="width: 100%"
          ></el-date-picker>
          
          <!-- 自定义插槽 -->
          <slot v-else :name="'search-item-' + item.prop" :item="item"></slot>
        </el-form-item>

        <slot name="after-search-items"></slot>
        
        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <slot name="search-buttons"></slot>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="operation-buttons">
      <slot name="operation-buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchHeader',
  props: {
    // 搜索项配置
    searchItems: {
      type: Array,
      default: () => []
    },
    // 搜索表单值
    searchModel: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchForm: { ...this.searchModel }
    }
  },
  watch: {
    searchModel: {
      handler(val) {
        this.searchForm = { ...val }
      },
      deep: true
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.$emit('search', this.searchForm)
    },
    // 重置
    handleReset() {
      this.$refs.searchForm.resetFields()
      // 重置后，需要将表单中未在 searchItems 中定义的字段也清空
      const formData = {}
      this.searchItems.forEach(item => {
        formData[item.prop] = undefined
      })
      this.searchForm = { ...formData }
      this.$emit('reset', formData)
    },
    // 获取搜索表单值
    getSearchForm() {
      return { ...this.searchForm }
    },
    // 设置搜索表单值
    setSearchForm(form) {
      this.searchForm = { ...this.searchForm, ...form }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-header {
  background-color: #fff;
  padding: 10px 16px 6px;
  margin: 0px 16px 10px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .search-section {
    flex: 1;
  }
  
  .search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    
    .el-form-item {
      margin-right: 16px;
      margin-bottom: 6px;
      width: auto;
      min-width: 220px;
      
      &:last-child {
        margin-right: 0;
      }
      
      .el-input,
      .el-select,
      .el-date-picker {
        width: 100%;
      }
    }
    
    .search-buttons {
      min-width: auto;
      display: flex;
      
      .el-button {
        margin-left: 0;
        margin-right: 8px;
        
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  
  .operation-buttons {
    display: flex;
    white-space: nowrap;
    margin-left: 16px;
    
    .el-button {
      margin-left: 8px;
    }
  }
}

.el-button--primary {
  background-color: #067288;
  border-color: #067288;
  
  &:hover, &:focus {
    background-color: #0099b9;
    border-color: #0099b9;
  }
  
  &:active {
    background-color: rgb(6, 64, 74);
    border-color: rgb(6, 64, 74);
  }
}
</style> 