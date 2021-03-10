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
export default {
  name: 'Exception404',
  methods: {
    toLogin () {
      return this.$store.dispatch('Logout').then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    toHome () {
       this.$router.push({ name: 'examMange' })
    }
  }
}
</script>
