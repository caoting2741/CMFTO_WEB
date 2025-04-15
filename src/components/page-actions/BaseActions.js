/**
 * 页面操作按钮基础组件
 * 提供通用功能和属性
 */
export default {
  props: {
    // 操作列表，用于控制显示哪些按钮
    actions: {
      type: Array,
      default: () => []
    },
    // 权限控制
    permissions: {
      type: Object,
      default: () => ({})
    },
    // 按钮文本配置
    texts: {
      type: Object,
      default: () => ({})
    },
    // 按钮图标配置
    icons: {
      type: Object,
      default: () => ({})
    },
    // 按钮类型配置
    types: {
      type: Object,
      default: () => ({})
    },
    // 按钮禁用状态
    disabled: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 获取按钮是否显示
    showButton() {
      return (action) => {
        // 检查操作是否在列表中
        if (!this.actions.includes(action)) return false
        
        // 检查权限
        const permission = this.permissions[action]
        if (permission && !this.$store.getters.hasPermission(permission)) {
          return false
        }
        
        return true
      }
    },
    // 获取按钮文本
    buttonText() {
      return (action, defaultText) => {
        return this.texts[action] || defaultText
      }
    },
    // 获取按钮图标
    buttonIcon() {
      return (action, defaultIcon) => {
        return this.icons[action] || defaultIcon
      }
    },
    // 获取按钮类型
    buttonType() {
      return (action, defaultType) => {
        return this.types[action] || defaultType
      }
    },
    // 获取按钮是否禁用
    buttonDisabled() {
      return (action) => {
        return this.disabled[action] || false
      }
    }
  }
} 