<template>
  <el-form ref="form" :model="formData" :rules="rules" :label-width="labelWidth" :label-position="labelPosition"
    :inline="inline" :size="size" :disabled="disabled" :validate-on-rule-change="validateOnRuleChange"
    :hide-required-asterisk="hideRequiredAsterisk" :status-icon="statusIcon" @submit.native.prevent>
    <!-- 遍历渲染表单项 -->
    <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label" :prop="item.prop"
       :rules="item.rules" :error="item.error" :show-message="item.showMessage !== false"
      :label-width="item.labelWidth" :class="[item.className, { 'is-required': item.required }]">
      <!-- 标签提示信息 -->
      <template #label v-if="item.tooltip">
        <span class="form-item-label-with-tooltip">
          {{ item.label }}
          <el-tooltip :content="item.tooltip" placement="top" effect="light">
            <i class="el-icon-question tooltip-icon"></i>
          </el-tooltip>
        </span>
      </template>

      <!-- 输入框 -->
      <el-input v-if="item.type === 'input' || !item.type" v-model="formData[item.prop]"
        :type="item.inputType || 'text'" :placeholder="item.placeholder || `请输入${item.label}`"
        :disabled="item.disabled || disabled" :readonly="item.readonly" :clearable="item.clearable !== false"
        :maxlength="item.maxlength" :prefix-icon="item.prefixIcon" :suffix-icon="item.suffixIcon"
        :show-password="item.showPassword" :show-word-limit="item.showWordLimit"
        @change="(val) => handleInputChange(val, item)" @clear="() => handleInputClear(item)"
        ></el-input>

      <!-- 带单位的输入框 -->
      <div v-else-if="item.type === 'input-with-unit'" class="input-with-unit">
        <el-input v-model="formData[item.prop]" :placeholder="item.placeholder || `请输入${item.label}`"
          :disabled="item.disabled || disabled" :readonly="item.readonly" :clearable="item.clearable !== false"
          @change="(val) => handleInputChange(val, item)" @clear="() => handleInputClear(item)">
          <template #append>
            <span>{{ item.unit }}</span>
          </template>
        </el-input>
      </div>

      <!-- 选择框 -->
      <el-select v-else-if="item.type === 'select'" v-model="formData[item.prop]"
        :placeholder="item.placeholder || `请选择${item.label}`" :disabled="item.disabled || disabled"
        :multiple="item.multiple" :clearable="item.clearable !== false" :collapse-tags="item.collapseTags"
        style="width: 100%" @change="(val) => handleSelectChange(val, item)">
        <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"
          :disabled="option.disabled"></el-option>
      </el-select>


      <!-- 单选框组 -->
      <el-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.prop]"
        :disabled="item.disabled || disabled" @change="(val) => handleRadioChange(val, item)" :size="item.size || size">
        <!-- 普通单选按钮 -->
        <template v-if="!item.buttonStyle">
          <el-radio v-for="option in item.options" :key="option.value" :label="option.value"
            :disabled="option.disabled">{{ option.label }}</el-radio>
        </template>

        <!-- 按钮样式的单选 -->
        <template v-else>
          <el-radio-button v-for="option in item.options" :key="option.value" :label="option.value"
            :disabled="option.disabled">{{ option.label }}</el-radio-button>
        </template>
      </el-radio-group>

      <!-- 复选框组 -->
      <el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="formData[item.prop]"
        :disabled="item.disabled || disabled" @change="(val) => handleCheckboxChange(val, item)">
        <el-checkbox v-for="option in item.options" :key="option.value" :label="option.value"
          :disabled="option.disabled">{{
            option.label }}</el-checkbox>
      </el-checkbox-group>

      <!-- 开关 -->
      <el-switch v-else-if="item.type === 'switch'" v-model="formData[item.prop]" :disabled="item.disabled || disabled"
        :active-text="item.activeText" :inactive-text="item.inactiveText" :active-value="item.activeValue"
        :inactive-value="item.inactiveValue" @change="(val) => handleSwitchChange(val, item)"></el-switch>

      <!-- 日期选择器 -->
      <el-date-picker v-else-if="item.type === 'date'" v-model="formData[item.prop]" :type="item.dateType || 'date'"
        :placeholder="item.placeholder || `请选择${item.label}`" :disabled="item.disabled || disabled"
        :clearable="item.clearable !== false" :value-format="item.valueFormat" :format="item.format" style="width: 100%"
        @change="(val) => handleDateChange(val, item)"></el-date-picker>

      <!-- 日期范围选择器 -->
      <el-date-picker v-else-if="item.type === 'daterange'" v-model="formData[item.prop]" type="daterange"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :disabled="item.disabled || disabled"
        :clearable="item.clearable !== false" :value-format="item.valueFormat" :format="item.format" style="width: 100%"
        @change="(val) => handleDateRangeChange(val, item)"></el-date-picker>

      <!-- 数字输入框 -->
      <el-input-number v-else-if="item.type === 'number'" v-model="formData[item.prop]" :min="item.min" :max="item.max"
        :step="item.step || 1" :precision="item.precision" :disabled="item.disabled || disabled"
        :controls="item.controls !== false" style="width: 100%"
        @change="(val) => handleNumberChange(val, item)"></el-input-number>

      <!-- 文本域 -->
      <el-input v-else-if="item.type === 'textarea'" v-model="formData[item.prop]" type="textarea"
        :rows="item.rows || 3" :placeholder="item.placeholder || `请输入${item.label}`"
        :disabled="item.disabled || disabled" :readonly="item.readonly" :maxlength="item.maxlength"
        :show-word-limit="item.showWordLimit" @change="(val) => handleInputChange(val, item)"></el-input>

      <!-- 没有输入是个点击按钮 -->
      <div v-else-if="item.type === 'input-button'" class="input-with-button">
        <el-button type="text" style="margin-left: 8px" @click="() => handleButtonClick(item)" icon="el-icon-plus"
          size="mini">{{ item.btnText }}</el-button>
      </div>

      <!-- 自定义插槽 -->
      <slot v-else :name="`form-item-${item.prop}`" :item="item"></slot>
    </el-form-item>

    <!-- 表单底部按钮区域 -->
    <el-form-item v-if="showFooter" class="form-footer">
      <slot name="footer">
        <el-button @click="handleReset">{{ resetButtonText }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ submitButtonText }}</el-button>
      </slot>
    </el-form-item>

    <!-- 自定义额外内容 -->
    <slot name="extra"></slot>
  </el-form>
