<template>
  <div class="app-container">
    <div class="product-basic">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="product-field">
            <div class="field-label">ProductKey</div>
            <div class="field-value">
              {{ product.productKey }}
              <el-button class="copy-btn" icon="el-icon-document-copy" type="text"
                @click="copyToClipboard(product.productKey)">复制</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="product-field">
            <div class="field-label">ProductSecret</div>
            <div class="field-value">
              {{ showSecret ? product.productSecret : '****************' }}
              <el-button class="copy-btn" icon="el-icon-view" type="text" @click="toggleSecret">{{ showSecret ? '隐藏' :
                '查看' }}</el-button>
              <el-button v-if="showSecret" class="copy-btn" icon="el-icon-document-copy" type="text"
                @click="copyToClipboard(product.productSecret)">复制</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="product-tabs">
      <tab-view :tabs="tabs" v-model="activeTab">
        <!-- 物模型 Tab -->
        <div v-if="activeTab === 'basic'" class="tab-pane">
          <Descriptions :items="basicInfoItems" :column="3" size="small"></Descriptions>
        </div>
        <!-- Topic列表 Tab -->
        <div v-else-if="activeTab === 'topic'" class="tab-pane">
          <div class="topic-content">
            <el-table :data="topicList" border style="width: 100%">
              <el-table-column prop="function" label="功能" width="150" align="center"></el-table-column>
              <el-table-column prop="topic" label="Topic类" align="center"></el-table-column>
              <el-table-column prop="operation" label="操作权限" width="120" align="center"></el-table-column>
              <el-table-column prop="description" label="描述" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 功能定义 Tab -->
        <div v-else-if="activeTab === 'func'" class="tab-pane">
        </div>
        <!-- 预置规则 Tab -->
        <div v-else-if="activeTab === 'rule'" class="tab-pane">
        </div>
      </tab-view>
    </div>
  </div>
</template>

<script>
import EventBus from '@/utils/event-bus'

