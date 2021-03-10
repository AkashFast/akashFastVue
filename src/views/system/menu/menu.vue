<template>
  <div :title="false">
    <a-layout id="components-layout-demo-responsive">
      <a-layout-sider breakpoint="lg" width="25%" collapsed-width="0" style="background-color: #FFFFFF;">
        <a-layout-header :style="{ color: 'white', textAlign: 'center', background: 'rgba(0, 0, 0, 0.65)', padding: 0 }"></a-layout-header>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <a-tree checkable style="height:650px;overflow:auto" :tree-data="treeData" @select="treeNodeClick" :showLine="true">
            <template v-slot:title0010>
              <span style="color: #1890ff">sss</span>
            </template>
          </a-tree>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-header :style="{ color: 'white', textAlign: 'center', background: 'rgba(0, 0, 0, 0.65)', marginLeft: '10px', padding: 0 }">
          {{ menuData.name || '新建菜单' }}
        </a-layout-header>
        <a-layout-content :style="{ marginLeft: '10px' }">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <a-form-model layout="horizontal" :model="menuData" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
              <a-form-model-item label="是否父级">
                <a-radio-group v-model="menuData.is_parent">
                  <a-radio-button value="1">是</a-radio-button>
                  <a-radio-button value="0">否</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="父级节点">
                <a-select v-model="menuData.pid" style="width: 200px">
                  <a-select-option value="-1">{{ systemName }}</a-select-option>
                  <a-select-option v-for="sec in parentNode" :key="sec.id">{{ sec.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="菜单名称"><a-input v-model="menuData.name" placeholder="请输入菜单名称" /></a-form-model-item>
              <a-form-model-item label="菜单备注"><a-input v-model="menuData.note" placeholder="请输入菜单备注" /></a-form-model-item>
              <a-form-model-item label="阶次序列"><a-input type="number" v-model="menuData.order_number" placeholder="请输入当前菜单的排序值" /></a-form-model-item>
              <a-form-model-item label="是否锁定">
                <a-radio-group v-model="menuData.is_lock">
                  <a-radio-button value="1">是</a-radio-button>
                  <a-radio-button value="0">否</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="路由标识"><a-input v-model="menuData.code" placeholder="请输入路由code标识" /></a-form-model-item>
              <a-form-model-item label="路由图标"><a-input v-model="menuData.icon" placeholder="请输入路由icon名称" /></a-form-model-item>
              <a-form-model-item label="路由路径"><a-input v-model="menuData.path" placeholder="请输入路由path路径" /></a-form-model-item>
              <a-form-model-item label="组件地址"><a-input v-model="menuData.component" placeholder="请输入路由component组件地址" /></a-form-model-item>
              <a-form-model-item label="指定页面"><a-input v-model="menuData.redirect_page" placeholder="请输入当前路由指定打开的页面「配置跳转/首页」" /></a-form-model-item>
              <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 30 }">
                <a-popconfirm placement="topLeft" ok-text="确认" cancel-text="取消" @confirm="onSave">
                  <template v-slot:title>
                    <p>是否确认{{ menuData.id ? '保存' : '新增' }}当前菜单数据?</p>
                  </template>
                  <a-button type="primary" style="width: 30%;">{{ menuData.id ? '保存' : '新增' }}</a-button>
                </a-popconfirm>
                <a-button @click="resetData" type="primary" :style="'width: 30%;margin-left: 5%;'">重置数据</a-button>
                <a-popconfirm
                  placement="topLeft"
                  ok-text="提交"
                  cancel-text="返回"
                  @confirm="deleteDataNode(menuData)"
                  v-if="menuData.id"
                  :disabled="menuData.id === undefined || menuData.is_lock === '1'">
                  <template v-slot:title>
                    <p>是否确定移除当前菜单？</p>
                  </template>
                  <a-button type="danger" style="width: 30%;margin-left: 5%;">删除菜单</a-button>
                </a-popconfirm>
              </a-form-item>
            </a-form-model>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout :style="{ width: '16%' }">
        <a-layout-header :style="{ color: 'white', textAlign: 'center', background: 'rgba(0, 0, 0, 0.65)', marginLeft: '10px', padding: 0 }">数据源设定</a-layout-header>
        <a-layout-content :style="{ marginLeft: '10px' }">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <a-button :disabled="menuData.id === undefined" type="primary" style="float: right;width: 100px;" @click="addData()">新增数据源</a-button>
            <br />
            <br />
            <a-table rowKey="id" :columns="columns" :data-source="data" :loading="loading">
              <a slot="name" slot-scope="text">{{ text }}</a>
              <template #expandedRowRender="record">
                <a-form-model :layout="form.layout" :model="record">
                  <a-form-model-item label="禁用字段">{{ record.filedBan }}</a-form-model-item>
                  <br />
                  <a-form-model-item label="禁用方法">{{ record.methods }}</a-form-model-item>
                  <br />
                </a-form-model>
              </template>
              <template slot="action" slot-scope="text, record" style="background-color: grey;">
                <a-popconfirm placement="topLeft" ok-text="提交" cancel-text="返回" @confirm="deleteData(record)">
                  <template v-slot:title>
                    <p>是否确定移除当前数据源？</p>
                  </template>
                  <a-button type="danger">移除数据源</a-button>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-drawer
      width="650"
      title="数据源管理"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible">
      <a-form-model layout="horizontal" :model="drawerData" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item label="数据类型">
          <a-select v-model="drawerData.type" @change="changeData">
            <a-select-option value="-1">请选择数据类型</a-select-option>
            <a-select-option value="0">数据表</a-select-option>
            <a-select-option value="1">逻辑方法</a-select-option>
            <a-select-option value="2">数据引擎</a-select-option>
          </a-select>
        </a-form-model-item>
        <br />
        <a-form-model-item label="数据源">
          <a-select v-model="drawerData.tid">
            <a-select-option value="">请选择数据源</a-select-option>
            <a-select-option v-for="sec in sourceData" :key="sec.id">{{ sec.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <br />
        <a-form-model-item label="字段禁用"><a-input v-model="drawerData.filedBan" placeholder="请输入禁用字段,多个字段间用,隔开" /></a-form-model-item>
        <br />
        <a-form-model-item label="方法禁用"><a-input v-model="drawerData.methods" placeholder="请输入禁用方法名称,多个方法名称间用,隔开" /></a-form-model-item>
      </a-form-model>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }"
      >
        <a-popconfirm placement="topRight" ok-text="提交" cancel-text="返回" @confirm="onSaveData">
          <template v-slot:title>
            <p>{{ confirm }}</p>
          </template>
          <a-button type="primary">提交保存</a-button>
        </a-popconfirm>
        <a-button style="marginLeft: 8px" @click="onClose">返回</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 抽屉属性
      drawerData: {},
      visible: false,
      // 数据源列表
      sourceData: [],
      // 二次校验提示
      confirm: '我已确认并核实当前信息准确无误',
      treeData: [],
      menuData: {
        is_parent: '0',
        is_lock: '0',
        pid: '-1'
      },
      parentNode: [],
      systemName: '新东方·北京学校',
      form: {
        layout: 'inline'
      },
      // 主数据属性
      data: [],
      pageNo: 0,
      pageSize: 10,
      scrollX: 650,
      columns: [
        {
          title: '数据源名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          customRender: (text, row, index) => {
            return text === 0 ? '数据表' : text === 1 ? '逻辑方法' : '数据引擎'
          }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false
    }
  },
  created () {
    this.getTree()
    this.getNodeParent()
  },
  methods: {
    // 根据数据类型获取数据源列表
    changeData (value) {
      var data = {
        type: value
      }
      this.executeUnify('menuData', 'getSourceData', '', data).then(res => {
        var resData = this.dataClean(res)
        this.sourceData = resData
      })
    },
    // 关闭「新增/编辑」抽屉
    onClose () {
      this.visible = false
      this.getCurrentAccessData(this.menuData.id)
    },
    // 新增数据源
    addData () {
      this.drawerData = {
        tid: '',
        type: '-1'
      }
      this.visible = true
    },
    // 数据重置
    resetData () {
      this.sourceData = []
      this.data = []
      this.menuData = {
        is_parent: '0',
        is_lock: '0',
        pid: '-1'
      }
    },
    onSaveData () {
      this.drawerData.mid = this.menuData.id
      this.executeUnify('menuData', 'bindMenuData', '', this.drawerData).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('数据源新增成功')
          this.onClose()
        }
      })
    },
    // 删除数据源
    deleteData (record) {
      var data = {
        mid: record.mid,
        id: record.id
      }
      this.executeUnify('menuData', 'removeBind', '', data).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('数据源已移除成功')
          this.getCurrentAccessData(record.mid)
        }
      })
    },
    // 删除数据源
    deleteDataNode (record) {
      var data = {
        version: parseInt(record.version) + 1,
        id: record.id
      }
      this.executeUnify('menu', 'deleteMenuNode', '', data).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('菜单已移除成功')
          this.getTree()
        }
      })
    },
    // 获取当前已授权的数据源
    getCurrentAccessData (id) {
      var data = {
        mid: id
      }
      this.executeUnify('menuData', 'getCurrentAccessData', '', data).then(res => {
        var resData = this.dataClean(res)
        this.data = resData
      })
    },
    // 点击树节点触发
    treeNodeClick (selectedKeys, info) {
      var id = info.node.dataRef.id
      if (id !== -1) {
        var data = {
          id: id
        }
        this.executeUnify('menu', 'getMenuNodeData', '', data).then(res => {
          var resData = this.dataClean(res)
          resData.is_parent = resData.is_parent === null ? '0' : resData.is_parent + ''
          resData.is_lock = resData.is_lock === null ? '0' : resData.is_lock + ''
          this.menuData = resData
        })
        this.getCurrentAccessData(id)
      }
    },
    // 新增及保存操作
    onSave () {
      var id = this.menuData.id
      if (id === undefined) {
        // 新增
        this.executeUnify('menu', 'addMenuNode', '', this.menuData).then(res => {
          var resData = this.dataClean(res)
          if (resData !== null) {
            this.success('菜单：「' + this.menuData.name + '」新增成功')
            this.getTree()
          }
        })
      } else {
        this.menuData.version = parseInt(this.menuData.version) + 1
        // 更新
        this.executeUnify('menu', 'updateMenuNode', '', this.menuData).then(res => {
          var resData = this.dataClean(res)
          if (resData !== null) {
            this.success('菜单：「' + this.menuData.name + '」数据更新成功')
            this.getTree()
          }
        })
      }
    },
    // 获取可使用的父节点
    getNodeParent () {
      this.executeUnify('menu', 'getParentNode', '', {}).then(res => {
        var resData = this.dataClean(res)
        this.parentNode = resData
      })
    },
    // 获取左侧菜单树
    getTree () {
      var data = {
        systemName: this.systemName
      }
      this.executeUnify('menu', 'getRootMenuTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.treeData = resData
      })
    }
  }
}
</script>

<style>
.ant-tree::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}
</style>
