<template>
  <div class="slide-verify-container">
    <div 
      class="slide-verify-bar" 
      :class="{ 'success': isPass }"
      ref="slideBar"
    >
      <div class="slide-verify-track">
        <span v-if="!isPass">{{ text }}</span>
        <span v-else>{{ successText }}</span>
      </div>
      <div 
        class="slide-verify-btn"
        :class="{ 'success': isPass }"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
        :style="{ left: isPass ? 'auto' : btnLeft + 'px' }"
      >
        <i class="el-icon-d-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideVerify',
  props: {
    // 提示文字
    text: {
      type: String,
      default: '向右滑动完成验证'
    },
    // 成功提示文字
    successText: {
      type: String,
      default: '验证通过'
    }
  },
  data() {
    return {
      isMoving: false,
      startX: 0,
      btnLeft: 0,
      isPass: false,
      containerWidth: 0,
      sliderWidth: 40
    }
  },
  computed: {
    maxLeft() {
      return this.containerWidth - this.sliderWidth;
    }
  },
  mounted() {
    // 组件挂载后计算容器宽度
    this.$nextTick(() => {
      if (this.$refs.slideBar) {
        this.containerWidth = this.$refs.slideBar.clientWidth;
      }
    });
  },
  methods: {
    handleMouseDown(e) {
      if (this.isPass) return;
      this.isMoving = true;
      this.startX = e.clientX;
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
      // 阻止默认事件和冒泡
      e.preventDefault();
      e.stopPropagation();
    },
    handleMouseMove(e) {
      if (!this.isMoving) return;
      const moveX = e.clientX - this.startX;
      this.handleMove(moveX);
    },
    handleMouseUp() {
      this.isMoving = false;
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
      
      // 判断是否验证成功
      if (this.btnLeft >= this.maxLeft - 2) {
        this.isPass = true;
        this.$emit('success');
      } else {
        // 未成功，复位
        this.reset();
      }
    },
    // 触摸事件处理
    handleTouchStart(e) {
      if (this.isPass) return;
      this.isMoving = true;
      this.startX = e.touches[0].clientX;
      document.addEventListener('touchmove', this.handleTouchMove);
      document.addEventListener('touchend', this.handleTouchEnd);
      // 阻止默认事件和冒泡
      e.preventDefault();
      e.stopPropagation();
    },
    handleTouchMove(e) {
      if (!this.isMoving) return;
      const moveX = e.touches[0].clientX - this.startX;
      this.handleMove(moveX);
      // 阻止页面滚动
      e.preventDefault();
    },
    handleTouchEnd() {
      this.isMoving = false;
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchend', this.handleTouchEnd);
      
      // 判断是否验证成功
      if (this.btnLeft >= this.maxLeft - 2) {
        this.isPass = true;
        this.$emit('success');
      } else {
        // 未成功，复位
        this.reset();
      }
    },
    // 处理移动
    handleMove(moveX) {
      let newLeft = this.btnLeft + moveX;
      if (newLeft < 0) {
        newLeft = 0;
      } else if (newLeft > this.maxLeft) {
        newLeft = this.maxLeft;
      }
      this.btnLeft = newLeft;
      this.startX = this.startX + moveX;
    },
    // 重置
    reset() {
      this.btnLeft = 0;
      this.isPass = false;
      this.isMoving = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-verify-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.slide-verify-bar {
  position: relative;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  overflow: hidden;
  
  &.success {
    border-color: #0b748b;
    background-color: #f0f9eb;
  }
}

.slide-verify-track {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-left: 0;
  box-sizing: border-box;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #909399;
  
  span {
    position: relative;
    z-index: 9;
  }
}

.slide-verify-btn {
  position: absolute;
  width: 40px;
  height: 38px;
  top: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b748b;
  font-size: 20px;
  z-index: 10;
  
  &.success {
    background-color: #0b748b;
    color: white;
    right: 0;
    left: auto;
  }
}
</style> 