<template>
  <div class="app-container" ref="productList">
    <table-page :show-selection="true" :table-data="list" :columns="columns" :search-items="searchItems"
      :search-model="searchModel" :loading="listLoading" :total="total" :page.sync="listQuery._page"
      :limit.sync="listQuery._limit" @search="handleSearch" @reset="handleReset" @pagination="getList"
      @selection-change="handleSelectionChange">
      <!-- 产品名称列插槽 -->
      <template v-slot:name="{ row }">
        <router-link :to="'/product/detail/' + row.id" class="link-type">
          <span>{{ row.name }}</span>
        </router-link>
      </template>
      <!-- 产品类型列插槽 -->
      <template #type="{ row }">
        <el-tag :type="row.type | typeFilter">{{ row.type === 1 ? '直连' : '网关' }}</el-tag>
      </template>

      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status | statusFilter">{{ row.status === 1 ? '已发布' : '未发布' }}</el-tag>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
        <el-button size="mini" @click="handleDevice(row)">管理设备</el-button>
        <el-button size="mini" @click="handleDelete(row)">删除</el-button>

      </template>
    </table-page>

    <global-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px"
      custom-class="product-dialog" @confirm="dialogStatus === 'create' ? createData() : updateData()">
      <global-form ref="dataForm" :model="temp" :rules="rules" :form-items="formItems" label-width="100px"
        :show-footer="false" />
    </global-dialog>
  </div>
</template>

