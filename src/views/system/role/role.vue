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
          {{ roleData.name || '新建权限「校区」' }}
        </a-layout-header>
        <a-layout-content :style="{ marginLeft: '10px' }">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <a-form-model layout="horizontal" :model="roleData" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
              <a-form-model-item label="是否父级">
                <a-radio-group v-model="roleData.is_parent">
                  <a-radio-button value="1">是</a-radio-button>
                  <a-radio-button value="0">否</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="父级节点">
                <a-select v-model="roleData.pid" @select="getIndexTree" style="width: 200px">
                  <a-select-option value="-1">{{ systemName }}</a-select-option>
                  <a-select-option v-for="sec in parentNode" :key="sec.id">{{ sec.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="权限名称"><a-input v-model="roleData.name" placeholder="请输入权限名称" /></a-form-model-item>
              <a-form-model-item label="权限备注"><a-input v-model="roleData.note" placeholder="请输入权限备注" /></a-form-model-item>
              <a-form-model-item label="阶次序列"><a-input type="number" v-model="roleData.order_number" placeholder="请输入当前权限的排序值" /></a-form-model-item>
              <a-form-model-item label="指定首页">
                <a-tree-select
                  :value="roleData.indexData"
                  :tree-data="indexTree"
                  placeholder="请指定当前权限用户登陆系统时访问的首页"
                  tree-default-expand-all
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto'}"
                  @select="treeSelChange"
                >
                </a-tree-select>
              </a-form-model-item>
              <a-form-model-item label="是否锁定">
                <a-radio-group v-model="roleData.is_lock">
                  <a-radio-button value="1">是</a-radio-button>
                  <a-radio-button value="0">否</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="超管权限">
                <a-radio-group v-model="roleData.is_supervisor">
                  <a-radio-button value="1">有</a-radio-button>
                  <a-radio-button value="0">无</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 30 }">
                <a-popconfirm placement="topLeft" ok-text="确认" cancel-text="取消" @confirm="onSave">
                  <template v-slot:title>
                    <p>是否确认{{ roleData.id ? '保存' : '新增' }}当前权限数据?</p>
                  </template>
                  <a-button type="primary" style="width: 20%;">{{ roleData.id ? '保存' : '新增' }}</a-button>
                </a-popconfirm>
                <a-button @click="resetData" type="primary" :style="'width: 20%;margin-left: 5%;'">重置数据</a-button>
                <a-button v-if="roleData.id" type="primary" :style="'width: 20%;margin-left: 5%;'" @click="openPatchData(roleData.id)">
                  <a-icon type="copy" />
                  数据分配
                </a-button>
                <a-popconfirm placement="topLeft" ok-text="确认" cancel-text="取消" @confirm="deleteData(roleData.id)" style="width:20%;margin-left: 5%;">
                  <template slot="title">
                    <p>是否确认移除当前权限？</p>
                  </template>
                  <a-button v-if="roleData.id && roleData.is_lock === '0'" type="danger">删除菜单</a-button>
                </a-popconfirm>
              </a-form-item>
            </a-form-model>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout :style="{ width: '7%' }">
        <a-layout-header :style="{ color: 'white', textAlign: 'center', background: 'rgba(0, 0, 0, 0.65)', marginLeft: '10px', padding: 0 }">菜单关联</a-layout-header>
        <a-layout-content :style="{ marginLeft: '10px' }">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <a-tree
              checkable
              v-model="checkedNode"
              style="height:650px;overflow:auto"
              :tree-data="roleTreeData"
              @select="roleTreeNodeClick"
              :showLine="true">
              <template v-slot:title0010>
                <span style="color: #1890ff">sss</span>
              </template>
            </a-tree>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-drawer
      width="650"
      :title="drawerData.name"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible">
      <a-form-model layout="horizontal" :model="drawerData" :label-col="{ span: 9 }" :wrapper-col="{ span: 10 }" style="text-align: center;">
        <a-form-model-item label="数据权限">
          <a-popover title="数据权限控制" placement="bottom">
            <template v-slot:content>
              <p>选择「全部」时，用户在进行操作时，系统不会限制其数据范围</p>
              <p>选择「仅授权」时，若用户为「管理员」，可操作当前及子级授权的数据</p>
              <p>选择「仅授权」时，若用户为「普通用户」，则仅允许操作及管理自己的数据</p>
            </template>
            <a-radio-group v-model="drawerData.role_type">
              <a-radio-button value="1">全部</a-radio-button>
              <a-radio-button value="0">仅授权</a-radio-button>
            </a-radio-group>
          </a-popover>
        </a-form-model-item>
        <br />
        <br />
        <a-tabs>
          <a-tab-pane key="0" tab="管理员权限设置">
            <a-form-model-item label="数据新增">
              <a-radio-group v-model="drawerData.add">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据更新">
              <a-radio-group v-model="drawerData.upd">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据删除">
              <a-radio-group v-model="drawerData.del">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据查询">
              <a-radio-group v-model="drawerData.sel">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据导出">
              <a-radio-group v-model="drawerData.exportData">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="文件上传">
              <a-radio-group v-model="drawerData.upload">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="文件下载">
              <a-radio-group v-model="drawerData.download">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-tab-pane>
          <a-tab-pane key="1" tab="普通用户权限设置">
            <a-form-model-item label="数据新增">
              <a-radio-group v-model="drawerData.add2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据更新">
              <a-radio-group v-model="drawerData.upd2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据删除">
              <a-radio-group v-model="drawerData.del2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据查询">
              <a-radio-group v-model="drawerData.sel2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="数据导出">
              <a-radio-group v-model="drawerData.exportData2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="文件上传">
              <a-radio-group v-model="drawerData.upload2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="文件下载">
              <a-radio-group v-model="drawerData.download2">
                <a-radio-button value="1">允许</a-radio-button>
                <a-radio-button value="0">不允许</a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-tab-pane>
        </a-tabs>
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
        <a-popconfirm placement="topRight" ok-text="提交" cancel-text="返回" @confirm="onSaveRoleMenu">
          <template v-slot:title>
            <p>{{ !menuState ? '是否确认绑定当前菜单？' : '是否确认解绑当前菜单？' }}</p>
          </template>
          <a-button :type="!menuState ? 'primary' : 'danger'">{{ !menuState ? '绑定' : '解绑' }}</a-button>
        </a-popconfirm>
        <a-button style="marginLeft: 8px" @click="onClose">返回</a-button>
      </div>
    </a-drawer>
    <a-drawer
      width="650"
      title="自定义数据分配"
      placement="right"
      @close="onCloseData"
      :closable="false"
      :visible="visibleData">
      <a-form-model ref="tsDataForm" layout="horizontal" :model="drawerDataPatch" :label-col="{ span: 3 }" :wrapper-col="{ span: 40 }">
        <a-form-item v-for="(data, index) in drawerDataPatch.patchData" :key="data.id" :name="['title', index, 'value']">
          <a-divider>{{ '自定义数据' + (drawerDataPatch.patchData.length - index) }}</a-divider>
          <a-form-model layout="horizontal" :model="data">
            <a-form-item label="逻辑名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"><a-input v-model="data.schema_name" placeholder="请输入逻辑名称" /></a-form-item>
            <a-form-item label="方法名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"><a-input v-model="data.method_name" placeholder="请输入方法名称" /></a-form-item>
            <a-form-item label="关联表ID" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"><a-input v-model="data.table_id" placeholder="请输入关联表ID" /></a-form-item>
            <a-form-item label="关联字段" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"><a-input v-model="data.patch_filed" placeholder="请输入关联字段" /></a-form-item>
            <a-form-item label="匹配类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
              <a-select v-model="data.patch_type" style="width: 300px" disabled>
                <a-select-option :value="1">强制匹配</a-select-option>
                <a-select-option :value="0">SQL引擎</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="自设定值" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"><a-input v-model="data.repeat_val" placeholder="请输入自定义设定值" /></a-form-item>
            <a-form-item label="引擎配参" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
              <a-input v-model="data.engine_params" placeholder="请输入引擎配参「暂未启用」" :disabled="data.patch_type === '1'" />
            </a-form-item>
            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 30 }">
              <a-button @click="removeDrawerData(data)" type="danger" style="width: 100%;">删除当前预设</a-button>
            </a-form-item>
          </a-form-model>
        </a-form-item>
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
        <a-button type="dashed" style="marginRight: 8px" @click="addDrawerData">新增{{ drawerTips }}</a-button>
        <a-popconfirm placement="topRight" ok-text="提交" cancel-text="返回" @confirm="onSaveDrawerData">
          <template v-slot:title>
            <p>是否确认提交并保存当前自定义数据设置？</p>
          </template>
          <a-button type="primary">提交保存</a-button>
        </a-popconfirm>
        <a-button style="marginLeft: 8px" @click="onCloseData">返回</a-button>
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
      // 当前菜单绑定状态
      menuState: false,
      drawerDataPatch: {
        patchData: []
      },
      visible: false,
      visibleData: false,
      // 权限树列表
      rid: '',
      treeData: [],
      roleTreeData: [],
      roleData: {
        is_parent: '0',
        is_lock: '0',
        is_supervisor: '0',
        pid: '-1',
        indexData: undefined
      },
      parentNode: [],
      systemName: '新东方·北京学校',
      checkedNode: [],
      indexTree: [],
      indexRoleNode: []
    }
  },
  created () {
    this.getTree()
    this.getNodeParent()
    this.getIndexTree()
  },
  methods: {
    treeSelChange (value, node, ex) {
      var data = {
        id: node.dataRef.id
      }
      this.executeUnify('menu', 'getMenuNodeData', '', data).then(res => {
        var resData = this.dataClean(res)
        this.roleData.indexData = resData.name
        this.roleData.index_page = resData.path
      })
    },
    // 加载下拉首页菜单树
    getIndexTree () {
      var data = {
        rid: this.roleData.pid,
        systemName: this.systemName
      }
      this.executeUnify('roleMenu', 'getCurrentRoleMenuTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.indexTree = resData
        // 获取选中节点
        this.executeUnify('roleMenu', 'getMenuChecked', '', data).then(res2 => {
          var resData2 = this.dataClean(res2)
          this.indexRoleNode = resData2
        })
      })
    },
    // 自定义相关方法开始
    onCloseData () {
      this.visibleData = false
    },
    openPatchData (id) {
      this.rid = id
      this.getPatchData(id)
      this.visibleData = true
    },
    addDrawerData () {
      this.drawerDataPatch.patchData.unshift({
        shcema_name: '',
        method_name: '',
        table_id: '',
        patch_filed: '',
        patch_type: 1,
        repeat_val: '',
        key: Date.now()
      })
    },
    removeDrawerData (item) {
      const index = this.drawerDataPatch.patchData.indexOf(item)
      if (index !== -1) {
        this.drawerDataPatch.patchData.splice(index, 1)
      }
    },
    onSaveDrawerData () {
      this.$refs['tsDataForm']
        .validate()
        .then(() => {
          // 先删除当前教师已绑定的所有信息
          const data = {
            rid: this.rid,
            data: this.drawerDataPatch.patchData
          }
          var _this = this
          _this.executeUnify('rolePatchData', 'bindPatchData', null, data).then(res => {
            var data = _this.dataClean(res)
            if (data !== null) {
              _this.onCloseData()
              _this.success('自定义数据已重新分配完成')
            }
          })
        })
        .catch(error => {
          this.$notification.error({
            message: '错误提示',
            description: '提交时出现错误：' + error
          })
        })
    },
    // 自定义相关方法结束
    onClose () {
      this.visible = false
    },
    onSaveRoleMenu () {
      var data = this.drawerData
      data.rid = this.roleData.id
      this.executeUnify('roleMenu', 'bindRoleMenu', '', data).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('当前菜单已' + (!this.menuState ? '绑定' : '解绑') + '成功')
          this.onClose()
          this.getRoleMenuTree()
        }
      })
    },
    // 获取当前权限下全部自定义数据的配置信息
    getPatchData (id) {
      var data = {
        rid: id
      }
      this.executeUnify('rolePatchData', 'selectPatchData', '', data).then(res => {
        var resData = this.dataClean(res)
        this.drawerDataPatch.patchData = resData.data
      })
    },
    // 数据重置
    resetData () {
      this.roleTreeData = []
      this.roleData = {
        is_parent: '0',
        is_lock: '0',
        is_supervisor: '0',
        pid: '-1'
      }
    },
    // 点击菜单树节点触发
    roleTreeNodeClick (selectedKeys, info) {
      var id = info.node.dataRef.id
      if (id !== -1) {
        this.menuState = info.node.checked
        var data = {
          rid: this.rid,
          mid: info.node.dataRef.id
        }
        this.executeUnify('roleMenu', 'getCurrentRoleMenuNode', '', data).then(res => {
          var resData = this.dataClean(res)
          var adminRole = resData.page_role.split('')
          var normalRole = resData.page_normal_role.split('')
          this.drawerData = {
            add: adminRole[0] || '1',
            upd: adminRole[1] || '1',
            del: adminRole[2] || '1',
            sel: adminRole[3] || '1',
            exportData: adminRole[4] || '1',
            upload: adminRole[5] || '1',
            download: adminRole[6] || '1',
            role_type: '1',
            add2: normalRole[0] || '0',
            upd2: normalRole[1] || '0',
            del2: normalRole[2] || '0',
            sel2: normalRole[3] || '1',
            exportData2: normalRole[4] || '0',
            upload2: normalRole[5] || '0',
            download2: normalRole[6] || '0',
            mid: id,
            name: this.roleData.name + '「' + info.node.dataRef.title + '」菜单：数据权限设定'
          }
        })
        this.visible = true
      }
    },
    // 点击树节点触发
    treeNodeClick (selectedKeys, info) {
      var id = info.node.dataRef.id
      if (id !== -1) {
        var data = {
          id: info.node.dataRef.id
        }
        this.executeUnify('role', 'getRoleNodeData', '', data).then(res => {
          var resData = this.dataClean(res)
          resData.is_parent = resData.is_parent === null ? '0' : resData.is_parent + ''
          resData.is_lock = resData.is_lock === null ? '0' : resData.is_lock + ''
          resData.is_supervisor = resData.is_supervisor === null ? '0' : resData.is_supervisor + ''
          this.rid = id
          this.roleData = resData
          var dataMenu = {
            path: resData.index_page
          }
          this.executeUnify('menu', 'getCurrentMenuByPath', '', dataMenu).then(res => {
            var resData = this.dataClean(res)
            this.roleData.indexData = resData.name
            this.roleData.index_page = resData.path
          })
          this.getRoleMenuTree()
        })
      }
    },
    // 移除节点
    deleteData (id) {
      this.executeUnify('role', 'deleteRoleNode', '', this.roleData).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success('权限：「' + this.roleData.name + '」删除成功')
          this.getTree()
        }
      })
    },
    // 新增及保存操作
    onSave () {
      var id = this.roleData.id
      if (id === undefined) {
        // 新增
        this.executeUnify('role', 'addRoleNode', '', this.roleData).then(res => {
          var resData = this.dataClean(res)
          if (resData !== null) {
            this.success('权限：「' + this.roleData.name + '」新增成功')
            this.getTree()
          }
        })
      } else {
        this.roleData.version = parseInt(this.roleData.version) + 1
        // 更新
        this.executeUnify('role', 'updateRoleNode', '', this.roleData).then(res => {
          var resData = this.dataClean(res)
          if (resData !== null) {
            this.success('权限：「' + this.roleData.name + '」数据更新成功')
            this.getTree()
          }
        })
      }
    },
    // 获取可使用的父节点
    getNodeParent () {
      this.executeUnify('role', 'getParentNode', '', {}).then(res => {
        var resData = this.dataClean(res)
        this.parentNode = resData
      })
    },
    // 获取左侧权限「校区」树
    getTree () {
      var data = {
        systemName: this.systemName
      }
      this.executeUnify('role', 'getRootRoleTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.treeData = resData
      })
    },
    // 获取菜单树
    getRoleMenuTree () {
      var data = {
        rid: this.roleData.id,
        systemName: this.systemName
      }
      this.executeUnify('roleMenu', 'getCurrentRoleMenuTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.roleTreeData = resData
        // 获取选中节点
        this.executeUnify('roleMenu', 'getMenuChecked', '', data).then(res2 => {
          var resData2 = this.dataClean(res2)
          this.checkedNode = resData2
        })
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