</template>

<script>
export default {
  name: 'GlobalForm',
  props: {
    // 表单数据对象
    model: {
      type: Object,
      default: () => ({})
    },
    // 表单验证规则
    rules: {
      type: Object,
      default: () => ({})
    },
    // 表单项配置
    formItems: {
      type: Array,
      default: () => []
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: '100px'
    },
    // 标签位置
    labelPosition: {
      type: String,
      default: 'right'
    },
    // 表单尺寸
    size: {
      type: String,
      default: 'mini'
    },
    // 是否禁用表单
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否行内表单
    inline: {
      type: Boolean,
      default: false
    },
    // 是否显示底部按钮
    showFooter: {
      type: Boolean,
      default: true
    },
    // 重置按钮文本
    resetButtonText: {
      type: String,
      default: '重置'
    },
    // 提交按钮文本
    submitButtonText: {
      type: String,
      default: '提交'
    },
    // 提交按钮加载状态
    submitLoading: {
      type: Boolean,
      default: false
    },
    // 是否隐藏必填字段的星号
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    // 是否显示校验错误信息图标
    statusIcon: {
      type: Boolean,
      default: false
    },
    // 是否在rules属性改变后立即触发一次验证
    validateOnRuleChange: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formData: { ...this.model }
    }
  },
  watch: {
    model: {
      handler(val) {
        this.formData = { ...val }
      },
      deep: true
    }
  },
  methods: {
    // 重置表单
    handleReset() {
      this.$refs.form.resetFields()
      this.$emit('reset')
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        } else {
          this.$emit('validate-error')
          return false
        }
      })
    },
    // 验证表单
    validate(callback) {
      return this.$refs.form.validate(callback)
    },
    // 验证表单指定字段
    validateField(props, callback) {
      return this.$refs.form.validateField(props, callback)
    },
    // 重置表单指定字段
    resetFields() {
      this.$refs.form.resetFields()
    },
    // 移除表单校验结果
    clearValidate(props) {
      this.$refs.form.clearValidate(props)
    },
    // 获取表单数据
    getFormData() {
      return this.formData
    },
    // 设置表单数据
    setFormData(data) {
      this.formData = { ...this.formData, ...data }
    },
    // 输入框变化事件
    handleInputChange(val, item) {
      this.$emit('input-change', val, item.prop, item)
    },
    // 选择框变化事件
    handleSelectChange(val, item) {
      this.$emit('select-change', val, item.prop, item)
    },
    // 单选框变化事件
    handleRadioChange(val, item) {
      this.$emit('radio-change', val, item.prop, item)
    },
    // 复选框变化事件
    handleCheckboxChange(val, item) {
      this.$emit('checkbox-change', val, item.prop, item)
    },
    // 开关变化事件
    handleSwitchChange(val, item) {
      this.$emit('switch-change', val, item.prop, item)
    },
    // 日期变化事件
    handleDateChange(val, item) {
      this.$emit('date-change', val, item.prop, item)
    },
    // 日期范围变化事件
    handleDateRangeChange(val, item) {
      this.$emit('date-range-change', val, item.prop, item)
    },
    // 数字变化事件
    handleNumberChange(val, item) {
      this.$emit('number-change', val, item.prop, item)
    },
    // 按钮点击事件
    handleButtonClick(item) {
      this.$emit('button-click', item)
    },
    // 输入框清除事件
    handleInputClear(item) {
      this.$nextTick(() => {
        // 手动清除该字段的验证
        this.$refs.form.clearValidate(item.prop);
      });
      this.$emit('input-clear', item.prop, item);
    }
  }
}
</script>

