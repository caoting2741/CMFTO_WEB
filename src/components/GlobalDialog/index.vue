<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="handleClose"
    :top="top"
    :append-to-body="appendToBody"
    :custom-class="customClass"
  >
    <!-- 弹框内容插槽 -->
    <slot></slot>
    
    <!-- 弹框底部按钮插槽 -->
    <div slot="footer" class="dialog-footer" v-if="showFooter">
      <slot name="footer">
        <el-button @click="handleCancel">{{ cancelButtonText }}</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">{{ confirmButtonText }}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'GlobalDialog',
  props: {
    // 弹框标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示弹框
    visible: {
      type: Boolean,
      default: false
    },
    // 弹框宽度
    width: {
      type: String,
      default: '50%'
    },
    // 是否显示底部
    showFooter: {
      type: Boolean,
      default: true
    },
    // 取消按钮文本
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    // 确认按钮文本
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    // 确认按钮加载状态
    confirmLoading: {
      type: Boolean,
      default: false
    },
    // 是否可以点击模态框关闭
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 是否可以按ESC关闭
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    // 弹框距顶部距离
    top: {
      type: String,
      default: '15vh'
    },
    // 是否插入到body元素上
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
      if (!val) {
        this.$emit('close')
      }
    }
  },
  methods: {
    // 关闭弹框前的回调
    handleClose(done) {
      this.$emit('before-close')
      done()
    },
    // 取消按钮点击事件
    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    // 确认按钮点击事件
    handleConfirm() {
      this.$emit('confirm')
    },
    // 打开弹框方法
    open() {
      this.dialogVisible = true
      this.$emit('open')
    },
    // 关闭弹框方法
    close() {
      this.dialogVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}

/deep/ .el-dialog {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  .el-dialog__header {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    position: relative;
    
    // 添加标题前的竖线
    .el-dialog__title {
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background-color: #067288; // 主题色，可以根据需要调整
        border-radius: 2px;
      }
    }
  }
  
  .el-dialog__body {
    padding: 20px;
  }
  
  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>