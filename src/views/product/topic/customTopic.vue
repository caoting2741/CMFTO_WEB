<template>
  <div class="custom-topic-container">
    <table-page
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :show-selection="false"
      :show-index="false"
      :show-operation="true"
      
    >
      <!-- 操作列 -->
      <template #operation="{ row }">
        <el-button
          type="primary"
          size="mini"
          @click="handleEdit(row)"
        >编辑</el-button>
        <el-button
          type="danger"
          size="mini"
          @click="handleDelete(row)"
        >删除</el-button>
      </template>
    </table-page>
  </div>
</template>

<script>
import TablePage from '@/components/TablePage'

export default {
  name: 'CustomTopic',
  components: {
    TablePage
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        {
          prop: 'topicDefinition',
          label: '自定义Topic',
          minWidth: 200
        },
        {
          prop: 'operationPermission',
          label: '操作权限',
          minWidth: 100
        },
        {
          prop: 'isEnabled',
          label: '是否开启',
          minWidth: 100,
          formatter: (row) => {
            return row.isEnabled ? '是' : '否'
          }
        },
        {
          prop: 'compressionLevel',
          label: '压缩/解压缩',
          minWidth: 120
        },
        {
          prop: 'description',
          label: '描述',
          minWidth: 150
        }
      ]
    }
  },
  methods: {
  
    handleEdit(row) {
      console.log('编辑行：', row)
    },
    handleDelete(row) {
      console.log('删除行：', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-topic-container {
  padding: 20px;
  height: 100%;
}
</style>