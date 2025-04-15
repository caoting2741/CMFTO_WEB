const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  // 检查用户是否有特定权限
  hasPermission: state => permission => {
    const { roles } = state.user
    // 超级管理员拥有所有权限
    if (roles.includes('admin')) return true
    
    // 检查权限字符串
    if (state.user.permissions && state.user.permissions.includes(permission)) {
      return true
    }
    
    return false
  }
};

export default getters; 