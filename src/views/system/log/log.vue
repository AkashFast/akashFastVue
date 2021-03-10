<template>
  <div :title="false">
    <a-form-model :layout="form.layout" :model="form">
      <a-form-model-item label="用户姓名"><a-input v-model="form.name" placeholder="请输入要检索的用户姓名" /></a-form-model-item>
      <a-form-model-item label="操作类型">
        <a-select v-model="form.reson" style="width: 200px">
          <a-select-option value="-1">全部</a-select-option>
          <a-select-option value="0">登录请求</a-select-option>
          <a-select-option value="3">数据导出</a-select-option>
          <a-select-option value="1">接口访问</a-select-option>
          <a-select-option value="11">执行新增</a-select-option>
          <a-select-option value="22">执行更新</a-select-option>
          <a-select-option value="33">执行删除</a-select-option>
          <a-select-option value="2">文件上传</a-select-option>
          <a-select-option value="9">文件下载</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="执行结果">
        <a-select v-model="form.sourceTag" style="width: 200px">
          <a-select-option value="-1">全部</a-select-option>
          <a-select-option value="1">成功</a-select-option>
          <a-select-option value="0">失败</a-select-option>
          <a-select-option value="2">非法请求</a-select-option>
          <a-select-option value="3">越权访问</a-select-option>
        </a-select>
      </a-form-model-item>
      <br>
      <a-form-model-item label="访问地址"><a-input v-model="form.ip" placeholder="请输入要检索的IP地址" /></a-form-model-item>
      <a-form-model-item label="检索区间">
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['请选择开始时间', '请选择结束时间']"
          @change="onChange"
          @ok="onOk"
          style="width: 350px"/>
      </a-form-model-item>
      <a-form-model-item><a-button type="primary" style="width: 130px;" @click="changePage">检索</a-button></a-form-model-item>
      <a-form-model-item><a-button type="primary" style="width: 130px;" @click="exportLogData">导出</a-button></a-form-model-item>
    </a-form-model>
    <br />
    <a-table
      rowKey="id"
      :pagination="pagination"
      @change="changePage"
      :columns="columns"
      :data-source="data"
      :loading="loading">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <template #expandedRowRender="record">
        <a-form-model :layout="form.layout" :model="record">
          <a-form-model-item label="调用方法">{{ record.methodName }}</a-form-model-item>
          <br>
          <a-form-model-item label="响应信息">{{ record.sourceData }}</a-form-model-item>
          <br>
          <a-form-model-item label="请求参数">{{ record.exe_data }}</a-form-model-item>
        </a-form-model>
      </template>
      <template slot="action" slot-scope="text, record" style="background-color: grey;">
        <a-button type="danger" style="width: 100px;" @click="deleteData(record)">删除</a-button>
      </template>
    </a-table>
    <a-modal :title="modalTitle" :visible="modalVisible" :confirm-loading="confirmLoading" @ok="modalOk" @cancel="modalCancel">
      <p>{{ modalText }}</p>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      selData: '',
      // modal模态提示框「删除提示」
      modalTitle: '',
      modalVisible: false,
      confirmLoading: false,
      modalText: '',
      modalId: '',
      modalState: 0,
      // modal数据还原标识
      modalBack: false,
      // 分页栏设置
      pagination: {
        total: 0,
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        showQuickJumper: true,
        style: {
          textAlign: 'center',
          width: '100%',
          marginTop: '25px'
        },
        postion: 'both',
        pageSizeOptions: ['10', '20', '50', '100'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      // 筛选条件
      form: {
        layout: 'inline',
        name: '',
        ip: '',
        startDate: '',
        endDate: '',
        reson: '-1',
        sourceTag: '-1'
      },
      // 主数据属性
      data: [],
      pageNo: 0,
      pageSize: 10,
      scrollX: 1500,
      columns: [
        {
          title: '用户姓名',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          align: 'center'
        },
        {
          title: '访问ip',
          dataIndex: 'log_ip',
          key: 'log_ip',
          align: 'center'
        },
        {
          title: '操作类型',
          dataIndex: 'reson',
          key: 'reson',
          align: 'center',
          customRender: (text, row, index) => {
            return text === 0 ? '登录请求' : text === 1 ? '接口访问' : text === 2 ? '文件上传' : text === 3 ? '数据导出' : text === 11 ? '执行新增相关方法' : text === 22 ? '执行更新相关方法' : text === 33 ? '执行删除相关方法' : text === 9 ? '文件下载' : '未定义'
          }
        },
        {
          title: '执行结果',
          dataIndex: 'sourceTag',
          key: 'sourceTag',
          align: 'center',
          customRender: (text, row, index) => {
            return text === 0 ? '失败' : text === 1 ? '成功' : text === 2 ? '未登录「非法访问」' : text === 3 ? '越权访问' : '未定义'
          }
        },
        {
          title: '执行时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          customRender: (text, row, index) => {
            return text === undefined ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false
    }
  },
  created () {
    this.getTableList()
  },
  methods: {
    moment,
    // 数据导出
     exportLogData () {
      this.exportFile('logger', 'exportLoggerData', '', this.selData).then(res => {
        this.exportData(res, '系统日志信息')
     })
    },
    onChange (value, dateString) {
      this.form.startDate = dateString[0]
      this.form.endDate = dateString[1]
    },
    // 分页操作
    changePage (pagination) {
      if (pagination.current === undefined) {
        this.pageNo = 0
        this.pagination.current = 0
      } else {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.pageNo = pagination.current
        this.pageSize = pagination.pageSize
      }
      this.getTableList()
    },
    // 点击「删除 / 屏蔽」按钮
    deleteData (record) {
      var stateMsg = '删除'
      this.modalVisible = true
      this.modalTitle = '确认' + stateMsg + '?'
      this.modalText = '是否确认将当前选中数据' + stateMsg + '?'
      this.modalId = record.id
      this.modalState = record.state
    },
    // 模态框取消
    modalCancel () {
      this.modalVisible = false
    },
    // 模态框确认
    modalOk () {
      var data = {
        id: this.modalId,
        del_submit: 1
      }
      this.executeUnify('', 'deleteData', 'fe7f3a7e331e45cb8a682d931190f017', data).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('日志删除成功')
          this.modalVisible = false
          this.confirmLoading = false
          if (data.id !== undefined) {
            this.getTableList()
          }
        }
      })
    },
    // 根据条件获取Table数据
    getTableList () {
      const data = {
        ip: this.form.ip,
        name: this.form.name,
        sourceTag: this.form.sourceTag,
        sDate: this.form.startDate,
        eDate: this.form.endDate,
        reson: this.form.reson,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      var _this = this
      _this.selData = data
      _this.loading = true
      _this.executeUnify('logger', 'selectLogger', null, data).then(res => {
        var data = _this.dataClean(res)
        _this.data = data.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        _this.pagination = pagination
        _this.loading = false
      })
    }
  }
}
</script>
