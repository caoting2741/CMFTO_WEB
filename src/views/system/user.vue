<template>
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
      <!-- 操作按钮插槽 -->
      <template #operation-buttons>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </template>

      <!-- 操作列插槽 -->
      <template #operation="{ row }">
        <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
        <el-button size="mini" type="success" @click="handleResetPwd(row)">重置密码</el-button>
        <el-button v-if="row.status === 0" size="mini" type="danger" @click="handleModifyStatus(row, 1)">启用</el-button>
        <el-button v-else size="mini" type="warning" @click="handleModifyStatus(row, 0)">停用</el-button>
      </template>
      
      <!-- 状态列插槽 -->
      <template #status="{ row }">
        <el-tag :type="row.status | statusFilter">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
      </template>
    </table-page>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="resetPwdVisible">
      <el-form ref="pwdForm" :model="pwdTemp" :rules="pwdRules" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdTemp.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdTemp.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPwdVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResetPwd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createUser, updateUser, resetPassword } from '@/api/user'
import TablePage from '@/components/TablePage/index.vue'

export default {
  name: 'UserManagement',
  components: { TablePage },
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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.pwdTemp.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      list: [
        { id: 1, username: 'admin', name: '管理员', role: '管理员', email: 'admin@example.com', status: 1, createTime: '2023-01-01 08:00:00' },
        { id: 2, username: 'editor', name: '编辑者', role: '编辑员', email: 'editor@example.com', status: 1, createTime: '2023-01-15 10:30:45' },
        { id: 3, username: 'user1', name: '普通用户1', role: '普通用户', email: 'user1@example.com', status: 1, createTime: '2023-02-05 14:20:10' },
        { id: 4, username: 'user2', name: '普通用户2', role: '普通用户', email: 'user2@example.com', status: 0, createTime: '2023-03-10 09:15:30' }
      ],
      total: 4,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        username: '',
        role: ''
      },
      // 表格列配置
      columns: [
        { prop: 'id', label: 'ID', width: 80, align: 'center' },
        { prop: 'username', label: '用户名', minWidth: 120 },
        { prop: 'name', label: '姓名', minWidth: 120 },
        { prop: 'role', label: '角色', minWidth: 120 },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
        { prop: 'createTime', label: '创建时间', minWidth: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '用户名', prop: 'username', type: 'input' },
        { 
          label: '角色', 
          prop: 'role', 
          type: 'select',
          options: [
            { label: '管理员', value: '管理员' },
            { label: '编辑员', value: '编辑员' },
            { label: '普通用户', value: '普通用户' }
          ]
        }
      ],
      // 搜索表单值
      searchModel: {
        username: '',
        role: ''
      },
      roleOptions: [
        { key: '管理员', display_name: '管理员' },
        { key: '编辑员', display_name: '编辑员' },
        { key: '普通用户', display_name: '普通用户' }
      ],
      temp: {
        id: undefined,
        username: '',
        name: '',
        role: '',
        email: '',
        password: '',
        status: 1
      },
      pwdTemp: {
        userId: undefined,
        password: '',
        confirmPassword: ''
      },
      dialogFormVisible: false,
      resetPwdVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新建用户'
      },
      rules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        role: [{ required: true, message: '角色必选', trigger: 'change' }],
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      pwdRules: {
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码必填', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 更新搜索方法
    handleSearch(form) {
      this.listQuery.username = form.username
      this.listQuery.role = form.role
      this.listQuery.page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        username: '',
        role: ''
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
        username: '',
        name: '',
        role: '',
        email: '',
        password: '',
        status: 1
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
          this.temp.id = this.list.length + 1
          this.temp.createTime = new Date().toLocaleString()
          
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
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
          
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleResetPwd(row) {
      this.pwdTemp = {
        userId: row.id,
        password: '',
        confirmPassword: ''
      }
      this.resetPwdVisible = true
      this.$nextTick(() => {
        this.$refs['pwdForm'].clearValidate()
      })
    },
    confirmResetPwd() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          resetPassword(this.pwdTemp).then(() => {
            this.resetPwdVisible = false
            this.$notify({
              title: '成功',
              message: '密码重置成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
</style> 