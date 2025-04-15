<template>
  <div class="custom-descriptions">
    <el-descriptions
      :title="title"
      :column="column"
      :size="size"
      :border="border"
      :direction="direction"
      :colon="colon"
      :labelClassName="labelClassName"
      :contentClassName="contentClassName"
      :labelStyle="{ color: '#A8A9A8', ...labelStyle }"
      :contentStyle="{ color: '#333333', ...contentStyle }"
      :extra="extra"
    >
      <template v-if="$slots.title" #title>
        <slot name="title"></slot>
      </template>
      
      <template v-if="$slots.extra" #extra>
        <slot name="extra"></slot>
      </template>
      
      <el-descriptions-item 
        v-for="(item, index) in items" 
        :key="index"
        :label="item.label"
        :span="item.span"
        :labelClassName="item.labelClassName"
        :contentClassName="item.contentClassName"
        :labelStyle="item.labelStyle"
        :contentStyle="item.contentStyle"
      >
        <template v-if="item.value">{{ item.value }}</template>
        <template v-else-if="item.slot && $scopedSlots[item.slot]">
          <slot :name="item.slot" :row="item"></slot>
        </template>
        <template v-else>{{ item.default || '--' }}</template>
      </el-descriptions-item>
      
      <slot></slot>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: 'Descriptions',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 每行的列数
    column: {
      type: Number,
      default: 3
    },
    // 尺寸
    size: {
      type: String,
      default: ''
    },
    // 是否带边框
    border: {
      type: Boolean,
      default: false
    },
    // 排列方向
    direction: {
      type: String,
      default: 'horizontal'
    },
    // 是否显示冒号
    colon: {
      type: Boolean,
      default: true
    },
    // 自定义标签类名
    labelClassName: {
      type: String,
      default: ''
    },
    // 自定义内容类名
    contentClassName: {
      type: String,
      default: ''
    },
    // 自定义标签样式
    labelStyle: {
      type: Object,
      default: () => ({})
    },
    // 自定义内容样式
    contentStyle: {
      type: Object,
      default: () => ({})
    },
    // 描述项配置
    items: {
      type: Array,
      default: () => []
    },
    // 操作区文本
    extra: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-descriptions {
  :deep(.el-descriptions__header) {
    margin-bottom: 16px;
  }
  
  :deep(.el-descriptions__label) {
    font-weight: normal;
  }

  :deep(.el-descriptions__content) {
    font-weight: normal;
    word-break: break-all;
  }
  
  :deep(.el-descriptions-item__container) {
    margin-bottom: 12px;
  }
}
</style> 