<template>
  <div class="topic-list-container">
    <el-table :data="topicList" border style="width: 100%" :span-method="objectSpanMethod">
      <el-table-column prop="function" label="功能" width="150" align="center"></el-table-column>
      <el-table-column prop="topic" label="Topic类" align="center"></el-table-column>
      <el-table-column prop="operation" label="操作权限" width="120" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TopicList',
  props: {
    // 接收 topic 类型
    topicType: {
      type: [Number, String],
      default: 1
    },
    // 产品 key
    productKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 合并单元格的映射
      spanMap: {},
      // Topic 数据
      topicList: []
    }
  },
  watch: {
    topicType: {
      handler(val) {
        this.loadTopicList()
      },
      immediate: true
    },
    productKey: {
      handler(val) {
        if (val) {
          this.loadTopicList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 加载 Topic 列表数据
    loadTopicList() {
      // 根据 topicType 加载不同的 Topic 列表
      if (this.topicType == 1) {
        // 基础通信 Topic
        this.topicList = [
          { function: 'OTA 升级', topic: `/ota/device/inform/${this.productKey}/\${deviceName}`, operation: '发布', description: '设备上报固件升级信息' },
          { function: 'OTA 升级', topic: `/ota/device/upgrade/${this.productKey}/\${deviceName}`, operation: '订阅', description: '固件升级信息下行' },
          { function: 'OTA 升级', topic: `/ota/device/progress/${this.productKey}/\${deviceName}`, operation: '发布', description: '设备上报固件升级进度' },
          { function: 'OTA 升级', topic: `/sys/${this.productKey}/\${deviceName}/thing/ota/firmware/get`, operation: '发布', description: '设备主动拉取固件升级信息' },
          { function: '设备标签', topic: `/sys/${this.productKey}/\${deviceName}/thing/deviceinfo/update`, operation: '发布', description: '设备上报标签数据' },
          { function: '设备标签', topic: `/sys/${this.productKey}/\${deviceName}/thing/deviceinfo/update_reply`, operation: '订阅', description: '云端响应标签上报' },
          { function: '设备标签', topic: `/sys/${this.productKey}/\${deviceName}/thing/deviceinfo/delete`, operation: '订阅', description: '设备删除标签信息' },
          { function: '设备标签', topic: `/sys/${this.productKey}/\${deviceName}/thing/deviceinfo/delete_reply`, operation: '发布', description: '云端响应标签删除' },
          { function: '时间同步', topic: `/ext/ntp/${this.productKey}/\${deviceName}/request`, operation: '发布', description: 'NTP 时间同步请求' },
          { function: '时间同步', topic: `/ext/ntp/${this.productKey}/\${deviceName}/response`, operation: '订阅', description: 'NTP 时间同步响应' },
          { function: '设备影子', topic: `/shadow/update/${this.productKey}/\${deviceName}`, operation: '发布', description: '设备影子发布' },
          { function: '设备影子', topic: `/shadow/get/${this.productKey}/\${deviceName}`, operation: '订阅', description: '设备读取影子更新' },
          { function: '配置更新', topic: `/sys/${this.productKey}/\${deviceName}/thing/config/push`, operation: '订阅', description: '云端主动下推配置信息' },
          { function: '配置更新', topic: `/sys/${this.productKey}/\${deviceName}/thing/config/get`, operation: '发布', description: '设备端查询配置信息' },
          { function: '配置更新', topic: `/sys/${this.productKey}/\${deviceName}/thing/config/get_reply`, operation: '订阅', description: '云端响应配置信息' },
          { function: '广播', topic: `/broadcast/${this.productKey}/\${identifier}`, operation: '订阅', description: '广播 Topic，identifier 为用户自定义字符串'}
        ]
      } else if (this.topicType == 2) {
        // 物模型通信 Topic
        this.topicList = [
          { function: '属性上报', topic: `/sys/${this.productKey}/\${deviceName}/thing/event/property/post`, operation: '发布', description: '设备属性上报' },
          { function: '属性上报', topic: `/sys/${this.productKey}/\${deviceName}/thing/event/property/post_reply`, operation: '订阅', description: '云端响应属性上报' },
          { function: '属性设置', topic: `/sys/${this.productKey}/\${deviceName}/thing/service/property/set`, operation: '订阅', description: '设备属性设置' },
          { function: '事件上报', topic: `/sys/${this.productKey}/\${deviceName}/thing/event/\${tsl.event.identifier}/post`, operation: '发布', description: '设备事件上报' },
          { function: '事件上报', topic: `/sys/${this.productKey}/\${deviceName}/thing/event/\${tsl.event.identifier}/post_reply`, operation: '订阅', description: '云端响应事件上报' },
          { function: '服务调用', topic: `/sys/${this.productKey}/\${deviceName}/thing/service/\${tsl.service.identifier}`, operation: '订阅', description: '设备服务调用' },
          { function: '服务调用', topic: `/sys/${this.productKey}/\${deviceName}/thing/service/\${tsl.service.identifier}_reply`, operation: '发布', description: '设备响应服务调用' }
        ]
      } else {
        // 自定义 Topic
        this.topicList = []
      }
      
      // 计算合并单元格
      this.calculateSpanMap()
    },
    
    // 计算合并单元格的映射
    calculateSpanMap() {
      this.spanMap = {}
      
      if (this.topicList.length === 0) return
      
      // 按功能分组
      const groups = {}
      this.topicList.forEach(item => {
        if (!groups[item.function]) {
          groups[item.function] = []
        }
        groups[item.function].push(item)
      })
      
      // 计算每个功能的行数和起始位置
      let index = 0
      Object.keys(groups).forEach(key => {
        const items = groups[key]
        this.spanMap[index] = {
          rowspan: items.length,
          colspan: 1
        }
        index += items.length
      })
    },
    
    // 合并单元格方法
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const rowspan = this.getRowspan(rowIndex)
        if (rowspan) {
          return {
            rowspan: rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    
    // 获取指定行的合并行数
    getRowspan(rowIndex) {
      // 如果当前行是功能的第一行，返回合并的行数
      if (this.spanMap[rowIndex]) {
        return this.spanMap[rowIndex].rowspan
      }
      
      // 检查当前行是否在某个合并范围内
      for (const startIndex in this.spanMap) {
        const span = this.spanMap[startIndex]
        const endIndex = parseInt(startIndex) + span.rowspan - 1
        if (rowIndex > parseInt(startIndex) && rowIndex <= endIndex) {
          return 0 // 在合并范围内但不是第一行，返回0
        }
      }
      
      return 1 // 默认不合并
    }
  }
}
</script>

<style lang="scss" scoped>
.topic-list-container {
  //margin-top: 10px;
}
</style>