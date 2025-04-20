<template>
  <div class="sidebar">
    <el-menu :default-active="defaultActive" class="func-menu" @select="handleMenuSelect">
      <el-menu-item v-for="item in menuList" :key="item.identifier" :index="item.identifier">
        <div class="item-content">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-identifier">{{ item.identifier }}</div>
        </div>
        <div class="menu-operations" v-if="item.identifier !== menuList[0].identifier">
          <el-tooltip content="编辑" placement="top">
            <i class="el-icon-edit" style="color:#067288" @click.stop="handleMenuEdit(item)"></i>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <i class="el-icon-delete" style="color:#ED3636" @click.stop="handleMenuDelete(item)"></i>
          </el-tooltip>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  props: {
    menuList: {
      type: Array,
      required: true
    },
    defaultActive: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleMenuSelect(index) {
      this.$emit('menu-select', index)
    },
    handleMenuEdit(item) {
      this.$emit('menu-edit', item)
    },
    handleMenuDelete(item) {
      this.$emit('menu-delete', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #e6e6e6;
  overflow: hidden;

  .func-menu {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f7fa;
    }

    .el-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 56px;
      line-height: normal;
      color: #303133 !important;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background-color: #F8F8F8;
      }

      &.is-active {
        color: #067288 !important;
        background-color: #F8F8F8 !important;
      }

      span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 10px;
      }

      .item-content {
        flex: 1;
        min-width: 0; // 关键：防止flex元素溢出
        overflow: hidden;

        .item-name {
          font-size: 14px;
          font-weight: 500;
          color: inherit;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-identifier {
          font-size: 12px;
          color: #909399;
          line-height: 1.4;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .menu-operations {
        display: none;
        gap: 8px;
        flex-shrink: 0;

        i {
          font-size: 14px;
          cursor: pointer;
        }
      }

      &:hover .menu-operations {
        display: flex;
      }
    }
  }
}
</style>