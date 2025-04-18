<template>
  <div class="errPage-container">
    <div class="errPage-img">
      <img src="@/assets/404_images/403.png" alt="403">
    </div>
    <div class="errPage-content">
      <h1 class="errPage-title">403</h1>
      <h2 class="errPage-desc">抱歉，您无权访问该页面</h2>
      <div class="errPage-actions">
        <router-link :to="{ path: '/' }" class="errPage-btn">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page403',
  computed: {
    message() {
      return '抱歉，您无权访问该页面，请联系管理员'
    }
  }
}
</script>

<style lang="scss" scoped>
.errPage {
  &-container {
    width: 100%;
    height: 100%;
    background-color: #f0f2f5;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-img {
    max-width: 430px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: auto;
    }
  }

  &-content {
    text-align: center;
  }

  &-title {
    font-size: 72px;
    color: #434e59;
    margin: 0;
    line-height: 1.2;
  }

  &-desc {
    font-size: 20px;
    color: #777;
    margin: 20px 0 30px;
  }

  &-actions {
    margin-top: 30px;
  }

  &-btn {
    display: inline-block;
    padding: 12px 24px;
    background-color: #067288;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
    transition: background-color 0.3s;
    &:hover {
      background-color: darken(#067288, 10%);
    }
  }
}
</style> 