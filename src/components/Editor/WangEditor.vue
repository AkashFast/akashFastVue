<template>
  <div id="wangeditor"><div ref="editorElem" style="text-align:left"></div></div>
</template>

<script>
import E from 'wangeditor'
import setting from '@/config/defaultSettings'
export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    initContent: {
      type: String,
      default: ''
    }
  },
  watch: {
    content (newdata) {
      return newdata
    },
    initContent (val) {
      this.initContent = val
      this.neweditor()
    }
  },
  data () {
    return {
      editorContent: this.content,
      neweditor: function () {
        var editor = new E(this.$refs.editorElem)
        editor.customConfig.onchange = html => {
          this.editorContent = html
          this.$emit('change', this.editorContent)
        }
        editor.customConfig.zIndex = 1
        editor.customConfig.uploadImgServer = setting.url + 'upFile'
        editor.customConfig.uploadFileName = 'file'
        editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //   prevent: true,
            //   msg: '放弃上传'
            // }
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            this.imgUrl = {
              url: setting.url + 'getFile?fileName=' + result[0].replace(/\\/g, '/')
            }
          },
          fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },
          timeout: function (xhr, editor) {
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },

          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = {
              url: setting.url + 'getFile?fileName=' + result[0].replace(/\\/g, '/')
            }
            url = Object.values(url) // result.data就是服务器返回的图片名字和链接
            JSON.stringify(url) // 在这里转成JSON格式
            insertImg(url)
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
        editor.create()
        editor.txt.html(this.initContent)
      }
    }
  },
  mounted () {
    this.neweditor()
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
