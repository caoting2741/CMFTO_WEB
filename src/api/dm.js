import http from '@/utils/http'

export async function loadProducts(params = {}) {
  const data = await http.get('/products', { params })
  return data
}

export async function loadAllProducts() {
  const { items } = await http.get('/products')
  return items
}

export async function getProduct(id) {
  const data = await http.get(`/products/${id}`)
  return data
}

export async function createProduct(data) {
  const res = await http.post('/products', data)
  return res
}

export async function updateProduct(id, data) {
  const res = await http.put(`/products/${id}`, data)
  return res
}

export async function deleteProduct(id, productKey) {
  const res = await http.delete(`/products/${id}?product_key=${productKey}`)
  return res
}
export async function deleteProducts(data) {
  const res = await http.post(`/products/multiple`, { data: data })
  return res
}

export async function getProductPreRules(product_key) {
  const data = await http.get(`/pre_rules?product_key=${product_key}`)
  return data
}

export async function createProductPreRule(data) {
  const res = await http.post(`/pre_rules`, data)
  return res
}

export async function updateProductPreRule(rule_id, data) {
  const res = await http.put(`/pre_rules/${rule_id}`, data)
  return res
}

export async function deleteProductPreRule(rule_id) {
  const res = await http.delete(`/pre_rules/${rule_id}`)
  return res
}

export async function createProductModel(product_key, data) {
  const res = await http.post(`/models?product_key=${product_key}`, data)
  return res
}
export async function getProductModels(product_key) {
  const data = await http.get(`/models?product_key=${product_key}`)
  return data
}

export async function updateProductModel(product_key, id, data) {
  const res = await http.put(`/models/${id}?product_key=${product_key}`, data)
  return res
}

export async function deleteProductModel(id) {
  const res = await http.delete(`/models/${id}`)
  return res
}

export async function updateProductModelStatus(id, data) {
  const res = await http.put(`/release_models/${id}`, data)
  return res
}

export async function createProductTopic(product_key, data) {
  const res = await http.post(`/topics?product_key=${product_key}`, data)
  return res
}
export async function getProductTopics(product_key) {
  const data = await http.get(`/topics?product_key=${product_key}`)
  return data
}

export async function updateProductTopic(product_key, id, data) {
  const res = await http.put(`/topics/${id}?product_key=${product_key}`, data)
  return res
}

export async function deleteProductTopic(id) {
  const res = await http.delete(`/topics/${id}`)
  return res
}

export async function loadDevices(params = {}) {
  const data = await http.get('/devices', { params })
  return data
}

export async function getDevicesByProductId(productId, params = {}) {
  const data = await http.get('/devices', {
    params: {
      ...params,
      product_id: productId,
    },
  })
  return data
}

export async function getDevice(id) {
  const data = await http.get(`/devices/${id}`)
  return data
}

export async function addDeviceTag(deviceId, tagId) {
  const res = await http.post(`/devices/${deviceId}/tags`, { tag_id: tagId })
  return res
}

export async function removeDeviceTag(deviceId, tagId) {
  const res = await http.delete(`/devices/${deviceId}/tags/${tagId}`)
  return res
}

export async function deleteDevices(data) {
  const res = await http.post('/devices/multiple', { data: data })
  return res
}

export async function updateTags(data) {
  const res = await http.put('/tags', data)
  return res
}

export async function createDevice(data) {
  const res = await http.post('/devices', data)
  return res
}

export async function updateDevice(id, data) {
  const res = await http.put(`/devices/${id}`, data)
  return res
}

export async function enableDevice(id, data) {
  const res = await http.put(`/devices/${id}/enable`, data)
  return res
}

export function traceDevice(id, data) {
  const res = http.put(`/devices/${id}/trace`, data)
  return res
}

export function statsDevice(id, data) {
  const res = http.put(`/device_stats/${id}`, data)
  return res
}

