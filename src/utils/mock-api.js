/**
 * Mock API responses for development
 */

// Mock user data
const users = {
  admin: {
    token: 'admin-token',
    roles: ['admin'],
    name: 'Admin User',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  editor: {
    token: 'editor-token',
    roles: ['editor'],
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }
};

// 用户管理模拟数据
const userList = [
  { id: 1, username: 'admin', name: '管理员', role: '管理员', email: 'admin@example.com', status: 1, createTime: '2023-01-01 08:00:00' },
  { id: 2, username: 'editor', name: '编辑者', role: '编辑员', email: 'editor@example.com', status: 1, createTime: '2023-01-15 10:30:45' },
  { id: 3, username: 'user1', name: '普通用户1', role: '普通用户', email: 'user1@example.com', status: 1, createTime: '2023-02-05 14:20:10' },
  { id: 4, username: 'user2', name: '普通用户2', role: '普通用户', email: 'user2@example.com', status: 0, createTime: '2023-03-10 09:15:30' }
];

// Mock login response
export function mockLogin(data) {
  const { username } = data;
  const userInfo = users[username];
  
  // Return a Promise to simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userInfo) {
        resolve({
          code: 20000,
          data: {
            token: userInfo.token
          }
        });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 300);
  });
}

// Mock get user info response
export function mockGetInfo(token) {
  let userInfo = null;
  
  // Find user by token
  Object.keys(users).forEach(key => {
    if (users[key].token === token) {
      userInfo = users[key];
    }
  });
  
  // Return a Promise to simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userInfo) {
        resolve({
          code: 20000,
          data: userInfo
        });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
}

// Mock logout response
export function mockLogout() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: 'success'
      });
    }, 300);
  });
}

// 用户管理相关的模拟API
// 获取用户列表
export function mockFetchList(query) {
  const { username, role, page = 1, limit = 10 } = query;
  
  // 过滤数据
  let filteredList = [...userList];
  if (username) {
    filteredList = filteredList.filter(user => user.username.includes(username));
  }
  if (role) {
    filteredList = filteredList.filter(user => user.role === role);
  }
  
  // 分页
  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedList = filteredList.slice(start, end);
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: {
          total: filteredList.length,
          items: pagedList
        }
      });
    }, 300);
  });
}

// 创建用户
export function mockCreateUser(data) {
  const newUser = {
    ...data,
    id: userList.length + 1,
    createTime: new Date().toLocaleString()
  };
  
  userList.unshift(newUser);
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: 'success'
      });
    }, 300);
  });
}

// 更新用户
export function mockUpdateUser(data) {
  const index = userList.findIndex(user => user.id === data.id);
  if (index !== -1) {
    userList[index] = Object.assign(userList[index], data);
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: 'success'
      });
    }, 300);
  });
}

// 重置密码
export function mockResetPassword(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: 'success'
      });
    }, 300);
  });
} 