<template>
  <div class="custom-topic-container">
    <div class="title">
      <div class="title-left">自定义Topic</div>
      <div class="right-btn">
        <el-button type="text" @click="handleAdd" icon="el-icon-plus">创建</el-button>
      </div>
    </div>
    <table-page :table-data="tableData" height="calc(85vh-74px)" :columns="columns" :loading="loading" :show-selection="false"
      :show-index="false" :show-operation="true" :row-key="'topicDefinition'" :show-footer="false"
      :showPagination="false">
      <!-- 是否开启代理订阅 -->
      <template #proxy_sub="{ row }">
        <el-switch v-if="row.type !== 'pub'" @change="handleProxySubChange(row)" v-model="row.proxy_sub" />
      </template>
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
      </template>
    </table-page>
    <global-dialog :title="'定义Topic类'" :visible.sync="dialogFormVisible" width="500px" custom-class="product-dialog"
      @confirm="dialogStatus === 'create' ? createData() : updateData()">
      <div class="tips-container">
        <div class="tips-item">
          Topic 格式必须以“/”进行分层，区分每个类目。其中前三个类目已经规定好，第一个代表产品标识 ProductKey，第二个 ${deviceName} 通配 DeviceName，第三个 user
          用来标识产品的自定义
          Topic 类。简单来说，Topic 类：/a15T****dhK/${deviceName}/user/update 是具体 Topic：/a15T****dhK/mydevice1/user/update 和
          /a15T****dhK/mydevice2/user/update 等的集合。
        </div>
      </div>
      <global-form ref="dataForm" :model="form" :rules="rules" width="460px" :form-items="formItems" label-width="180px"
        :show-footer="false" />
    </global-dialog>
  </div>
</template>

<script>
import TablePage from '@/components/TablePage'
import { createProductTopic, getProductTopics, updateProductTopic, deleteProductTopic } from '@/api/dm'
export default {
  name: 'CustomTopic',
  components: {
    TablePage
  },
  props: {
    productKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        {
          prop: 'topic',
          label: '主题名称',
          minWidth: 200
        },
        {
          prop: 'type',
          label: '操作权限',
          minWidth: 100,
          formatter: (row) => {
            return row.type === 'pub' ? '发布' : row.type === 'sub' ? '订阅' : '发布和订阅'
          }
        },
        {
          prop: 'proxy_sub',
          label: '是否开启代理订阅',
          minWidth: 100,
          slotName: 'proxy_sub'
        },
        {
          prop: 'compressionLevel',
          label: '压缩/解压缩',
          minWidth: 120,
          formatter: (row) => {
            return row.compression_status === true ? '开启' : '关闭'
          }
        },
        {
          prop: 'desc',
          label: '描述',
          minWidth: 150
        }
      ],
      // 表单项配置
      formItems: [
        {
          label: '设备操作权限',
          prop: 'type',
          type: 'select',
          required: true,
          options: [
            { label: '发布', value: 'pub' },
            { label: '订阅', value: 'sub' },
            { label: '发布和订阅', value: 'pubsub' },
          ],
          clearable: false

        },
        {
          label: '主题名称',
          prop: 'topic',
          type: 'input',
          required: true,
        },
        {
          label: '是否开启代理订阅',
          prop: 'proxy_sub',
          type: 'switch',
          required: true,
        },
        {
          label: '是否开启压缩解压缩功能',
          prop: 'compression_status',
          type: 'switch',
          required: true,
        },
        {
          label: '描述',
          prop: 'desc',
          type: 'textarea',
          rows: 3,
          showWordLimit: true,
          maxlength: 100,
        }
      ],
      form: {
        type: 'pub',
        topic: '',
        proxy_sub: false,
        compression_status: false,
        desc: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择设备操作权限', trigger: 'blur' }
        ],
        topic: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ],
      },
      dialogFormVisible: false,
      dialogStatus: 'create'
    }
  },
  created() {

  },
  mounted() {
    this.getTopicList()
  },
  methods: {
    async getTopicList() {
      this.loading = true
      const res = await getProductTopics(this.productKey)
      // console.log('res', res)
      this.tableData = res || []
      this.loading = false
    },
    handleProxySubChange(row) {
      //row.proxy_sub = !row.proxy_sub
      this.$confirm(`确认是否开启代理订阅功能?`, '开启代理订阅', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' 
      }).then(() => {
        updateProductTopic(this.productKey, row.id, row).then(() => {
          this.$notify({
            title: '成功',
            message: '开启代理订阅成功',
            type:'success',
            duration: 2000
          })
          this.getTopicList()
        })
      }).catch(() => {
        row.proxy_sub =!row.proxy_sub
        this.$message({
          type: 'info',
          message: '已取消开启代理订阅'
        });
      });
    },
    handleEdit(row) {
      this.resetForm();
      this.dialogStatus = 'update'
      this.form = row
      this.dialogFormVisible = true
    },
    handleDelete(row) {      
      this.$confirm(`确认是否删除Topic类：${row.topic}?`, '删除Topic类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' 
      }).then(() => {
        deleteProductTopic(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getTopicList()
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = this.$refs.dataForm.getFormData()
          updateProductTopic(this.productKey,this.form.id, params).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type:'success',
              duration: 2000
            })
            this.getTopicList()
            this.dialogFormVisible = false
          }) 
        } 
      })
    },
    createData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let params = this.$refs.dataForm.getFormData()
          createProductTopic(this.productKey, params).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getTopicList()
            this.dialogFormVisible = false
          }).catch(() => {
            this.dialogFormVisible = false
          })

        }
      })
    },
    resetForm() {
      this.form = {
        type: 'pub',
        topic: '',
        proxy_sub: false,
        compression_status: false,
        desc: ''
      }
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-topic-container {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .right-btn {
      margin-left: 10px;
    }
  }

  .tips-container {
    padding: 12px;
    margin-bottom: 16px;
    background-color: #f5f7fa;
    border: 1px solid #CBCBCB;
    border-radius: 4px;

    .tips-item {
      color: #A8A9A8;
      line-height: 1.5;
      font-size: 12px;
    }
  }

  ::v-deep(.content-wrapper) {
    padding: 0;
  }
}
</style>