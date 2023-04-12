<template>
  <div style="border: 1px solid #ccc" class="dialogBox">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :default-config="toolbarConfig" :mode="mode" />
    <Editor v-model="html" :style="{ height: height + 'px' }" style="overflow-y: hidden" :default-config="editorConfig" :mode="mode" @onChange="onChange" @onCreated="onCreated" />
  </div>
</template>
<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default Vue.extend({
  components: { Editor, Toolbar },
  props: {
    height: {
      type: Number,
      default: 500,
    },
    mode: {
      type: String,
      default: 'default',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editor: null,
      html: this.title,
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
    }
  },
  mounted() {
    // // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    // }, 1500)
  },
  beforeDestroy() {
    const { editor } = this
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      this.$emit('update:title', this.html)
    },
  },
})
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="scss" scoped>
::v-deep.dialogBox {
  body,
  button,
  input,
  select,
  textarea {
    font: 12px/18px Arial, Verdana, Microsoft YaHei;
  }

  /* fix center */
  html,
  body {
    height: 100%;
    margin: 0 auto;
  }

  /* h1~h6 */
  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 18px;
  }
  h3 {
    font-size: 14px;
  }
  h4,
  h5,
  h6 {
    font-size: 100%;
  }
}
</style>
