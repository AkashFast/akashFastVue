<template>
  <div :title="false">
    <a-form-model :layout="form.layout" :model="form">
      <a-form-model-item label="用户名称"><a-input v-model="form.name" placeholder="请输入用户名称" /></a-form-model-item>
      <a-form-model-item label="企业邮箱"><a-input v-model="form.email" placeholder="请输入企业邮箱地址" /></a-form-model-item>
      <a-form-model-item label="联系方式"><a-input v-model="form.mobile" placeholder="请输入联系方式" /></a-form-model-item>
      <br/><br/>
      <a-form-model-item label="数据状态">
        <a-radio-group v-model="form.state">
          <a-radio-button value="0">正常</a-radio-button>
          <a-radio-button value="1">已屏蔽</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="关联微信">
        <a-radio-group v-model="form.wxState">
          <a-radio-button value="1">是</a-radio-button>
          <a-radio-button value="-1">否</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="可用授权">
        <a-tree-select
          :value="form.ridTitle"
          :tree-data="drawerRoleData.treeData"
          style="width: 320px"
          placeholder="请选择用户权限「所属部门」"
          tree-default-expand-all
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto'}"
          @select="treeSelChange"
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item><a-button type="primary" style="width: 130px;" @click="changePage">检索</a-button></a-form-model-item>
      <a-form-model-item><a-button type="primary" style="width: 130px;" @click="exportUserData">导出</a-button></a-form-model-item>
      <a-form-model-item><a-button type="primary" style="width: 130px;" @click="add" :hidden="setRoleDis">新增系统用户</a-button></a-form-model-item>
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
      <template slot="action" slot-scope="text, record" style="background-color: grey;">
        <a-button type="primary" style="margin-right: 15px;width: 100px;" :disabled="record.is_lock === 1 ? true : false" @click="edit(record)" :hidden="setRoleDis">
          {{ record.state === 0 ? '编辑' : '还原' }}
        </a-button>
        <a-button style="margin-right: 15px;width: 100px;background-color: lightseagreen;color: white;" @click="setRole(record)" :hidden="setRoleDis">授权</a-button>
        <a-button type="danger" style="width: 100px;" :disabled="record.is_lock === 1 || setRoleDis ? true : false" @click="deleteData(record)" :hidden="setRoleDis">
          {{ record.state === 0 ? '屏蔽' : '删除' }}
        </a-button>
      </template>
    </a-table>
    <a-drawer
      width="650"
      :title="drawerData.name"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible">
      <a-form-model
        class="zero"
        ref="userForm"
        :rules="rules"
        layout="horizontal"
        :model="drawerData"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 18 }">
        <a-alert message="△ 「新建用户进行授权时,权限等级默认为普通用户」" :hidden="setRoleDis" banner />
        <br/>
        <a-form-model-item label="姓名" prop="name" ref="name"><a-input v-model="drawerData.name" placeholder="请输入系统用户名称" /></a-form-model-item>
        <a-form-model-item label="邮箱" prop="email" ref="email"><a-input v-model="drawerData.email" placeholder="请输入邮箱「可用于登陆凭证」" /></a-form-model-item>
        <a-form-model-item label="联系方式" prop="mobile" ref="mobile"><a-input v-model="drawerData.mobile" placeholder="请输入联系方式「可用于登陆凭证」" /></a-form-model-item>
        <a-form-model-item label="可用授权" :prop="!editRole ? 'role' : ''" ref="role" :hidden="editRole">
          <a-tree-select
            :value="drawerData.roleTitle"
            :tree-data="drawerRoleData.treeData"
            style="width: 100%"
            placeholder="请选择用户权限「所属部门」"
            tree-default-expand-all
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto'}"
            @select="treeSelChange2"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="备注信息"><a-input v-model="drawerData.note" placeholder="请输入用户的备注信息" /></a-form-model-item>
        <a-form-model-item label="是否锁定">
          <a-popover title="数据锁定" placement="bottom">
            <template v-slot:content>
              <p>选择「是」时，当前数据将被系统锁定，后续无法更新及删除</p>
              <p>选择「否」时，系统将不会锁定当前数据</p>
            </template>
            <a-radio-group v-model="drawerData.is_lock">
              <a-radio-button value="1">是</a-radio-button>
              <a-radio-button value="0">否</a-radio-button>
            </a-radio-group>
          </a-popover>
        </a-form-model-item>
        <br />
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
        <a-popconfirm placement="topRight" ok-text="提交" cancel-text="返回" @confirm="onSave">
          <template v-slot:title>
            <p>{{ confirm }}</p>
          </template>
          <a-button type="primary">提交保存</a-button>
        </a-popconfirm>
        <a-button style="marginLeft: 8px" @click="onClose">返回</a-button>
      </div>
    </a-drawer>
    <!-- 用户授权绑定-->
    <a-drawer
      width="650"
      :title="drawerRoleData.name + '：授权'"
      placement="right"
      @close="onCloseRole"
      :closable="false"
      :visible="visibleRole">
      <a-alert message="△ 「请点击权限文字以进行授权操作」" banner />
      <a-tree
        checkable
        :checkStrictly="true"
        v-model="drawerRoleData.checkedList"
        :tree-data="drawerRoleData.treeData"
        @select="treeNodeClick"
        :showLine="true">
        <template slot="is_admin" slot-scope="item" >
          <span style="color: red;font-weight: bold;">{{ '☆' + item.title + '「管理员」' }}</span>
        </template>
        <template slot="is_normal" slot-scope="item" >
          <span style="color: green;">{{ item.title + '「普通用户」' }}</span>
        </template>
      </a-tree>
      <div style="height: 50px;"></div>
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
        <a-button style="marginLeft: 8px" @click="onCloseRole">返回</a-button>
      </div>
    </a-drawer>
    <a-modal
      title="授权提示"
      :maskClosable="false"
      :closable="false"
      :visible="modalVisibleRole"
      @ok="modalRoleOk"
      @cancel="modalRoleCancel">
      <p>{{ infoChecked ? '是否取消当前授权？' : '是否设置当前角色的访问权限为管理者？「取消视为设置为普通用户」' }}</p>
    </a-modal>
    <a-modal :title="modalTitle" :visible="modalVisible" :confirm-loading="confirmLoading" @ok="modalOk" @cancel="modalCancel">
      <p>{{ modalText }}</p>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { getCookie } from '@/api/cookie'

