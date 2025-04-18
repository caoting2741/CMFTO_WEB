import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/layout';

Vue.use(VueRouter);

// Routes that don't require authentication
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  // {
  //   path: '/403',
  //   component: () => import('@/views/error-page/403'),
  //   hidden: true
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
];

// Routes that require authentication and roles
export const asyncRoutes = [
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: { title: '产品管理', icon: 'product' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/list'),
        meta: { 
          title: '产品列表', 
          pageActionsConfig: {
            type: 'product',
            actions: ['create','batchDelete'],
            permissions: {
              create: 'product:create',             
              batchDelete: 'product:delete'
            }
          }
        }
      },
      {
        path: 'detail/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail'),
        meta: { 
          title: '产品详情', 
          activeMenu: '/product/list',
          pageActionsConfig: {
            type: 'product-detail',
            actions: ['back']
          }
        },
        hidden: true
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/list',
    name: 'Device',
    meta: { title: '设备管理', icon: 'device' },
    children: [
      {
        path: 'list',
        name: 'DeviceList',
        component: () => import('@/views/device/list'),
        meta: { 
          title: '设备列表',
          pageActionsConfig: {
            type: 'device',
            actions: ['create', 'import', 'export', 'batchDelete'],
            permissions: {
              create: 'device:create',
              import: 'device:import',
              export: 'device:export',
              batchDelete: 'device:delete'
            }
          }
        }
      },
      {
        path: 'detail/:id',
        name: 'DeviceDetail',
        component: () => import('@/views/device/detail'),
        meta: { 
          title: '设备详情', 
          activeMenu: '/device/list'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/data-forward',
    component: Layout,
    name: 'DataForward',
    redirect: '/data-forward/index',
    meta: { title: '数据转发', icon: 'forward' },
    children: [
      {
        path: 'index',
        name: 'ForwardIndex',
        component: () => import('@/views/data-forward/index'),
        meta: { title: '转发配置' }
      }
    ]
  },
  {
    path: '/params',
    component: Layout,
    name: 'Params',
    redirect: '/params/index',
    meta: { title: '参数设置', icon: 'setting' },
    children: [
      {
        path: 'index',
        name: 'ParamsIndex',
        component: () => import('@/views/params/index'),
        meta: { title: '参数配置' }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/cloud',
    name: 'Log',
    meta: { title: '日志管理', icon: 'log' },
    children: [
      {
        path: 'cloud',
        name: 'CloudLog',
        component: () => import('@/views/log/cloud'),
        meta: { title: '云端运行日志' }
      },
      {
        path: 'audit',
        name: 'AuditLog',
        component: () => import('@/views/log/audit'),
        meta: { title: '审计日志' }
      },
      {
        path: 'trace',
        name: 'AuditTrace',
        component: () => import('@/views/log/trace'),
        meta: { title: '审计追踪' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理' }
      }
    ]
  },
  
  // 404 page must be placed at the end
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router; 