<template>
  <div>
    <el-dialog :before-close="handleClose" width="60%" :visible.sync="dialogFormVisible">
      <div slot="title">
        <h2 class="card-title text-3xl">新增题目</h2>
      </div>
      <el-form ref="form" :rules="rules" :model="form">
        <div class="flex justify-between flex-wrap">
          <div class="mr-2 mb-2 w-1/5">
            <h2 class="card-title mb-2 mr-2">学科</h2>
            <el-form-item prop="subject">
              <el-select v-model="form.subject" clearable placeholder="请选择">
                <el-option v-for="(item, index) in subject" :key="index" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="mr-2 mb-2 w-1/5">
            <h2 class="card-title mb-2 mr-2">企业</h2>
            <el-form-item prop="enterprise">
              <el-select v-model.number="form.enterprise" clearable placeholder="请选择">
                <el-option v-for="(item, index) in enterprise" :key="index" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="mr-2 mb-2 w-1/5">
            <h2 class="card-title mb-2 mr-2">阶段</h2>
            <el-form-item prop="step">
              <el-select v-model.number="form.step" clearable placeholder="请选择">
                <el-option v-for="item in step" :key="item.id" :label="item.value" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="mr-2 mb-2 w-1/5">
            <h2 class="card-title mb-2 mr-2">城市</h2>
            <el-form-item prop="city">
              <el-cascader v-model="cityComputed" :props="{ value: 'label' }" :options="city" clearable placeholder="请选择"> </el-cascader>
            </el-form-item>
          </div>
        </div>
        <div class="flex justify-start my-4">
          <el-form-item prop="difficulty">
            <div class="mr-2 mb-2 flex items-center">
              <h2 class="card-title mb-2 mr-2">难度</h2>
              <el-radio-group v-model="form.difficulty" class="flex items-center mr-5">
                <div v-for="item in difficulty" :key="item.id" class="flex items-center mr-5">
                  <div class="mr-2">{{ item.value }}</div>
                  <input v-model="form.difficulty" :value="item.id" type="radio" name="difficulty" class="radio radio-primary" />
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item prop="type">
            <div class="mr-2 mb-2 flex items-center">
              <h2 class="card-title mb-2 mr-2">题型</h2>
              <el-radio-group v-model="form.type" class="flex items-center mr-5">
                <div v-for="item in type" :key="item.id" class="flex items-center mr-5">
                  <div class="mr-2">{{ item.value }}</div>
                  <input v-model="form.type" :value="item.id" type="radio" name="type" class="radio radio-primary" />
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
        <h2 class="card-title mb-2 mr-2">试题标题</h2>
        <el-form-item prop="title">
          <wang-editor :title.sync="form.title" :height="100" mode="simple"></wang-editor>
        </el-form-item>
        <!-- 题目 -->
        <div class="mr-2 mb-2">
          <h2 v-question:type="form.type" class="card-title mb-2 mr-2"></h2>
        </div>
        <el-form-item v-if="form.type != 3" :prop="form.type == 1 ? 'single_select_answer' : 'multiple_select_answer'">
          <el-radio-group v-model="form.single_select_answer" class="block">
            <checkbox :title="form.type" :single-select.sync="form.single_select_answer" :multiple-select.sync="form.multiple_select_answer" :select-options.sync="form.select_options"></checkbox>
          </el-radio-group>
        </el-form-item>
        <div v-else>
          <el-form-item prop="short_answer">
            <textarea v-model="form.short_answer" class="textarea textarea-bordered w-full my-8" placeholder="简答"></textarea>
          </el-form-item>
        </div>
        <div class="my-4">
          <h2 class="card-title mb-2 mr-2">答案解析</h2>
          <el-form-item prop="answer_analyze">
            <wang-editor :title.sync="form.answer_analyze" :height="200"></wang-editor>
          </el-form-item>
        </div>
        <div class="my-4">
          <h2 class="card-title mb-2 mr-2">备注</h2>
          <el-form-item prop="remark">
            <textarea v-model="form.remark" class="textarea textarea-bordered w-full" placeholder="备注"></textarea>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button class="btn mr-5" @click="handleClose">取 消</button>
        <button class="btn btn-primary" @click="submitForm">确 定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import question from '@/api/constant/question.js'