export default {
  name: 'ProductDetail',
  data() {
    return {
      productId: null,
      showSecret: false,
      product: {
        id: 1,
        name: '智能温控器',
        type: '温控设备',
        productKey: 'a1csQL7tvf',
        productSecret: 'eM54HxIMoZGhO2qb',
        deviceCount: 15,
        status: 1,
        createTime: '2023-01-15 14:23:55',
        updateTime: '2023-05-20 09:18:32',
        desc: '智能温控器产品是一种可通过网络远程控制的温度调节设备，支持多种传感器接入，可自动根据环境温度变化进行调节，提供智能家居场景联动功能。'
      },
      tabs: [
        { name: 'basic', label: '产品详情' },
        { name: 'topic', label: 'Topic定义' },
        { name: 'func', label: '功能定义' },
        { name: 'rule', label: '预置规则' }
      ],
      activeTab: 'basic',
      // 物模型数据
      modelList: [
        {
          name: '温度',
          identifier: 'temperature',
          dataType: 'float',
          accessMode: 'r',
          min: -40,
          max: 100,
          step: 0.1,
          unit: '℃'
        },
        {
          name: '湿度',
          identifier: 'humidity',
          dataType: 'float',
          accessMode: 'r',
          min: 0,
          max: 100,
          step: 0.1,
          unit: '%'
        },
        {
          name: '工作模式',
          identifier: 'mode',
          dataType: 'enum',
          accessMode: 'rw',
          specs: {
            '0': '自动',
            '1': '制冷',
            '2': '制热',
            '3': '送风'
          }
        },
        {
          name: '开关状态',
          identifier: 'power',
          dataType: 'bool',
          accessMode: 'rw',
          specs: {
            '0': '关',
            '1': '开'
          }
        }
      ],
      // Topic数据
      topicList: [
        { function: '属性上报', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/event/property/post', operation: '发布', description: '设备属性上报' },
        { function: '属性上报响应', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/event/property/post_reply', operation: '订阅', description: '云端响应属性上报' },
        { function: '属性设置', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/service/property/set', operation: '订阅', description: '设备属性设置' },
        { function: '事件上报', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/event/${tsl.event.identifier}/post', operation: '发布', description: '设备事件上报' },
        { function: '事件上报响应', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/event/${tsl.event.identifier}/post_reply', operation: '订阅', description: '云端响应事件上报' },
        { function: '服务调用', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/service/${tsl.service.identifier}', operation: '发布', description: '设备服务调用' },
        { function: '服务调用响应', topic: '/sys/a12BMOxFrnT/${deviceName}/thing/service/${tsl.service.identifier}_reply', operation: '订阅', description: '设备响应服务调用' }
      ],
      // 产品配置描述项
      productConfigItems: [
        { label: '节点类型', value: '设备' },
        { label: '连接协议', value: 'MQTT' },
        { label: '认证方式', value: '设备密钥认证' },
        { label: '数据格式', value: 'JSON' },
        { label: '是否接入网关', value: '否' },
        { label: '自动定位', value: '否' }
      ],
    }
  },
  computed: {
    // 基本信息描述项（作为计算属性）
    basicInfoItems() {
      return [
        { label: '产品ID', value: this.product.id },
        { label: '产品名称', value: this.product.name },
        { label: '产品类型', value: this.product.type },
        { label: '动态注册', value: '已开启' },
        { label: '鉴权类型', value: '设备密钥' },
        { label: '产品状态', value: this.product.status === 1 ? '已发布' : '开发中' },
        { label: '在线设备', value: Math.round(this.product.deviceCount * 0.8) + ' 台' },
        { label: '离线设备', value: Math.round(this.product.deviceCount * 0.2) + ' 台' },        
        { label: '创建时间', value: this.product.createTime },
        { label: '产品描述', value: this.product.desc},
      ]
    }
  },
  created() {
    this.productId = this.$route.params.id
    this.getProductDetail()

    // 监听事件总线上的编辑和删除事件
    EventBus.$on('product-detail:back', this.goBack)
  },
  beforeDestroy() {
    // 移除事件监听
    EventBus.$off('product-detail:back', this.goBack)
  },
  methods: {
    // 获取产品详情
    getProductDetail() {
      // 实际项目中需调用API获取产品详情
      // 这里使用模拟数据
      this.product = {
        id: this.productId,
        name: '智能温控器',
        type: '温控设备',
        productKey: 'a1csQL7tvf',
        productSecret: 'eM54HxIMoZGhO2qb',
        deviceCount: 15,
        status: 1,
        createTime: '2023-01-15 14:23:55',
        updateTime: '2023-05-20 09:18:32',
        desc: '智能温控器产品是一种可通过网络远程控制的温度调节设备，支持多种传感器接入，可自动根据环境温度变化进行调节，提供智能家居场景联动功能。'
      }
    },
    // 处理产品编辑事件
    handleProductEdit(productId) {
      this.$message.info(`编辑产品: ${productId}`)
      // 实际项目中可以跳转到编辑页面或打开编辑弹窗
    },
    // 处理产品删除事件
    handleProductDelete(productId) {
      this.$message.success(`产品 ${productId} 已删除`)
      // 删除成功后返回到列表页
      this.$router.push('/product/list')
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    // 切换显示/隐藏密钥
    toggleSecret() {
      this.showSecret = !this.showSecret
    },
    // 复制到剪贴板
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('已复制到剪贴板')
      }).catch(() => {
        this.$message.error('复制失败')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.product-basic {
  margin-top: 20px;
  padding: 10px 20px;
}

.product-field {
  display: flex;
  margin-right: 40px;
  align-items: center;

  .field-label {
    font-size: 13px;
    color: #909399;
    margin-right: 10px;
  }

  .field-value {
    font-size: 14px;
    display: flex;
    align-items: center;

    .copy-btn {
      margin-left: 5px;
      padding: 2px;
    }
  }
}

.product-tabs {
  // background-color: #fff;
  // border-radius: 4px;
  // border: 1px solid #ebeef5;
  // overflow: hidden;
  margin-top: 10px;
  padding: 0 20px;
}

.tab-pane {
  min-height: 300px;
}

.mt20 {
  margin-top: 20px;
}

.device-header {
  display: flex;
  margin-bottom: 15px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  i {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 20px;
  }

  p {
    color: #909399;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>