<script>
// import { fetchList, createProduct, updateProduct } from '@/api/product'
import { mapState } from 'vuex'
import EventBus, { PAGE_ACTION_EVENTS } from '@/utils/event-bus'
import { loadProducts, getProduct, deleteProduct, deleteProducts, createProduct, updateProduct } from '@/api/dm'
export default {
  name: 'ProductList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      const typeMap = {
        1: 'info',
        2: 'success',
      }
      return typeMap[type]
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        _page: 1,
        _limit: 20,
        product_name: '',
        //status: ''
      },
      // 选中行数据数组
      selectedRows: [],
      // 表格列配置
      columns: [
        { prop: 'name', label: '产品名称', minWidth: 150, slotName: 'name' },
        { prop: 'product_key', label: '产品Key', minWidth: 150 },
        { prop: 'device_count', label: '设备数量', minWidth: 120 },
        { prop: 'type', label: '产品类型', minWidth: 120, slotName: 'type' },
        { prop: 'status', label: '产品状态', minWidth: 100, slotName: 'status' },
        { prop: 'create_at', label: '创建时间', minWidth: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '产品名称', prop: 'product_name', type: 'input' },
      ],
      // 搜索表单值
      searchModel: {
        product_name: '',
      },
      statusOptions: [
        { label: '未发布', value: 0 },
        { label: '已发布', value: 1 }
      ],
      // 表单项配置
      formItems: [
        {
          label: '产品名称',
          prop: 'name',
          type: 'input',
          required: true,
          showWordLimit: true,
          maxlength: 30,
          // tooltip: '请输入产品的完整名称，如"智能温控器Pro"'
        },
        {
          label: '产品类型',
          prop: 'type',
          type: 'select',
          clearable: false,
          // tooltip: '选择产品所属的类型分类',
          options: [
            { label: '直连', value: 1 },
            { label: '网关', value: 2 },
          ]
        },
        {
          label: '动态注册',
          prop: 'dynamic_reg',
          type: 'radio',
          required: true,
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        {
          label: '鉴权类型',
          prop: 'auth_type',
          type: 'radio',
          required: true,
          options: [
            { label: '密钥认证', value: 1 },
            { label: '证书认证', value: 2 }
          ]
        },
        {
          label: '数据校验级别',
          prop: 'data_check_level',
          type: 'radio',
          options: [
            { label: '弱校验', value: 1 },
            { label: '免校验', value: 2 }
          ]
        },
        {
          label: '描述',
          prop: 'description',
          type: 'textarea',
          rows: 3,
          showWordLimit: true,
          maxlength: 100,
          //tooltip: '填写产品的简要描述，包括功能特点、适用场景等'
        }
      ],
      temp: {
        id: undefined,
        name: '',
        type: 1,
        dynamic_reg: 1,
        auth_type: 1,
        data_check_level: 1,
        description: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑产品',
        create: '创建产品'
      },
      rules: {
        name: [
          { required: true, message: '产品名称必填', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-@()]{4,30}$/,
            message: '产品名称支持中文、英文字母、数字和特殊字符_-@()，长度4~30个字符',
            trigger: 'blur'
          }
        ]
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
    // 确保初始化数据
    this.list = this.list || [];

    this.columns = this.columns || [];

    // 然后获取数据
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
      EventBus.$on(PAGE_ACTION_EVENTS.PRODUCT_BATCH_DELETE, this.handleBatchDelete)
    },
    removeEventListeners() {
      // 移除监听器
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_CREATE, this.handleCreate)
      EventBus.$off(PAGE_ACTION_EVENTS.PRODUCT_BATCH_DELETE, this.handleBatchDelete)
    },
    async getList() {
      this.listLoading = true
      try {
        // 这里应该调用API获取数据
        const { items, meta } = await loadProducts(this.listQuery)
        this.list = items || []
        this.total = meta?.count || 0
      } catch (error) {
        console.error('获取产品列表失败:', error)
        this.list = []
        this.total = 0
      } finally {
        this.listLoading = false
      }
    },
    // 更新搜索方法
    handleSearch(form) {
      this.listQuery.product_name = form.product_name
      this.listQuery._page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        product_name: '',
      }
      this.listQuery.product_name = ''
      this.listQuery._page = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        dynamic_reg: 1,
        auth_type: 1,
        data_check_level: 1,
        description: ''
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
    handleDelete(row) {
      this.$confirm('确认删除该产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.id, row.product_key).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch((err) => {
          console.log(err)
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 选择变化处理方法
    handleSelectionChange(selection) {
      console.log(selection)
      // 确保 selection 是数组
      this.selectedRows = Array.isArray(selection) ? selection : [];

      try {
        // 使用直接的字符串常量作为事件名称，避免使用可能导致问题的常量
        const directEventName = 'selection_change';

        // 创建一个简单的对象，避免任何可能的字符串操作
        const data = {
          type: 'product',
          count: this.selectedRows.length
        };
        // 直接使用字符串事件名称
        EventBus.$emit(directEventName, data);

      } catch (error) {
        console.error('事件发送错误:', error);
      }
    },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的产品')
        return
      }
      this.$confirm('确认删除选中产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        // 批量删除
        let data = []
        this.selectedRows.forEach((item, index) => {
          data.push({ id: item.id, product_key: item.product_key, name: item.name })
        })
        await deleteProducts(data)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
        })
        this.getList()
      })
    },
    createData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = this.$refs.dataForm.getFormData()
          const { name, type, dynamic_reg, auth_type, data_check_level, description } = params
          let data = {
            name,
            type,
            dynamic_reg,
            auth_type,
            data_check_level,
            description
          }
          createProduct(data).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getList()
        }
      })

    },
    async getOneDetail(id) {
      const product = await getProduct(id)
      if (product.lenth === 0) {
        this.$message.error('产品不存在')
        setTimeout(() => {
          this.$router.push({ path: '/product/list' })
        }, 600)
        return
      }
      return product
    },
    async handleUpdate(row) {
      const product = await this.getOneDetail(row.id)
      const { id, name, type, dynamic_reg, auth_type, data_check_level, description } = product[0]
      this.temp = { id, name, type, dynamic_reg, auth_type, data_check_level, description }
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
          const params = this.$refs.dataForm.getFormData()
          const { id, name, type, dynamic_reg, auth_type, data_check_level, description } = params
          let tempData = { name, type, dynamic_reg, auth_type, data_check_level, description }
          updateProduct(id, tempData).then(() => {
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
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