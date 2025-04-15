import request from '@/utils/request';
import { 
  mockLogin, 
  mockGetInfo, 
  mockLogout,
  mockFetchList,
  mockCreateUser,
  mockUpdateUser,
  mockResetPassword
} from '@/utils/mock-api';

// Use mock API in development mode
const useMockApi = true;

export function login(data) {
  if (useMockApi) {
    return mockLogin(data);
  }
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  if (useMockApi) {
    return mockGetInfo(token);
  }
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  if (useMockApi) {
    return mockLogout();
  }
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

// 以下是用户管理相关的API接口
export function fetchList(query) {
  if (useMockApi) {
    return mockFetchList(query);
  }
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  });
}

export function createUser(data) {
  if (useMockApi) {
    return mockCreateUser(data);
  }
  return request({
    url: '/system/user',
    method: 'post',
    data
  });
}

export function updateUser(data) {
  if (useMockApi) {
    return mockUpdateUser(data);
  }
  return request({
    url: `/system/user/${data.id}`,
    method: 'put',
    data
  });
}

export function resetPassword(data) {
  if (useMockApi) {
    return mockResetPassword(data);
  }
  return request({
    url: '/system/user/reset-password',
    method: 'post',
    data
  });
} 