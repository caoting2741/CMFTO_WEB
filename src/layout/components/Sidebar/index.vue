<template>
  <div class="sidebar-container has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import variables from '@/assets/styles/variables.scss'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    routes() {
      // 实际项目中从vuex或路由中获取
      return [
        {
          path: '/dashboard',
          meta: { title: '首页', icon: 'el-icon-s-home' }
        },
        {
          path: '/product',
          meta: { title: '产品管理', icon: 'el-icon-s-goods' },
          children: [
            {
              path: '/product/list',
              meta: { title: '产品列表' }
            }
          ]
        },
        {
          path: '/device',
          meta: { title: '设备管理', icon: 'el-icon-cpu' },
          children: [
            {
              path: '/device/list',
              meta: { title: '设备列表' }
            }
          ]
        },
        {
          path: '/data-forward',
          meta: { title: '数据转发', icon: 'el-icon-connection' },
          children: [
            {
              path: '/data-forward/index',
              meta: { title: '转发配置' }
            }
          ]
        },
        {
          path: '/params',
          meta: { title: '参数设置', icon: 'el-icon-setting' },
          children: [
            {
              path: '/params/index',
              meta: { title: '参数配置' }
            }
          ]
        },
        {
          path: '/log',
          meta: { title: '日志管理', icon: 'el-icon-document' },
          children: [
            {
              path: '/log/cloud',
              meta: { title: '云端运行日志' }
            },
            {
              path: '/log/audit',
              meta: { title: '审计日志' }
            },
            {
              path: '/log/trace',
              meta: { title: '审计追踪' }
            }
          ]
        },
        {
          path: '/system',
          meta: { title: '系统管理', icon: 'el-icon-s-tools' },
          children: [
            {
              path: '/system/user',
              meta: { title: '用户管理' }
            },
            {
              path: '/system/role',
              meta: { title: '角色管理' }
            },
            {
              path: '/system/menu',
              meta: { title: '菜单管理' }
            }
          ]
        }
      ]
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.sidebar-container {
  background-color: $menuBg;
  height: 100%;
  
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  
  .el-scrollbar {
    height: 100%;
  }
  
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
  
  // 完全替换子菜单箭头，使用实心三角形
  ::v-deep .el-submenu__icon-arrow {
    // 隐藏原来的字体图标箭头
    &:before {
      content: '' !important;
      display: none !important;
    }
    
    // 创建新的实心三角形
    width: 0 !important;
    height: 0 !important;
    border-style: solid;
    border-width: 6px 6px 0 6px;
    border-color: #fff transparent transparent transparent;
    margin-top: -3px;
    right: 15px;
    transform-origin: center 3px;
    transition: transform 0.3s;
  }
  
  // 展开状态箭头朝上
  ::v-deep .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(180deg);
  }
  
  // 收起菜单时，箭头指向左侧
  &.el-menu--vertical {
    ::v-deep .el-submenu__icon-arrow {
      border-width: 6px 6px 6px 0;
      border-color: transparent #fff transparent transparent;
      transform: none;
    }
    
    ::v-deep .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
      transform: rotateZ(180deg);
    }
  }
  
  // 修改菜单激活状态的竖条颜色
  ::v-deep .el-menu-item.is-active,
  ::v-deep .el-submenu.is-active > .el-submenu__title {  
    
    // 确保激活文字颜色也一致
    color: #067288 !important;
    border-right: none !important;
  }
  
  // 修改右侧的橙色竖条 - 仅对最终菜单项（无子菜单的菜单项）显示
  ::v-deep .el-menu-item.is-active {
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background-color: rgb(255, 176, 43);
      transition: all 0.3s;
    }
  }
  
  // 移除默认的边框样式
  ::v-deep .el-menu-item.is-active {
    border-right: none !important;
    background-color: rgba(6, 114, 136, 0.1) !important;
  }
  
  // 收缩后菜单项居中
  .el-menu--collapse {
    .el-menu-item {
      text-align: center;
      padding: 0 !important;
    }
    
    .el-submenu > .el-submenu__title {
      text-align: center;
      padding: 0 !important;
      
      .el-submenu__icon-arrow {
        display: none;
      }
      
      & > span {
        display: none;
      }
    }
  }
}

// 弹出的垂直菜单样式
::v-deep .el-menu--vertical {
  .el-submenu__icon-arrow {
    border-width: 6px 0 6px 6px !important;
    border-color: transparent transparent transparent #fff !important;
    right: 15px;
    margin-top: -6px;
  }
  
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    transform: rotateZ(90deg);
    margin-top: -6px;
  }
}
</style> 