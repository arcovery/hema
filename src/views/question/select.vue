<template>
  <div class="bg-base-100 shadow-xl rounded-xl p-4 mb-5">
    <div class="flex justify-between flex-wrap">
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">学科</h2>
        <el-select v-model="search.subject" clearable placeholder="请选择">
          <el-option v-for="(item, index) in subject" :key="index" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">企业</h2>
        <el-select v-model.number="search.enterprise" clearable placeholder="请选择">
          <el-option v-for="(item, index) in enterprise" :key="index" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">阶段</h2>
        <el-select v-model.number="search.step" clearable placeholder="请选择">
          <el-option v-for="item in step" :key="item.id" :label="item.value" :value="item.id"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">题型</h2>
        <el-select v-model.number="search.type" clearable placeholder="请选择">
          <el-option v-for="item in type" :key="item.id" :label="item.value" :value="item.id"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">难度</h2>
        <el-select v-model.number="search.difficulty" clearable placeholder="请选择">
          <el-option v-for="item in difficulty" :key="item.id" :label="item.value" :value="item.id"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">状态</h2>
        <el-select v-model.number="search.status" clearable placeholder="请选择">
          <el-option v-for="item in status" :key="item.id" :label="item.value" :value="item.id"> </el-option>
        </el-select>
      </div>
      <div class="mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">时间</h2>
        <div class="block">
          <el-date-picker v-model="search.create_date" class="date" type="date" placeholder="选择日期"> </el-date-picker>
        </div>
      </div>
      <div class="form-control mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">标题</h2>
        <el-input v-model="search.title" clearable placeholder="标题"></el-input>
      </div>
      <div class="form-control mr-2 mb-2 w-1/6">
        <h2 class="card-title mb-2 mr-2">作者</h2>
        <el-input v-model="search.username" clearable placeholder="作者"></el-input>
      </div>
      <div class="mr-2 mb-2 w-1/6 flex justify-evenly items-end">
        <button class="btn btn-primary" @click="searchEvent">搜索</button>
        <button class="btn btn-ghost btn-outline" @click="resetEvent">重置</button>
        <button class="btn" @click="DialogerShow">新增题目</button>
      </div>
    </div>
  </div>
</template>

<script>
import { subjectListAPI } from '@/api/subject'
import { enterpriseListAPI } from '@/api/enterprise'
import question from '@/api/constant/question.js'
export default {
  name: 'QSelect',
  data() {
    return {
      subject: [],
      enterprise: [],
      step: question.step,
      type: question.type,
      difficulty: question.difficulty,
      status: question.status,
      search: {
        subject: '',
        enterprise: '',
        step: '',
        type: '',
        difficulty: '',
        status: '',
        title: '',
        username: '',
        create_date: '',
      },
    }
  },
  async created() {
    const res = await subjectListAPI({ limit: 9999 })
    this.subject = res.data.items
    const res2 = await enterpriseListAPI({ limit: 9999 })
    this.enterprise = res2.data.items
    this.$bus.$emit('enterprise', this.enterprise)
    this.$bus.$emit('subject', this.subject)
  },
  mounted() {},
  beforeDestroy() {
    this.$bus.$off('enterprise', this.enterprise)
    this.$bus.$off('subject', this.subject)
  },
  methods: {
    // 搜索
    searchEvent() {
      if (Object.keys(this.search).some((i) => this.search[i] != '')) {
        this.$emit('searchEvent', this.search)
      } else {
        this.$message.error({ message: '请输入搜索内容' })
      }
    },
    //重置
    resetEvent() {
      Object.keys(this.search).forEach((i) => (this.search[i] = ''))
      this.$emit('searchEvent', {})
    },
    // 显示新增对话框
    DialogerShow() {
      this.$emit('DialogerShow')
    },
  },
}
</script>
