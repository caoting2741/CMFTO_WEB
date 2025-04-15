import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

// 全局处理Element UI表格错误
const originalConsoleError = console.error;
console.error = function(...args) {
  // 捕获Element UI表格"prop"属性错误，不输出到控制台
  if (args[0] && typeof args[0] === 'string' && 
     (args[0].includes('Cannot read properties of null (reading \'prop\')') ||
      args[0].includes('ElTable'))) {
    return;
  }
  return originalConsoleError.apply(console, args);
};

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      // 确认用户是否已获取权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      
      if (hasRoles) {
        next();
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('user/getInfo');

          // 根据角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
          
          // 动态添加可访问路由
          router.addRoutes(accessRoutes);

          // 确保路由完整性, 使用 replace: true 可防止重定向循环
          next({ ...to, replace: true });
        } catch (error) {
          // 出错则重置Token并跳转登录页
          await store.dispatch('user/resetToken');
          Message.error(error.message || '验证失败，请重新登录');
          next('/login');
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page
      // 移除redirect参数，直接重定向到登录页面
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
}); 