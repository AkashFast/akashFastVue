<template>
  <a-result status="404" title="404" sub-title="⚠ 抱歉,您的账户当前尚未获取访问权限">
    <template #extra>
      <a-button type="primary" @click="toLogin">
        返回登录
      </a-button>
      <a-button type="primary" @click="toHome">
        返回主页
      </a-button>
    </template>
  </a-result>
</template>

<script>
import setting from '@/config/defaultSettings'

export default {
  name: 'Exception404',
  methods: {
    toLogin () {
      window.location.href = setting.url + 'logout'
    },
    toHome () {
       this.$router.push({ path: '/' })
    }
  }
}
</script>
