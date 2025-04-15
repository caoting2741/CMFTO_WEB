<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>系统概况</h1>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div slot="header" class="clearfix">
            <span>产品数量</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon1">
              <i class="el-icon-s-goods card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总产品数</div>
              <count-to :start-val="0" :end-val="5" :duration="2000" class="card-panel-num" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div slot="header" class="clearfix">
            <span>设备数量</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon2">
              <i class="el-icon-cpu card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总设备数</div>
              <count-to :start-val="0" :end-val="126" :duration="2000" class="card-panel-num" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div slot="header" class="clearfix">
            <span>在线设备</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon3">
              <i class="el-icon-connection card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">在线设备数</div>
              <count-to :start-val="0" :end-val="87" :duration="2000" class="card-panel-num" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card shadow="hover" class="data-card">
          <div slot="header" class="clearfix">
            <span>告警</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon4">
              <i class="el-icon-warning card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">今日告警数</div>
              <count-to :start-val="0" :end-val="3" :duration="2000" class="card-panel-num" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>设备状态统计</span>
          </div>
          <div style="height: 300px;">
            <!-- 在实际项目中使用 ECharts 等图表库渲染 -->
            <div class="chart-placeholder">
              <div class="pie-chart">
                <div class="pie-legend">
                  <div><span class="legend-icon online"></span>在线: 69%</div>
                  <div><span class="legend-icon offline"></span>离线: 31%</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>最近一周设备接入量</span>
          </div>
          <div style="height: 300px;">
            <!-- 在实际项目中使用 ECharts 等图表库渲染 -->
            <div class="chart-placeholder">
              <div class="bar-chart">
                <div class="bar-item" style="height: 30%;"></div>
                <div class="bar-item" style="height: 50%;"></div>
                <div class="bar-item" style="height: 70%;"></div>
                <div class="bar-item" style="height: 90%;"></div>
                <div class="bar-item" style="height: 70%;"></div>
                <div class="bar-item" style="height: 60%;"></div>
                <div class="bar-item" style="height: 80%;"></div>
              </div>
              <div class="bar-labels">
                <div class="bar-label">周一</div>
                <div class="bar-label">周二</div>
                <div class="bar-label">周三</div>
                <div class="bar-label">周四</div>
                <div class="bar-label">周五</div>
                <div class="bar-label">周六</div>
                <div class="bar-label">周日</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>最近告警</span>
          </div>
          <el-table :data="alarmData" style="width: 100%">
            <el-table-column prop="time" label="告警时间" width="180"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
            <el-table-column prop="type" label="告警类型"></el-table-column>
            <el-table-column prop="content" label="告警内容"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === '已处理' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 简单模拟countTo组件
const CountTo = {
  name: 'CountTo',
  props: {
    startVal: {
      type: Number,
      default: 0
    },
    endVal: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      displayValue: this.startVal
    }
  },
  mounted() {
    this.animate()
  },
  methods: {
    animate() {
      const startTime = Date.now()
      const endValue = this.endVal
      const startValue = this.startVal
      const duration = this.duration
      const that = this

      function animateValue() {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime
        
        if (elapsedTime < duration) {
          const percentage = elapsedTime / duration
          that.displayValue = Math.floor(startValue + percentage * (endValue - startValue))
          requestAnimationFrame(animateValue)
        } else {
          that.displayValue = endValue
        }
      }
      
      requestAnimationFrame(animateValue)
    }
  },
  render(h) {
    return h('span', {}, [this.displayValue])
  }
}

export default {
  name: 'Dashboard',
  components: {
    CountTo
  },
  data() {
    return {
      alarmData: [
        { time: '2023-06-10 08:23:15', deviceName: '客厅温控器', type: '温度异常', content: '温度超过设定阈值(35°C)', status: '未处理' },
        { time: '2023-06-10 07:15:33', deviceName: '前门门锁', type: '电量警告', content: '设备电量低于20%', status: '未处理' },
        { time: '2023-06-09 22:45:10', deviceName: '卧室空气检测仪', type: '空气质量异常', content: 'PM2.5指数超过150', status: '已处理' },
        { time: '2023-06-09 16:30:22', deviceName: '厨房温控器', type: '连接异常', content: '设备离线超过2小时', status: '已处理' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  
  .dashboard-header {
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      color: #303133;
      margin: 0;
    }
  }

  .data-card {
    margin-bottom: 20px;
    
    .card-panel {
      display: flex;
      align-items: center;
      height: 108px;
      
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
        
        &.icon1 {
          background: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &.icon2 {
          background: rgba(47, 194, 91, 0.1);
          color: #2fc25b;
        }
        
        &.icon3 {
          background: rgba(250, 173, 20, 0.1);
          color: #faad14;
        }
        
        &.icon4 {
          background: rgba(245, 34, 45, 0.1);
          color: #f5222d;
        }
      }
      
      .card-panel-icon {
        font-size: 48px;
      }
      
      .card-panel-description {
        margin-left: 15px;
        
        .card-panel-text {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;
          margin-bottom: 12px;
        }
        
        .card-panel-num {
          font-size: 30px;
          line-height: 38px;
          font-weight: bold;
        }
      }
    }
  }

  .chart-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .pie-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(#1890ff 0% 69%, #d9d9d9 69% 100%);
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        background: white;
        border-radius: 50%;
      }
      
      .pie-legend {
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
        
        .legend-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          margin-right: 8px;
          border-radius: 2px;
          vertical-align: middle;
          
          &.online {
            background-color: #1890ff;
          }
          
          &.offline {
            background-color: #d9d9d9;
          }
        }
      }
    }
    
    .bar-chart {
      width: 80%;
      height: 200px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .bar-item {
        width: 30px;
        background-color: #1890ff;
        border-radius: 4px 4px 0 0;
      }
    }
    
    .bar-labels {
      width: 80%;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      
      .bar-label {
        width: 30px;
        text-align: center;
        font-size: 12px;
        color: #606266;
      }
    }
  }
}
</style> 