import wangEditor from './wangEditor.vue'
import checkbox from './components/checkbox.vue'
import { regionDataPlus } from 'element-china-area-data'
import { questionAddAPI, questionEditAPI } from '@/api/question'
export default {
  components: { wangEditor, checkbox },
  data() {
    return {
      isEdit: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      subject: [],
      enterprise: [],
      city: regionDataPlus,
      step: question.step,
      type: question.type,
      difficulty: question.difficulty,
      status: question.status,
      form: {
        title: '', //									 string	标题
        // title: '关于HTML语义化，以下哪个说法是正确的？（ ）', //									 string	标题
        subject: '', //								 int	学科id标识
        step: '', //									 int	阶段1、初级 2、中级 3、高级
        enterprise: '', //						 int	企业id标识
        city: '', //									 array	[省、市、区县]
        type: 1, //									 	 string	题型 1单选 、2多选 、3简答
        difficulty: '', //						 int	题目难度 1简单 、2一般 、3困难
        single_select_answer: '', //	 string	单选题答案
        multiple_select_answer: '', // array	多选题答案
        short_answer: '', //					 string	简答题答案
        video: '', //									 string	解析视频地址
        answer_analyze: '', //				 string	答案解析
        // '<div data-w-e-type="todo"><input type="checkbox" disabled >1、<strong>什么是HTML语义化</strong>？<span style="color: rgb(225, 60, 57);">根据内容的结构化（内容语义化</span>），<span style="background-color: rgb(216, 68, 147);">选择合适的标签（</span><span style="background-color: rgb(216, 68, 147); font-size: 22px;"><strong>代码语义化</strong></span><span style="background-color: rgb(216, 68, 147);">）便于开发者阅读和写出更优雅的代码的同时让浏览器的爬虫和机器很好地解析。</span></div><div data-w-e-type="todo"><input type="checkbox" disabled >2、<strong>为什么要语义化？</strong><span style="font-size: 14px;"><u>为了在没有</u></span><span style="font-size: 14px; font-family: 微软雅黑;"><u>CSS</u></span><span style="font-size: 14px;"><u>的情况下，页面也能呈现出很好地内容结构、</u></span><span style="background-color: rgb(255, 236, 61); font-size: 14px;"><u>代码结构用户体验</u></span></div>', //				 string	答案解析
        remark: '', //								 string	答案备注
        select_options: [
          { label: 'A', text: '', image: '' },
          { label: 'B', text: '', image: '' },
          { label: 'C', text: '', image: '' },
          { label: 'D', text: '', image: '' },
          // { label: 'A', text: '语义化的HTML有利于机器的阅读，如PDA手持设备、搜索引擎爬虫；但不利于人的阅读', image: '' },
          // { label: 'B', text: 'Table 属于过时的标签，遇到数据列表时，需尽量使用 div 来模拟表格', image: '' },
          // { label: 'C', text: '语义化是HTML5带来的新概念，此前版本的HTML无法做到语义化', image: '' },
          // { label: 'D', text: 'header、article、address都属于语义化明确的标签', image: '' },
        ], //				 array	选项，介绍，图片介绍
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: ['blur', 'change'] }],
        subject: [{ required: true, message: '请输入学科', trigger: ['blur', 'change'] }],
        step: [{ required: true, message: '请输入阶段', trigger: ['blur', 'change'] }],
        enterprise: [{ required: true, message: '请输入企业', trigger: ['blur', 'change'] }],
        city: [{ required: true, message: '请输入城市', trigger: ['blur', 'change'] }],
        type: [{ required: true, message: '请输入题型', trigger: ['blur', 'change'] }],
        difficulty: [{ required: true, message: '请输入题目难度', trigger: ['blur', 'change'] }],
        single_select_answer: [{ required: true, message: '请输入单选题答案', trigger: ['blur', 'change'] }],
        multiple_select_answer: [{ required: true, message: '请输入多选题答案', trigger: ['blur', 'change'] }],
        short_answer: [{ required: true, message: '请输入简答题答案', trigger: ['blur', 'change'] }],
        video: [{ required: true, message: '请上传视频', trigger: ['blur', 'change'] }],
        answer_analyze: [{ required: true, message: '请输入答案解析', trigger: ['blur', 'change'] }],
        remark: [{ required: true, message: '请输入答案备注', trigger: ['blur', 'change'] }],
        select_options: [{ required: true, message: '请输入选项介绍图片介绍', trigger: ['blur', 'change'] }],
      },
    }
  },
  computed: {
    // 答题模式
    answer: {
      get() {
        return this.form.type == 1 ? 'form.single_select_answer' : 'form.multiple_select_answer'
      },
      set(val) {
        console.log(val)
        this.form.type == 1 ? (this.form.single_select_answer = val) : (this.form.multiple_select_answer = val)
      },
    },
    // 城市列表数据处理
    cityComputed: {
      get() {
        if (typeof this.form.city == 'string') {
          return this.form.city.split(',')
        } else {
          return this.form.city
        }
      },
      set(val) {
        this.form.city = val
      },
    },
  },
  mounted() {
    // 获取企业信息,学科信息
    this.$bus.$on('enterprise', (val) => {
      this.enterprise = val
    })
    this.$bus.$on('subject', (val) => {
      this.subject = val
    })
  },
  methods: {
    // 初始化数据
    initData() {
      Object.keys(this.form).forEach((key) => {
        if (key == 'select_options') {
          this.form[key] = this.form[key].map((item) => {
            return {
              label: item.label,
            }
          })
        } else if (key == 'type') {
          return
        } else {
          this.form[key] = ''
        }
      })
      this.$refs.form.resetFields()
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = this.isEdit ? await questionEditAPI(this.form) : await questionAddAPI(this.form)
          this.initData()
          console.log(res)
        } else {
          console.log('%c Line:203 🍋 验证失败', 'color:#f5ce50', '验证失败')
          return false
        }
      })
    },
    // 取消提示
    handleClose() {
      this.$confirm('检测到未保存的内容，是否离开页面？', '确认信息', {
        distinguishCancelAndClose: false,
        confirmButtonText: '离开页面',
        cancelButtonText: '取消',
        showClose: false,
      })
        .then(() => {
          this.dialogFormVisible = false
          this.initData()
          this.$refs.form.resetFields()
        })
        .catch((action) => {
          console.log(action)
        })
    },
  },
}
</script>

<style lang="scss">
.el-radio-group {
  font-size: 16px;
}
</style>
<style></style>
