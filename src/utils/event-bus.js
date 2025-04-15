import Vue from 'vue'

const EventBus = new Vue()

export default EventBus

// 定义事件名常量，便于维护
export const PAGE_ACTION_EVENTS = {
  // 产品相关事件
  PRODUCT_CREATE: 'product:create',
  PRODUCT_IMPORT: 'product:import',
  PRODUCT_EXPORT: 'product:export',
  PRODUCT_BATCH_DELETE: 'product:batch-delete',
  
  // 设备相关事件
  DEVICE_CREATE: 'device:create',
  DEVICE_IMPORT: 'device:import',
  DEVICE_EXPORT: 'device:export',
  DEVICE_BATCH_DELETE: 'device:batch-delete',
  
  // 系统相关事件
  USER_CREATE: 'user:create',
  USER_IMPORT: 'user:import',
  USER_EXPORT: 'user:export',
  USER_BATCH_DELETE: 'user:batch-delete'
} 