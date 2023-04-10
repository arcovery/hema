import Vue from 'vue'
// import imgURL from '@/assets/common/head.jpg'
import { changeToValue } from '@/utils/index.js'
import question from '@/api/constant/question.js'
// 自定义指令
const directive = {
  // 错误图片处理
  // imgError: {
  //   inserted: (el, binding) => {
  //     el.src = el.src || imgURL
  //     el.onerror = () => {
  //       el.src = imgURL
  //     }
  //   },
  //   componentUpdated: (el, binding) => {
  //     el.src = el.src || imgURL
  //   },
  //   unbind: (el) => {
  //     el.onerror = null
  //   },
  // },

  // 枚举数据处理
  question: {
    inserted(el, binding) {
      el.innerText = changeToValue(question[binding.arg], binding.value)
    },
    componentUpdated(el, binding) {
      el.innerText = changeToValue(question[binding.arg], binding.value)
    },
  },
}

Object.keys(directive).forEach((i) => {
  Vue.directive(i, directive[i])
})
