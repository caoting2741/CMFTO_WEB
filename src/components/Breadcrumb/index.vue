<template>
  <div class="breadcrumb-container">
    <div class="breadcrumb-left">
      <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
            <span v-if="item.redirect === 'noRedirect' || index == levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
            <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div class="page-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp';

export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return;
      }
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const first = matched[0];

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched);
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  padding: 0 20px;
  border-radius: 4px;
  margin: 10px 15px;
  position: relative;
  z-index: 9;
}

.breadcrumb-left {
  display: flex;
  align-items: center;
}

.page-actions {
  display: flex;
  align-items: center;
  
  :deep(.el-button) {
    margin-left: 10px;
  }
}

.app-breadcrumb.el-breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #5a5e66;
    cursor: text;
    font-weight: 500;
  }

  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #067288;
      
      &.is-link {
        font-weight: normal;
        &:hover {
          color: #067288;
          text-decoration: underline;
        }
      }
    }
    
    &:last-child {
      .el-breadcrumb__inner {
        color: #5a5e66;
        font-weight: 500;
      }
    }
  }
}
</style> 