export function resetAllStatsDevice(id) {
  return http.put(`/reset_stats/${id}`)
}
export function resetStatsDevice(id, data) {
  return http.put(`/reset_stats/${id}`, data)
}

export function getStatsDevice(id) {
  return http.get(`/device_stats/${id}`)
}

export async function enableShadow(id, data) {
  const res = await http.post(`/device_shadow/${id}/enable`, data)
  return res
}

export async function updateShadow(id, data) {
  const res = await http.put(`/device_shadow/${id}`, data)
  return res
}

export async function deleteDevice(id) {
  const res = await http.delete(`/devices/${id}`)
  return res
}

export function uploadDevice(data) {
  return http.post('/import_devices', data)
}

export async function loadProductStats(params = {}) {
  const data = await http.get('/product_stats', { params })
  return data
}

export async function loadStatusLog(id) {
  const data = await http.get(`/devices/${id}/status_log`)
  return data
}
export async function loadMoreParams() {
  const data = await http.get(`/more_params`)
  return data
}

export function saveMoreParams(data) {
  return http.post('/more_params', data)
}

export async function loadUnknownDevices() {
  const data = await http.get(`/unknown_device`)
  return data
}

export async function deleteUnknownDevice(id) {
  const res = await http.delete(`/unknown_device/${encodeURIComponent(id)}`)
  return res
}
export async function updateUnknownDevice(id, data) {
  const res = await http.put(`/unknown_device/${encodeURIComponent(id)}`, data)
  return res
}

export async function clearAllUnknownDevices() {
  const res = await http.post(`/unknown_device/clear/`)
  return res
}

export async function clearOfflineAllUnknownDevices() {
  const res = await http.post(`/unknown_device/clear_offline/`)
  return res
}

export function downloadDevices(filename, params = {}) {
  const res = http.get('/export_devices/${filename}', {
    params: {
      ...params,
    },
  })
  return res
}

export async function getSubDevices(id) {
  return http.get(`/devices/${id}/sub_devices`)
}
export async function getSubDeviceProfile(product_key) {
  return http.get(`/sub_device_profile?product_key=${product_key}`)
}

export async function createSubDeviceProfile(product_key, data) {
  return http.post(`/sub_device_profile?product_key=${product_key}`, data)
}

export async function updateSubDeviceProfile(product_key, profileId, data) {
  return http.put(`/sub_device_profile/${profileId}?product_key=${product_key}`, data)
}

export async function deleteSubDeviceProfile(product_key, profileId) {
  return http.delete(`/sub_device_profile/${profileId}?product_key=${product_key}`)
}

export async function getWarnRules(product_key) {
  return http.get(`/warn_rule?product_key=${product_key}`)
}

export async function createWarnRule(product_key, data) {
  return http.post(`/warn_rule?product_key=${product_key}`, data)
}

export async function updateWarnRule(product_key, warnRuleId, data) {
  return http.put(`/warn_rule/${warnRuleId}?product_key=${product_key}`, data)
}

export async function deleteWarnRule(product_key, warnRuleId) {
  return http.delete(`/warn_rule/${warnRuleId}?product_key=${product_key}`)
}

export async function getAuths() {
  return http.get(`/mqtt_auth`)
}

export async function createAuth(data) {
  return http.post(`/mqtt_auth`, data)
}

export async function updateAuth(Id, data) {
  return http.put(`/mqtt_auth/${Id}`, data)
}

export async function deleteAuth(Id) {
  return http.delete(`/mqtt_auth/${Id}`)
}

export async function getAcls() {
  return http.get(`/mqtt_acl`)
}

export async function createAcl(data) {
  return http.post(`/mqtt_acl`, data)
}

export async function updateAcl(Id, data) {
  return http.put(`/mqtt_acl/${Id}`, data)
}

export async function deleteAcl(Id) {
  return http.delete(`/mqtt_acl/${Id}`)
}

export function queryAuditLogs(params) {
  return http.get(`/audits`, { params })
}