export default {
  data () {
    return {
      selData: '',
      afterEmail: '',
      setRoleDis: true,
      rules: {
        name: [
          {
            required: true,
            message: '请填写用户姓名！',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            type: 'string',
            message: '请给当前用户授权！',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            type: 'string',
            pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
            message: '请填写正确的用户联系方式！',
            trigger: 'blur'
          }
        ],
        email: [
          {
            type: 'email',
            message: '请使用正确的邮箱格式！',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请填写用户的企业邮箱！',
            trigger: 'blur'
          }
        ]
      },
      // 二次授权提示
      modalVisibleRole: false,
      modalInfo: {},
      // 二次校验提示
      confirm: '我已确认并核实当前信息准确无误',
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
        state: '0',
        rid: undefined,
        ridTitle: undefined,
        wxState: '-1'
      },
      // 抽屉属性
      drawerData: {},
      visible: false,
      editRole: false,
      // 授权
      drawerRoleData: {
        treeData: [],
        checkedList: []
      },
      infoChecked: false,
      visibleRole: false,
      // 主数据属性
      data: [],
      pageNo: 0,
      pageSize: 10,
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '联系方式',
          dataIndex: 'mobile',
          key: 'mobile'
        },
        {
          title: '微信绑定',
          dataIndex: 'openid',
          key: 'openid',
          customRender: (text, row, index) => {
            return text === undefined ? '否' : '是'
          }
        },
        // {
        //   title: '最后登录ip',
        //   dataIndex: 'last_ip',
        //   key: 'last_ip'
        // },
        // {
        //   title: '最后登录时间',
        //   dataIndex: 'last_time',
        //   key: 'last_time',
        //   customRender: (text, row, index) => {
        //     return text === undefined ? '' : moment(text).format('YYYY-MM-DD HH:mm:ss')
        //   }
        // },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          align: 'center',
          customRender: (text, row, index) => {
            return row.is_lock === 1 ? '正常🔒' : text === 0 ? '正常' : '已屏蔽'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '375px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false,
      systemName: 'Fast·Akash',
      checkedListAdmin: ''
    }
  },
  created () {
    this.getTableList()
    this.getRoleTreeAdd()
    this.mtp = getCookie('mt-p')
    if (this.mtp === '1') {
      this.setRoleDis = false
    } else {
      this.setRoleDis = false
    }
  },
  methods: {
     moment,
     // 数据导出
     exportUserData () {
      this.exportFile('user', 'exportUserData', '', this.selData).then(res => {
         this.exportData(res, '系统用户信息')
     })
    },
    treeSelChange (value, node, ex) {
      this.form.rid = node.dataRef.id
      this.form.ridTitle = node.dataRef.title
    },
    treeSelChange2 (value, node, ex) {
      this.drawerData.role = node.dataRef.id
      this.drawerData.roleTitle = node.dataRef.title
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
    bindRole (isAdmin) {
      var id = this.modalInfo.node.dataRef.id
      if (id !== -1) {
        var data = {
          rid: id,
          uid: this.drawerRoleData.id,
          is_admin: isAdmin ? '1' : '0',
          system_current_role: '529a36b2469a432f8a2474451b3e0fdd'
        }
        this.executeUnify('userRole', 'bindUserRole', '', data).then(res => {
          var resData = this.dataClean(res)
          this.roleData = resData
          if (resData !== null) {
            this.success('当前权限已' + (this.infoChecked ? '解绑' : '绑定') + '成功')
            this.getRoleTree()
          }
        })
      }
    },
    modalRoleOk () {
      this.bindRole(true)
      this.modalVisibleRole = false
    },
    modalRoleCancel () {
      if (!this.infoChecked) {
        this.bindRole(false)
      }
      this.modalVisibleRole = false
    },
    // 点击树节点进行授权
    treeNodeClick (selectedKeys, info) {
      this.modalVisibleRole = true
      this.infoChecked = info.node.checked
      this.modalInfo = info
    },
    // 关闭「授权」窗口
    onCloseRole () {
      this.visibleRole = false
    },
    // 打开「授权」窗口
    setRole (record) {
      this.drawerRoleData.name = record.name
      this.drawerRoleData.id = record.id
      this.getRoleTree()
    },
    // 获取授权树「新增」
    getRoleTreeAdd () {
      var data = {
        uid: '',
        systemName: this.systemName
      }
      this.executeUnify('userRole', 'getRoleMenuTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.drawerRoleData.treeData = resData
      })
    },
    // 获取授权树
    getRoleTree () {
      var data = {
        uid: this.drawerRoleData.id,
        systemName: this.systemName
      }
      this.executeUnify('userRole', 'getRoleMenuTree', '', data).then(res => {
        var resData = this.dataClean(res)
        this.drawerRoleData.treeData = resData
        // 获取选中节点
        this.executeUnify('userRole', 'getRoleChecked', '', data).then(res2 => {
          var resData2 = this.dataClean(res2)
          this.drawerRoleData.checkedList = resData2.checked
          this.resetTree(resData, resData2.adminChecked, resData2.normalChecked)
          this.visibleRole = true
        })
      })
    },
    resetTree (tree, admin, normal) {
      for (var i = 0; i < tree.length; i++) {
          for (var j = 0; j < admin.length; j++) {
            if (admin[j] === tree[i].id) {
              tree[i].scopedSlots = { title: 'is_admin' }
            }
          }
          for (var k = 0; k < normal.length; k++) {
            if (normal[k] === tree[i].id) {
              tree[i].scopedSlots = { title: 'is_normal' }
            }
          }
          tree[i].disableCheckbox = true
          if (tree[i] !== undefined) {
            if (tree[i].children !== undefined) {
              if (tree[i].children.length > 0) {
                this.resetTree(tree[i].children, admin, normal)
              }
            }
          }
      }
    },
    // 关闭抽屉
    onClose () {
      this.visible = false
      this.getTableList()
    },
    // 保存数据「新增 / 编辑」
    onSave () {
      var that = this
      that.$refs.userForm.validate(valid => {
        if (valid) {
          var data = that.drawerData
          const dataEmail = {
            email: data.email
          }
          that.executeUnify('user', 'selectUserList', null, dataEmail).then(res => {
            var Udata = that.dataClean(res)
            if (Udata.data.length === 0 || that.afterEmail === data.email) {
              // 根据id区分判断是新增还是修改
              const id = data.id
              // 数据版本判断
              data.version = id === undefined ? 0 : parseInt(data.version) + 1
              data.create_time = null
              data.last_time = null

              // 新增时对当前权限数据做处理
              if (that.editRole) {
                data.role = ''
              }

              this.editRole = true
              // 调用方法区分
              if (id === undefined) {
                // 新增
                that.executeUnify('userRole', 'addUserInfo', '', data).then(res => {
                  var resData = that.dataClean(res)
                  if (resData !== null) {
                    that.success('系统用户信息新增成功')
                    that.onClose()
                    that.getTableList()
                  }
                })
              } else {
                that.executeUnify('', 'updateData', '65b1634571894baa9a9a7462964f4bea', data).then(res => {
                  var resData = that.dataClean(res)
                  if (resData !== null) {
                    that.success('系统用户信息更新成功')
                    that.onClose()
                    that.getTableList()
                  }
                })
              }
            } else {
              notification.error({
                 message: '错误提示',
                 description: '当前邮箱已被使用！'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 点击「编辑」按钮
    edit (record) {
      this.drawerData = record
      this.editRole = true
      // 获取编辑前的email地址
      this.afterEmail = record.email + ''
      this.drawerData.is_lock = record.is_lock + ''
      if (record.state === 0) {
        this.visible = true
      } else {
        this.modalVisible = true
        this.modalTitle = '确认还原?'
        this.modalText = '是否确认将当前选中数据状态调整为「正常」?'
        this.modalId = record.id
        this.modalState = record.state
        this.modalBack = true
      }
    },
    // 点击「新增」按钮
    add () {
      this.drawerData = {
        name: '',
        role: undefined,
        roleTitle: undefined,
        is_lock: '0'
      }
      this.editRole = false
      this.visible = true
    },
    // 点击「删除 / 屏蔽」按钮
    deleteData (record) {
      var stateMsg = record.state === 0 ? '屏蔽' : '删除'
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
        id: this.modalId
      }
      var state = this.modalState
      if (this.modalBack) {
        data = this.drawerData
        data.version = data.id === undefined ? 0 : parseInt(data.version) + 1
        data.create_time = null
        data.last_time = null
        data.state = 0
      }
      this.executeUnify('', this.modalBack ? 'updateData' : state === 0 ? 'deleteDataSoft' : 'deleteData', '65b1634571894baa9a9a7462964f4bea', data).then(res => {
        var resData = this.dataClean(res)
        if (resData !== null) {
          this.success(this.modalBack ? '当前系统用户数据已还原' : state === 0 ? '系统用户信息屏幕成功' : '系统用户信息删除成功')
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
        name: this.form.name,
        email: this.form.email,
        mobile: this.form.mobile,
        wxState: this.form.wxState,
        rid: this.form.rid === -1 ? '' : this.form.rid,
        state: this.form.state,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      var _this = this
      _this.selData = data
      _this.loading = true
      _this.executeUnify('user', 'selectUserList', null, data).then(res => {
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
