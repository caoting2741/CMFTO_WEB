const state = {
  createDialogVisible: false,
  list: [],
  total: 0,
  listLoading: false,
  listQuery: {
    page: 1,
    limit: 10,
    name: '',
    status: ''
  }
}

const mutations = {
  SET_CREATE_DIALOG_VISIBLE: (state, visible) => {
    state.createDialogVisible = visible
  },
  SET_LIST: (state, list) => {
    state.list = list
  },
  SET_TOTAL: (state, total) => {
    state.total = total
  },
  SET_LOADING: (state, loading) => {
    state.listLoading = loading
  },
  SET_LIST_QUERY: (state, query) => {
    state.listQuery = query
  }
}

const actions = {
  setCreateDialogVisible({ commit }, visible) {
    commit('SET_CREATE_DIALOG_VISIBLE', visible)
  },
  getList({ commit, state }) {
    commit('SET_LOADING', true)
    // 这里应该调用API获取数据
    // API调用示例:
    // return fetchList(state.listQuery).then(response => {
    //   commit('SET_LIST', response.data.items)
    //   commit('SET_TOTAL', response.data.total)
    //   commit('SET_LOADING', false)
    // })
    
    // 模拟异步请求
    return new Promise(resolve => {
      setTimeout(() => {
        const mockData = [
          { id: 1, name: '智能温控器', type: '温控设备', deviceCount: 15, status: 1, createTime: '2023-01-15 14:23:55', desc: '智能温控器产品' },
          { id: 2, name: '智能门锁', type: '安防设备', deviceCount: 8, status: 1, createTime: '2023-02-22 09:12:32', desc: '智能门锁产品' },
          { id: 3, name: '环境监测器', type: '监测设备', deviceCount: 25, status: 0, createTime: '2023-03-10 16:45:11', desc: '环境监测器产品' },
          { id: 4, name: '智能插座', type: '电器设备', deviceCount: 32, status: 1, createTime: '2023-04-05 10:33:27', desc: '智能插座产品' },
          { id: 5, name: '智能灯具', type: '照明设备', deviceCount: 46, status: 1, createTime: '2023-05-18 11:22:09', desc: '智能灯具产品' }
        ]
        commit('SET_LIST', mockData)
        commit('SET_TOTAL', mockData.length)
        commit('SET_LOADING', false)
        resolve()
      }, 500)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 