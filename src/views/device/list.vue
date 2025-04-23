<template>
  <div class="app-container">
    <table-page :table-data="list" :columns="columns" :search-items="searchItems" :search-model="searchModel"
      :loading="listLoading" :total="total" :page.sync="listQuery._page" :limit.sync="listQuery._limit"
      @search="handleSearch" :show-selection="true" @reset="handleReset" @pagination="getList"
      @selection-change="handleSelectionChange">

      <!-- 设备名称列插槽 -->
      <template #name="{ row }">
        <router-link :to="'/device/detail/' + row.id" class="link-type">
          <span>{{ row.name }}</span>
        </router-link>
      </template>

      <!-- 上次断开时间 -->
      <template #last_disconnected_at="{ row }">
        {{ row.status ? '' : row.disconnected_at }}
      </template>

      <!-- 在线状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status | statusFilter">{{ row.status === true ? '在线' : '离线' }}</el-tag>
      </template>


      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
        <el-button type="success" size="mini" @click="handleDetail(row)">详情</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </table-page>

    <add-edit-dialog :dialog-form-visible.sync="dialogFormVisible" :dialog-status="dialogStatus" :temp="temp"
      :product-options="productOptions" @view-location="handleViewLocation" @create="createData" @update="updateData" />

  </div>
</template>

<script>
import EventBus, { PAGE_ACTION_EVENTS } from '@/utils/event-bus'
import AddEditDialog from './components/AddEditDialog.vue'
import {
  loadDevices,
  enableDevice,
  statsDevice,
  getStatsDevice,
  traceDevice,
  getDevicesByProductId,
  deleteDevice,
  uploadDevice,
  downloadDevices,
  loadAllProducts,
  deleteDevices,
} from '@/api/dm'

