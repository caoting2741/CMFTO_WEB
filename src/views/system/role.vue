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
        <el-button size="mini" type="success" @click="handlePermission(row)">权限设置</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </table-page>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限设置" :visible.sync="permissionDialogVisible" width="600px">
      <el-tree
        ref="permissionTree"
        :data="permissionData"
        :props="permissionProps"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, createRole, updateRole, deleteRole, fetchPermissions, saveRolePermissions } from '@/api/role'
import TablePage from '@/components/TablePage/index.vue'

export default {
  name: 'RoleManagement',
  components: { TablePage },
  data() {
    return {
      list: [
        { id: 1, name: '超级管理员', code: 'ADMIN', description: '系统超级管理员，拥有所有权限', createTime: '2023-01-01 08:00:00' },
        { id: 2, name: '普通管理员', code: 'MANAGER', description: '系统管理员，拥有大部分管理权限', createTime: '2023-01-15 10:30:45' },
        { id: 3, name: '操作员', code: 'OPERATOR', description: '普通操作员，只有基本操作权限', createTime: '2023-02-05 14:20:10' },
        { id: 4, name: '访客', code: 'VISITOR', description: '访客角色，只有查看权限', createTime: '2023-03-10 09:15:30' }
      ],
      total: 4,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      // 表格列配置
      columns: [
        { prop: 'id', label: 'ID', width: 80, align: 'center' },
        { prop: 'name', label: '角色名称', minWidth: 120 },
        { prop: 'code', label: '角色编码', minWidth: 120 },
        { prop: 'description', label: '描述', minWidth: 200 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 }
      ],
      // 搜索项配置
      searchItems: [
        { label: '角色名称', prop: 'name', type: 'input' }
      ],
      // 搜索表单值
      searchModel: {
        name: ''
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新建角色'
      },
      rules: {
        name: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
        code: [{ required: true, message: '角色编码必填', trigger: 'blur' }]
      },
      permissionDialogVisible: false,
      currentRoleId: null,
      permissionData: [
        {
          id: 1,
          label: '系统管理',
          children: [
            { id: 11, label: '用户管理' },
            { id: 12, label: '角色管理' },
            { id: 13, label: '菜单管理' }
          ]
        },
        {
          id: 2,
          label: '内容管理',
          children: [
            { id: 21, label: '文章管理' },
            { id: 22, label: '分类管理' },
            { id: 23, label: '标签管理' }
          ]
        },
        {
          id: 3,
          label: '用户中心',
          children: [
            { id: 31, label: '个人信息' },
            { id: 32, label: '修改密码' }
          ]
        }
      ],
      permissionProps: {
        children: 'children',
        label: 'label'
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
      this.listQuery.page = 1
      this.getList()
    },
    // 重置方法
    handleReset() {
      this.searchModel = {
        name: ''
      }
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        description: ''
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
          
          // createRole(this.temp).then(() => {
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
          
          // updateRole(tempData).then(() => {
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
    handleDelete(row) {
      this.$confirm('确认删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteRole(row.id).then(() => {
        //   const index = this.list.findIndex(v => v.id === row.id)
        //   this.list.splice(index, 1)
        //   this.$notify({
        //     title: '成功',
        //     message: '删除成功',
        //     type: 'success',
        //     duration: 2000
        //   })
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
        // 取消删除
      })
    },
    handlePermission(row) {
      this.currentRoleId = row.id
      this.permissionDialogVisible = true
      
      // 这里应该调用API获取该角色的权限数据
      // fetchPermissions(row.id).then(response => {
      //   this.$refs.permissionTree.setCheckedKeys(response.data)
      // })
      
      // 模拟设置已有权限
      if (row.id === 1) {
        // 超级管理员有所有权限
        this.$nextTick(() => {
          this.$refs.permissionTree.setCheckedKeys([11, 12, 13, 21, 22, 23, 31, 32])
        })
      } else if (row.id === 2) {
        // 普通管理员有部分权限
        this.$nextTick(() => {
          this.$refs.permissionTree.setCheckedKeys([11, 12, 21, 22, 31, 32])
        })
      } else if (row.id === 3) {
        // 操作员有少部分权限
        this.$nextTick(() => {
          this.$refs.permissionTree.setCheckedKeys([11, 21, 31, 32])
        })
      } else {
        // 访客只有查看权限
        this.$nextTick(() => {
          this.$refs.permissionTree.setCheckedKeys([31])
        })
      }
    },
    savePermission() {
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      const permissionIds = [...checkedKeys, ...halfCheckedKeys]
      
      // saveRolePermissions({ roleId: this.currentRoleId, permissionIds }).then(() => {
      //   this.permissionDialogVisible = false
      //   this.$notify({
      //     title: '成功',
      //     message: '权限设置成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      // })
      
      this.permissionDialogVisible = false
      this.$notify({
        title: '成功',
        message: '权限设置成功',
        type: 'success',
        duration: 2000
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