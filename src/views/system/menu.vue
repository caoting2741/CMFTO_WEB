<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="menuList"
      element-loading-text="加载中..."
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由地址" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="permission" label="权限标识" />
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 'M'">目录</el-tag>
          <el-tag type="success" v-else-if="scope.row.type === 'C'">菜单</el-tag>
          <el-tag type="warning" v-else-if="scope.row.type === 'F'">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" align="center" />
      <el-table-column prop="visible" label="可见" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleVisibleChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-plus" @click="handleAdd(scope.row)" v-if="scope.row.type !== 'F'">新增</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button 
            type="text" 
            size="small" 
            icon="el-icon-delete" 
            @click="handleDelete(scope.row)"
            v-if="!scope.row.children || scope.row.children.length === 0"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级菜单">
          <treeselect
            v-model="form.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.type !== 'F'">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
              <i slot="suffix" :class="form.icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-if="form.type !== 'F'">
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="form.type === 'C'">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" v-if="form.type !== 'M'">
          <el-input v-model="form.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="显示状态" v-if="form.type !== 'F'" prop="visible">
          <el-radio-group v-model="form.visible">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu'
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import IconSelect from '@/components/IconSelect'

export default {
  name: 'Menu',
  // components: { Treeselect, IconSelect },
  data() {
    return {
      // 菜单列表
      menuList: [
        {
          id: 1,
          name: '系统管理',
          icon: 'el-icon-setting',
          path: '/system',
          component: 'Layout',
          permission: '',
          type: 'M',
          sort: 1,
          visible: true,
          createTime: '2023-01-01 00:00:00',
          children: [
            {
              id: 11,
              name: '用户管理',
              icon: 'el-icon-user',
              path: 'user',
              component: 'system/user',
              permission: 'system:user:list',
              type: 'C',
              sort: 1,
              visible: true,
              createTime: '2023-01-01 00:00:00',
              children: [
                {
                  id: 111,
                  name: '用户查询',
                  icon: '',
                  path: '',
                  component: '',
                  permission: 'system:user:query',
                  type: 'F',
                  sort: 1,
                  visible: true,
                  createTime: '2023-01-01 00:00:00'
                },
                {
                  id: 112,
                  name: '用户新增',
                  icon: '',
                  path: '',
                  component: '',
                  permission: 'system:user:add',
                  type: 'F',
                  sort: 2,
                  visible: true,
                  createTime: '2023-01-01 00:00:00'
                }
              ]
            },
            {
              id: 12,
              name: '角色管理',
              icon: 'el-icon-s-custom',
              path: 'role',
              component: 'system/role',
              permission: 'system:role:list',
              type: 'C',
              sort: 2,
              visible: true,
              createTime: '2023-01-01 00:00:00'
            },
            {
              id: 13,
              name: '菜单管理',
              icon: 'el-icon-menu',
              path: 'menu',
              component: 'system/menu',
              permission: 'system:menu:list',
              type: 'C',
              sort: 3,
              visible: true,
              createTime: '2023-01-01 00:00:00'
            }
          ]
        },
        {
          id: 2,
          name: '系统监控',
          icon: 'el-icon-monitor',
          path: '/monitor',
          component: 'Layout',
          permission: '',
          type: 'M',
          sort: 2,
          visible: true,
          createTime: '2023-01-01 00:00:00',
          children: [
            {
              id: 21,
              name: '在线用户',
              icon: 'el-icon-user',
              path: 'online',
              component: 'monitor/online',
              permission: 'monitor:online:list',
              type: 'C',
              sort: 1,
              visible: true,
              createTime: '2023-01-01 00:00:00'
            },
            {
              id: 22,
              name: '服务监控',
              icon: 'el-icon-s-operation',
              path: 'server',
              component: 'monitor/server',
              permission: 'monitor:server:list',
              type: 'C',
              sort: 2,
              visible: true,
              createTime: '2023-01-01 00:00:00'
            }
          ]
        }
      ],
      // 查询参数
      listQuery: {
        name: ''
      },
      // 表单参数
      form: {
        id: undefined,
        parentId: 0,
        name: '',
        icon: '',
        path: '',
        component: '',
        permission: '',
        type: 'M',
        sort: 0,
        visible: true
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '菜单类型不能为空', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ]
      },
      // 菜单树选项
      menuOptions: [],
      // 弹窗状态
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改菜单',
        create: '添加菜单'
      },
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取菜单列表
    getList() {
      this.listLoading = true
      // 这里应该调用API获取数据
      // getMenuList(this.listQuery).then(response => {
      //   this.menuList = this.handleTree(response.data, 'id', 'parentId')
      //   this.menuOptions = this.buildMenuOptions()
      //   this.listLoading = false
      // })
      
      // 模拟请求延时
      setTimeout(() => {
        // 构建菜单选项
        this.menuOptions = this.buildMenuOptions()
        this.listLoading = false
      }, 500)
    },
    // 搜索过滤
    handleFilter() {
      this.getList()
    },
    // 构建菜单选项
    buildMenuOptions() {
      // 构建树形结构数据
      let options = []
      options.push({
        id: 0,
        label: '主目录',
        children: []
      })
      
      this.menuList.forEach(item => {
        // 递归构建树形结构
        this.buildTreeData(options[0].children, item)
      })
      
      return options
    },
    // 递归构建树形结构
    buildTreeData(target, item) {
      const node = {
        id: item.id,
        label: item.name
      }
      
      if (item.children && item.children.length > 0) {
        node.children = []
        item.children.forEach(child => {
          this.buildTreeData(node.children, child)
        })
      }
      
      target.push(node)
    },
    // treeselect格式化
    normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children || []
      }
    },
    // 选择图标
    selected(icon) {
      this.form.icon = icon
    },
    // 显示状态修改
    handleVisibleChange(row) {
      // 这里应该调用API更新显示状态
      // const data = {
      //   id: row.id,
      //   visible: row.visible
      // }
      // updateMenu(data).then(() => {
      //   this.$message.success('修改成功')
      // })
      
      this.$message.success('修改成功')
    },
    // 重置表单
    resetForm() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: '',
        icon: '',
        path: '',
        component: '',
        permission: '',
        type: 'M',
        sort: 0,
        visible: true
      }
    },
    // 显示新增菜单对话框
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示修改菜单对话框
    handleUpdate(row) {
      this.resetForm()
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示添加子菜单对话框
    handleAdd(row) {
      this.resetForm()
      this.form.parentId = row.id
      // 根据父菜单类型自动设置子菜单类型
      if (row.type === 'M') {
        this.form.type = 'C' // 目录下添加菜单
      } else if (row.type === 'C') {
        this.form.type = 'F' // 菜单下添加按钮
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增菜单
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 这里应该调用API创建菜单
          // const data = Object.assign({}, this.form)
          // addMenu(data).then(() => {
          //   this.dialogFormVisible = false
          //   this.getList()
          //   this.$message.success('新增成功')
          // })
          
          const data = Object.assign({}, this.form)
          data.id = Date.now() // 模拟ID生成
          data.createTime = new Date().toLocaleString() // 模拟创建时间
          
          // 模拟添加到数据列表
          if (data.parentId === 0) {
            // 添加到根菜单
            data.children = []
            this.menuList.push(data)
          } else {
            // 添加到子菜单
            const addToChildren = (list) => {
              for (let i = 0; i < list.length; i++) {
                if (list[i].id === data.parentId) {
                  if (!list[i].children) {
                    list[i].children = []
                  }
                  list[i].children.push(data)
                  return true
                }
                if (list[i].children && list[i].children.length > 0) {
                  if (addToChildren(list[i].children)) {
                    return true
                  }
                }
              }
              return false
            }
            addToChildren(this.menuList)
          }
          
          this.dialogFormVisible = false
          this.menuOptions = this.buildMenuOptions()
          this.$message.success('新增成功')
        }
      })
    },
    // 修改菜单
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 这里应该调用API更新菜单
          // const data = Object.assign({}, this.form)
          // updateMenu(data).then(() => {
          //   this.dialogFormVisible = false
          //   this.getList()
          //   this.$message.success('修改成功')
          // })
          
          const data = Object.assign({}, this.form)
          
          // 模拟更新数据列表
          const updateItem = (list) => {
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === data.id) {
                // 保留children
                const children = list[i].children
                Object.assign(list[i], data)
                list[i].children = children
                return true
              }
              if (list[i].children && list[i].children.length > 0) {
                if (updateItem(list[i].children)) {
                  return true
                }
              }
            }
            return false
          }
          updateItem(this.menuList)
          
          this.dialogFormVisible = false
          this.menuOptions = this.buildMenuOptions()
          this.$message.success('修改成功')
        }
      })
    },
    // 删除菜单
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里应该调用API删除菜单
        // deleteMenu(row.id).then(() => {
        //   this.getList()
        //   this.$message.success('删除成功')
        // })
        
        // 模拟从数据列表中删除
        const deleteItem = (list) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i].id === row.id) {
              list.splice(i, 1)
              return true
            }
            if (list[i].children && list[i].children.length > 0) {
              if (deleteItem(list[i].children)) {
                return true
              }
            }
          }
          return false
        }
        deleteItem(this.menuList)
        
        this.menuOptions = this.buildMenuOptions()
        this.$message.success('删除成功')
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style> 