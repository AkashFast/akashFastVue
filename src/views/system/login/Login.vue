<template>
  <div>
    <p></p>
    <a-card title="请选择您要使用的系统角色" >
      <a-card-grid v-for="role in roleList" :key="role.id" @click="loadLogin(role.rid)" style="width:25%;text-align:center;cursor: hand;">
        {{ role.name }}
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import { executeUnify, dataClean } from '@/api/manage'
import { login } from '@/api/login'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
        // 多权限窗口
        roleList: [],
        indexPage: ''
      }
  },
  created () {
    this.loadLogin('checkRole')
  },

  methods: {
    ...mapActions(['Login', 'GenerateRoutes']),
    loadLogin (rid) {
      const {
        Login
      } = this
      login(rid).then(res => {
        executeUnify('accessLogin', 'accessLogin', '', {}).then(res => {
          var resData = dataClean(res)
          if (resData !== null) {
              // 如果当前用户只有一个权限
              if (resData.isLogin) {
                Login(resData.role.rid)
                  .then((res) => {
                      const roles = resData.menu
                      // generate dynamic router
                      this.$store.dispatch('GenerateRoutes', { roles }).then(() => {
                          this.indexPage = resData.role.index_page
                          this.loginSuccess(resData.role.index_page)
                      })
                    })
                  .catch(err => this.requestFailed(err))
              } else {
                if (resData.roleList.length > 0) {
                  this.roleList = resData.roleList
                } else {
                  this.$notification['error']({
                    message: '错误',
                    description: '登陆失败「暂未获得授权信息」'
                  })
                  setTimeout(() => {
                     this.$router.push({ path: '/user/login' })
                  }, 3000)
                }
              }
          }
        })
      })
    },
    loginSuccess () {
      // 延迟 1 秒显示欢迎信息
      this.$router.push({ path: this.indexPage })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    },
    requestFailed () {
      this.$notification['error']({
        message: '错误',
        description: '登陆失败，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
