<template>
  <div>
    <a-skeleton :loading="loading" active />
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总访问量" :total="showVisitNumber.all">
          <a-tooltip title="系统访问量" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div>
            <trend
              :flag="showVisitNumber.today_week_tag"
              style="margin-right: 16px;"
            >
              <span slot="term">周同比</span>
              {{ showVisitNumber.today_week }} %
            </trend>
            <trend :flag="showVisitNumber.today_last_tag">
              <span slot="term">日同比</span>
              {{ showVisitNumber.today_last }} %
            </trend>
          </div>
          <template slot="footer">
            今日访问
            <span>{{ showVisitNumber.today }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="异常报警" :total="showErrorNumber.today">
          <a-tooltip title="未授权及越权访问报警" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div>
            <trend
              :flag="showErrorNumber.today_week_tag"
              style="margin-right: 16px;"
            >
              <span slot="term">周同比</span>
              {{ showErrorNumber.today_week }} %
            </trend>
            <trend :flag="showErrorNumber.today_last_tag">
              <span slot="term">日同比</span>
              {{ showErrorNumber.today_last }} %
            </trend>
          </div>
          <template slot="footer">
            历史报警
            <span>{{ showErrorNumber.all }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="报表导出" :total="showExportNumber.today">
          <a-tooltip title="数据报表导出" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div>
            <trend
              :flag="showExportNumber.today_week_tag"
              style="margin-right: 16px;"
            >
              <span slot="term">周同比</span>
              {{ showExportNumber.today_week }} %
            </trend>
            <trend :flag="showExportNumber.today_last_tag">
              <span slot="term">日同比</span>
              {{ showExportNumber.today_last }} %
            </trend>
          </div>
          <template slot="footer">
            总计导出
            <span>{{ showExportNumber.all }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="文件下载" :total="showDownNumber.today">
          <a-tooltip title="系统文件下载" slot="action"><a-icon type="info-circle-o" /></a-tooltip>
          <div>
            <trend
              :flag="showDownNumber.today_week_tag"
              style="margin-right: 16px;"
            >
              <span slot="term">周同比</span>
              {{ showDownNumber.today_week }} %
            </trend>
            <trend :flag="showDownNumber.today_last_tag">
              <span slot="term">日同比</span>
              {{ showDownNumber.today_last }} %
            </trend>
          </div>
          <template slot="footer">
            总计下载
            <span>{{ showDownNumber.all }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="14" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="系统日志标化指标(七日)" :bordered="false" >
          <ve-histogram :data="chartData.charData" :extend="chartData.extend" :settings="chartData.settingData" :toolbox="toolbox">
          </ve-histogram>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="10" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="系统异常标化瀑布(24小时)" :bordered="false">
          <ve-waterfall :data="chartDataPie.charData" :extend="chartDataPie.extend" :toolbox="toolboxSave">
          </ve-waterfall></a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="14" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="系统日志标化雷达(七日)" :bordered="false" >
          <ve-radar :data="chartData.charData" :extend="chartData.extend" :settings="chartData.settingData" :toolbox="toolboxSave">
          </ve-radar>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="10" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="系统异常标化指标(24小时)" :bordered="false">
          <ve-pie :legend="chartDataPie.legend" :data="chartDataPie.charData" :extend="chartDataPie.extend" :settings="chartDataPie.settingData" :toolbox="toolboxSave">
          </ve-pie></a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import { ChartCard, Trend, NumberInfo } from '@/components'
import { baseMixin } from '@/store/app-mixin'
import 'echarts/lib/component/toolbox'

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    Trend,
    NumberInfo
  },
  data () {
    this.toolbox = {
      feature: {
        magicType: { type: ['line', 'bar', 'stack'] },
        saveAsImage: {}
      }
    }
    this.toolboxSave = {
      feature: {
        saveAsImage: {}
      }
    }
    return {
      chartData: {},
      chartDataPie: {},
      loading: false,
      showVisitNumber: {},
      showErrorNumber: {},
      showExportNumber: {},
      showDownNumber: {}
    }
  },
  methods: {
    moment,
    getChartsLine () {
      this.executeUnify('analysis', 'chart_resonLog', '', {}).then(res => {
        var resData = this.dataClean(res)
        this.chartData = resData
      })
    },
    getChartsErrorLogger () {
      this.executeUnify('analysis', 'chart_errorLogger', '', {}).then(res => {
        var resData = this.dataClean(res)
        this.chartDataPie = resData
      })
    },
    getLoggerAnalysis (reson, sourceTag, type) {
      const data = {
        reson: reson,
        sourceTag: sourceTag,
        type: type
      }
      this.executeUnify('analysis', 'getLoggerAnalysis', '', data).then(res => {
        var resData = this.dataClean(res)
        if (type === 0) {
          this.showVisitNumber = resData
        } else if (type === 1) {
          this.showErrorNumber = resData
        } else if (type === 2) {
          this.showExportNumber = resData
        } else if (type === 3) {
          this.showDownNumber = resData
        }
        this.loading = false
      })
    }
  },
  created () {
    this.loading = true
    this.getChartsLine()
    this.getChartsErrorLogger()
    this.getLoggerAnalysis('0', '', 0)
    this.getLoggerAnalysis('', '1', 1)
    this.getLoggerAnalysis('3', '', 2)
    this.getLoggerAnalysis('9', '', 3)
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