<style lang="scss" scoped>
.form-footer {
  margin-top: 20px;
  text-align: right;
}

.form-item-label-with-tooltip {
  display: inline-flex;
  align-items: center;

  .tooltip-icon {
    margin-left: 2px;
    margin-top: -2px;
    font-size: 13px;
    color: #909399;
    cursor: pointer;
    font-weight: normal;

    &:hover {
      color: #067288;
    }
  }
}

// 添加单选框选中时的文字颜色样式
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #333 !important; // 使用与单选框圆圈相同的红色
}

// 如果需要修改单选框圆圈的颜色（如果当前不是您想要的红色）
:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #F56C6C !important;
  background: #F56C6C !important;
}

// 添加鼠标悬停时的样式
:deep(.el-radio) {
  &:hover {
    .el-radio__inner {
      border-color: #F56C6C !important;
    }

    .el-radio__label {
      color: #F56C6C !important;
    }
  }
}

// 修复错误信息被遮挡的问题
:deep(.el-form-item) {
  margin-bottom: 22px; // 增加表单项之间的间距

  .el-form-item__error {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10; // 提高错误信息的层级
    padding-top: 2px;
    line-height: 1.2;
    white-space: normal; // 允许错误信息换行
    max-width: 100%; // 限制错误信息宽度
    font-size: 10px; // 减小错误提示字体大小
  }
}

// 对于文本域类型的表单项，增加更多的底部间距
:deep(.el-form-item .el-textarea) {
  &+.el-form-item__error {
    top: calc(100% + 2px);
  }
}

::v-deep .el-form-item {
  /* 模拟Element UI的required标记 */
  &.is-required .el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
}
</style>