export default {
  name: 'DeviceList',
  // 为面包屑添加页面操作按钮
  components: {
    AddEditDialog
  },

  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'error'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        _page: 1,
        _limit: 20,
        device_name: '',
        status: '',
        product_key: ''
      },
      // 表格列配置
      columns: [
        { prop: 'id', label: '名称', slotName: 'name' },
        { prop: 'nickname', label: '昵称', width: 180 },
        { prop: 'status', label: '状态', slotName: 'status' },
        { prop: 'connected_at', label: '连接时间', width: 180 },
        { prop: 'disconnected_at', label: '断开时间', width: 180 },
        { prop: 'last_disconnected_at', label: '上次断开时间', width: 180, slotName: 'last_disconnected_at' },
        { prop: 'online_at', label: '在线时长', width: 180 },
        { prop: 'offline_at', label: '离线时长', width: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '设备名称', prop: 'name', type: 'input' },
        {
          label: '设备状态',
          prop: 'status',
          type: 'select',
          options: [
            { label: '离线', value: false },
            { label: '在线', value: true }
          ]
        },
        {
          label: '所属产品',
          prop: 'product_key',
          type: 'select',
          options: []
        }
      ],
      // 搜索表单值
      searchModel: {
        device_name: '',
        status: '',
        product_key: ''
      },
      statusOptions: [
        { label: '离线', value: false },
        { label: '在线', value: true }
      ],
      productOptions: [],
      temp: {
        id: undefined,
        name: '',
        productId: '',
        sn: '',
        desc: '',
        devTags: [],
        coordinate: '',
        locDesc: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
    }
  },
  computed: {
    
  },
  created() {
    this.getList();
    this.getProductList();
    // 监听页面操作事件
    this.setupEventListeners()
  },
  beforeDestroy() {
    // 移除事件监听器
    this.removeEventListeners()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        // 过滤掉值为空的查询参数
        const query = Object.entries(this.listQuery).reduce((acc, [key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});
        const { items, meta } = await loadDevices(query)
        this.list = items || []
        this.total = meta?.count || 0
      } catch (error) {
        console.error('获取设备列表失败:', error)
        this.list = []
        this.total = 0
      } finally {
        this.listLoading = false
      }
    },
    async getProductList() {
      let arr = await loadAllProducts() || []
      if (arr.length > 0) {
        const mappedOptions = arr.map(item => ({
          label: item.name,
          value: item.product_key
        }))
        this.productOptions = mappedOptions
        this.searchItems[2].options = mappedOptions
      }
    },
    // 更新搜索方法
    handleSearch(form) {
      this.listQuery.device_name = form.name
      this.listQuery.status = form.status
      this.listQuery.product_key = form.productId
      this.listQuery._page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        device_name: '',
        status: '',
        product_key: ''
      }
      this.listQuery = {
        _page: 1,
        device_name: '',
        status: '',
        product_key: ''
      }
      this.getList()
    },
    // 选择变化处理方法
    handleSelectionChange(selection) {
      // 确保 selection 是数组
      this.selectedRows = Array.isArray(selection) ? selection : [];

      try {
        // 使用直接的字符串常量作为事件名称，避免使用可能导致问题的常量
        const directEventName = 'selection_change';

        // 创建一个简单的对象，避免任何可能的字符串操作
        const data = {
          type: 'device',
          count: this.selectedRows.length
        };
        // 直接使用字符串事件名称
        EventBus.$emit(directEventName, data);

      } catch (error) {
        console.error('事件发送错误:', error);
      }
    },
    handleViewLocation() {
      // 调用地图组件的方法，传入设备的经纬度信息
      //this.$refs.mapComponent.showDeviceLocation(this.temp.coordinate);
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        product_key: '',
        deviceSercet: '',
        desc: '',
        devTags: [],
        coordinate: '',
        locDesc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.devTags = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true      
    },
    

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.list.length + 1000
          //this.temp.activeTime = new Date().toLocaleString()
          const productObj = this.productOptions.find(item => item.id === this.temp.productId)
          this.temp.productName = productObj ? productObj.name : ''

          // createDevice(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const productObj = this.productOptions.find(item => item.id === tempData.productId)
          tempData.productName = productObj ? productObj.name : ''

          // updateDevice(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, tempData)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, tempData)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteDevice(row.id).then(() => {
        //   this.$notify({
        //     title: '成功',
        //     message: '删除成功',
        //     type: 'success',
        //     duration: 2000
        //   })
        //   const index = this.list.findIndex(v => v.id === row.id)
        //   this.list.splice(index, 1)
        // })
        const index = this.list.findIndex(v => v.id === row.id)
        this.list.splice(index, 1)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDetail(row) {
      this.$router.push({ path: `/device/detail/${row.id}` })
    },
    setupEventListeners() {
      // 监听页面操作事件
      EventBus.$on(PAGE_ACTION_EVENTS.DEVICE_CREATE, this.handleCreate)
      EventBus.$on(PAGE_ACTION_EVENTS.DEVICE_IMPORT, this.handleImport)
      EventBus.$on(PAGE_ACTION_EVENTS.DEVICE_EXPORT, this.handleExport)
      EventBus.$on(PAGE_ACTION_EVENTS.DEVICE_BATCH_DELETE, this.handleBatchDelete)
    },
    removeEventListeners() {
      // 移除监听器
      EventBus.$off(PAGE_ACTION_EVENTS.DEVICE_CREATE, this.handleCreate)
      EventBus.$off(PAGE_ACTION_EVENTS.DEVICE_IMPORT, this.handleImport)
      EventBus.$off(PAGE_ACTION_EVENTS.DEVICE_EXPORT, this.handleExport)
      EventBus.$off(PAGE_ACTION_EVENTS.DEVICE_BATCH_DELETE, this.handleBatchDelete)
    },
    handleImport() {
      this.$message({
        message: '导入功能示例',
        type: 'info'
      })
    },
    handleExport() {
      this.$message({
        message: '导出功能示例',
        type: 'success'
      })
    },

    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的设备')
        return
      }
      this.$confirm('确认删除选中设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 批量删除
        let data = []
        this.selectedRows.forEach((item) => {
          data.push({ id: item.id, product_key: item.product_key, name: item.name })
        })
        // await deleteProducts(data)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
        })
        this.getList()
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
}

.link-type {
  color: #067288;
}

// 自定义设备对话框样式
:deep(.device-dialog) {
  .el-select {
    width: 100%;
  }
}

.loc-container {
  display: flex;
  gap: 8px;
  align-items: center;

  .coordinate-input {
    width: 180px;
  }

  .loc-desc-input {
    flex: 1;
  }
}

.dev-tags-container {
  .tags-list {
    .tag-item {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      align-items: flex-start;

      .tag-input-container {
        flex: 1;

        .tag-error {
          color: #F56C6C;
          font-size: 12px;
          margin-top: 4px;
          line-height: 1;
        }
      }
    }
  }

  .add-tag {
    margin-top: 8px;
  }
}
</style>