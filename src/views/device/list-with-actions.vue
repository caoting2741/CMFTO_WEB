<template>
  <!-- 主视图 -->
  <div class="app-container">
    <table-page
      :table-data="list"
      :columns="columns"
      :search-items="searchItems"
      :search-model="searchModel"
      :loading="listLoading"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @search="handleSearch"
      @reset="handleReset"
      @pagination="getList"
    >
      <!-- 设备名称列插槽 -->
      <template #name="{ row }">
        <router-link :to="'/device/detail/'+row.id" class="link-type">
          <span>{{ row.name }}</span>
        </router-link>
      </template>
      
      <!-- 在线状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status | statusFilter">{{ row.status === 'online' ? '在线' : '离线' }}</el-tag>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
        <el-button type="success" size="mini" @click="handleDetail(row)">详情</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </table-page>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="temp.productId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in productOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="sn">
          <el-input v-model="temp.sn" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<!-- 定义面包屑中的操作按钮视图 -->
<template slot="pageActions">
  <div class="page-actions">
    <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建</el-button>
    <el-button type="info" icon="el-icon-upload2">导入</el-button>
    <el-button type="success" icon="el-icon-download">导出</el-button>
    <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
  </div>
</template>

<script>
// import { fetchList, createDevice, updateDevice, deleteDevice } from '@/api/device'

export default {
  name: 'DeviceListWithActions',
  filters: {
    statusFilter(status) {
      const statusMap = {
        online: 'success',
        offline: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [
        { id: 1001, name: '客厅温控器', productId: 1, productName: '智能温控器', sn: 'TC0010001', status: 'online', activeTime: '2023-06-10 09:32:15', desc: '客厅温控器设备' },
        { id: 1002, name: '卧室温控器', productId: 1, productName: '智能温控器', sn: 'TC0010002', status: 'online', activeTime: '2023-06-10 08:15:42', desc: '卧室温控器设备' },
        { id: 1003, name: '书房温控器', productId: 1, productName: '智能温控器', sn: 'TC0010003', status: 'offline', activeTime: '2023-06-09 18:45:27', desc: '书房温控器设备' },
        { id: 1004, name: '客厅门锁', productId: 2, productName: '智能门锁', sn: 'DL0020001', status: 'online', activeTime: '2023-06-10 10:05:33', desc: '客厅门锁设备' },
        { id: 1005, name: '前门门锁', productId: 2, productName: '智能门锁', sn: 'DL0020002', status: 'offline', activeTime: '2023-06-09 20:12:56', desc: '前门门锁设备' },
        { id: 1006, name: '卧室空气检测仪', productId: 3, productName: '环境监测器', sn: 'AM0030001', status: 'online', activeTime: '2023-06-10 08:55:19', desc: '卧室空气检测仪设备' }
      ],
      total: 6,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        status: '',
        productId: ''
      },
      // 表格列配置
      columns: [
        { prop: 'id', label: '设备ID', width: 100, align: 'center' },
        { prop: 'name', label: '设备名称', minWidth: 150, slotName: 'name' },
        { prop: 'productName', label: '所属产品', minWidth: 120 },
        { prop: 'sn', label: '设备编号', minWidth: 120 },
        { prop: 'status', label: '在线状态', minWidth: 100, slotName: 'status' },
        { prop: 'activeTime', label: '激活时间', minWidth: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '设备名称', prop: 'name', type: 'input' },
        { 
          label: '在线状态', 
          prop: 'status', 
          type: 'select',
          options: [
            { label: '离线', value: 'offline' },
            { label: '在线', value: 'online' }
          ]
        },
        { 
          label: '所属产品', 
          prop: 'productId', 
          type: 'select',
          options: [
            { label: '智能温控器', value: 1 },
            { label: '智能门锁', value: 2 },
            { label: '环境监测器', value: 3 },
            { label: '智能插座', value: 4 },
            { label: '智能灯具', value: 5 }
          ]
        }
      ],
      // 搜索表单值
      searchModel: {
        name: '',
        status: '',
        productId: ''
      },
      statusOptions: [
        { label: '离线', value: 'offline' },
        { label: '在线', value: 'online' }
      ],
      productOptions: [
        { id: 1, name: '智能温控器' },
        { id: 2, name: '智能门锁' },
        { id: 3, name: '环境监测器' },
        { id: 4, name: '智能插座' },
        { id: 5, name: '智能灯具' }
      ],
      temp: {
        id: undefined,
        name: '',
        productId: '',
        sn: '',
        status: 'offline',
        desc: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑设备',
        create: '创建设备'
      },
      rules: {
        name: [{ required: true, message: '设备名称必填', trigger: 'blur' }],
        productId: [{ required: true, message: '所属产品必选', trigger: 'change' }],
        sn: [{ required: true, message: '设备编号必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 这里应该调用API获取数据，现在使用模拟数据
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    // 更新搜索方法
    handleSearch(form) {
      this.listQuery.name = form.name
      this.listQuery.status = form.status
      this.listQuery.productId = form.productId
      this.listQuery.page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        name: '',
        status: '',
        productId: ''
      }
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        productId: '',
        sn: '',
        status: 'offline',
        desc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = 1000 + this.list.length + 1 // mock new id
          this.temp.activeTime = new Date().toLocaleString()
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
          // updateDevice(tempData).then(() => {
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
          this.list.splice(index, 1, this.temp)
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
    handleBatchDelete() {
      this.$message({
        message: '批量删除功能示例',
        type: 'warning'
      })
    },
    handleDetail(row) {
      this.$router.push({ path: `/device/detail/${row.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
.link-type {
  color: #067288;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style> 