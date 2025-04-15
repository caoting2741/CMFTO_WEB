<template>
  <div class="app-container" ref="productList">
    <table-page :table-data="list" :columns="columns" :search-items="searchItems" :search-model="searchModel"
      :loading="listLoading" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @search="handleSearch" @reset="handleReset" @pagination="getList">     
      <!-- 产品名称列插槽 -->
      <template #name="{ row }">
        <router-link :to="'/product/detail/' + row.id" class="link-type">
          <span>{{ row.name }}</span>
        </router-link>
      </template>

      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status | statusFilter">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
        <el-button size="mini" @click="handleDetail(row)">详情</el-button>
        <el-button v-if="row.status === 0" size="mini" @click="handleModifyStatus(row, 1)">启用</el-button>
        <el-button v-else size="mini" @click="handleModifyStatus(row, 0)">停用</el-button>
      </template>
    </table-page>

    <global-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px"
      custom-class="product-dialog" @confirm="dialogStatus === 'create' ? createData() : updateData()">
      <global-form ref="dataForm" :model="temp" :rules="rules" :form-items="formItems" label-width="100px"
        :show-footer="false" @submit="dialogStatus === 'create' ? createData() : updateData()" />
    </global-dialog>
  </div>
</template>

<script>
// import { fetchList, createProduct, updateProduct } from '@/api/product'
import { mapState } from 'vuex'
import EventBus, { PAGE_ACTION_EVENTS } from '@/utils/event-bus'

export default {
  name: 'ProductList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [
        { id: 1, name: '智能温控器', type: '温控设备', deviceCount: 15, status: 1, createTime: '2023-01-15 14:23:55', desc: '智能温控器产品' },
        { id: 2, name: '智能门锁', type: '安防设备', deviceCount: 8, status: 1, createTime: '2023-02-22 09:12:32', desc: '智能门锁产品' },
        { id: 3, name: '环境监测器', type: '监测设备', deviceCount: 25, status: 0, createTime: '2023-03-10 16:45:11', desc: '环境监测器产品' },
        { id: 4, name: '智能插座', type: '电器设备', deviceCount: 32, status: 1, createTime: '2023-04-05 10:33:27', desc: '智能插座产品' },
        { id: 5, name: '智能灯具', type: '照明设备', deviceCount: 46, status: 1, createTime: '2023-05-18 11:22:09', desc: '智能灯具产品' }
      ],
      total: 5,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        status: ''
      },
      // 表格列配置
      columns: [
        { prop: 'id', label: 'ID', width: 80, align: 'center' },
        { prop: 'name', label: '产品名称', minWidth: 150, slotName: 'name' },
        { prop: 'type', label: '产品类型', minWidth: 120 },
        { prop: 'deviceCount', label: '设备数量', minWidth: 120 },
        { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
        { prop: 'createTime', label: '创建时间', minWidth: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '产品名称', prop: 'name', type: 'input' },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          options: [
            { label: '停用', value: 0 },
            { label: '启用', value: 1 }
          ]
        }
      ],
      // 搜索表单值
      searchModel: {
        name: '',
        status: ''
      },
      statusOptions: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 }
      ],
      typeOptions: [
        { key: '温控设备', display_name: '温控设备' },
        { key: '安防设备', display_name: '安防设备' },
        { key: '监测设备', display_name: '监测设备' },
        { key: '电器设备', display_name: '电器设备' },
        { key: '照明设备', display_name: '照明设备' }
      ],
      // 表单项配置
      formItems: [
        { 
          label: '产品名称', 
          prop: 'name', 
          type: 'input', 
          required: true,
          tooltip: '请输入产品的完整名称，如"智能温控器Pro"' 
        },
        { 
          label: '产品类型', 
          prop: 'type', 
          type: 'select',
          tooltip: '选择产品所属的类型分类',
          options: [
            { label: '温控设备', value: '温控设备' },
            { label: '安防设备', value: '安防设备' },
            { label: '监测设备', value: '监测设备' },
            { label: '电器设备', value: '电器设备' },
            { label: '照明设备', value: '照明设备' }
          ]
        },
        {
          label: '状态',
          prop: 'status',
          type: 'select',
          options: [
            { label: '停用', value: 0 },
            { label: '启用', value: 1 }
          ]
        },
        { 
          label: '描述', 
          prop: 'desc', 
          type: 'textarea', 
          rows: 3,
          tooltip: '填写产品的简要描述，包括功能特点、适用场景等'
        }
      ],
      temp: {
        id: undefined,
        name: '',
        type: '',
        deviceCount: 0,
        status: 1,
        desc: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑产品',
        create: '创建产品'
      },
      rules: {
        name: [{ required: true, message: '产品名称必填', trigger: 'blur' }]
      },
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapState({
      createDialogVisible: state => state.product && state.product.createDialogVisible
    }),
  },
  watch: {
    createDialogVisible(val) {
      if (val) {
        // 当通过vuex打开对话框时，设置创建状态
        this.dialogStatus = 'create'
        this.resetTemp()
        this.dialogFormVisible = true
        this.$nextTick(() => {
          if (this.$refs.dataForm) {
            this.$refs.dataForm.clearValidate()
          }
        })
      }
    }
  },
  created() {
    this.getList()
    // 监听页面操作事件
    this.setupEventListeners()
  },
  beforeDestroy() {
    // 移除事件监听器
    this.removeEventListeners()
  },
  methods: {
    setupEventListeners() {
      // 监听页面操作事件
      EventBus.$on(PAGE_ACTION_EVENTS.PRODUCT_CREATE, this.handleCreate)
      EventBus.$on(PAGE_ACTION_EVENTS.PRODUCT_IMPORT, this.handleImport)
      EventBus.$on(PAGE_ACTION_EVENTS.PRODUCT_EXPORT, this.handleExport)
      EventBus.$on(PAGE_ACTION_EVENTS.PRODUCT_BATCH_DELETE, this.handleBatchDelete)
    },
    removeEventListeners() {
      // 移除监听器
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_CREATE, this.handleCreate)
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_IMPORT, this.handleImport)
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_EXPORT, this.handleExport)
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_BATCH_DELETE, this.handleBatchDelete)
    },
    getList() {
      this.listLoading = true
      // 这里应该调用API获取数据，现在使用模拟数据
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    // 更新搜索方法
    handleSearch(form) {
      this.listQuery.name = form.name
      this.listQuery.status = form.status
      this.listQuery.page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        name: '',
        status: ''
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        deviceCount: 0,
        status: 1,
        desc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.dataForm) {
          this.$refs.dataForm.resetFields()
        }
      })
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
      this.$message({
        message: '批量删除功能示例',
        type: 'warning'
      })
    },
    createData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.temp.id = this.list.length + 1
          this.temp.createTime = new Date().toLocaleString()
          this.temp.deviceCount = 0
          // createProduct(this.temp).then(() => {
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
        if (this.$refs.dataForm) {
          this.$refs.dataForm.clearValidate()
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // updateProduct(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
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
    handleDetail(row) {
      this.$router.push({ path: `/product/detail/${row.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.link-type {
  color: #067288;
}

// 自定义产品对话框样式
:deep(.product-dialog) {
  .el-select {
    width: 100%;
  }
  
  // 调整表单在弹窗中的布局
  .el-form {
    width: 85%;
    margin: 0 auto;
  }
}
</style>