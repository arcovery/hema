<template>
  <div class="question-container">
    <QSelect @searchEvent="searchEvent" @DialogerShow="DialogerShow(false)"></QSelect>

    <div v-if="data.length" class="card w-full bg-base-100 shadow-xl p-5">
      <!-- <button class="btn btn-primary">题库列表</button> -->
      <div class="overflow-x-auto w-full">
        <table class="table w-full text-center">
          <!-- head -->
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <th>序号</th>
              <th>题目</th>
              <th>学科<span class="m-2">阶段</span></th>
              <th>题型</th>
              <th class="text-left">企业</th>
              <th class="text-left">创建者</th>
              <th>状态</th>
              <th>访问量</th>
              <th>操作</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <td>{{ (pagination.page - 1) * pagination.limit + index + 1 }}</td>
              <td class="w-20 overflow-hidden text-ellipsis whitespace-nowrap">
                <div v-html="item.title"></div>
              </td>
              <td>
                {{ item.subject_name }}
                <br />
                <span v-question:step="item.step" :class="{ 'badge-accent': item.step === 1, 'badge-primary': item.step === 2, 'badge-primary': item.step === 2 }" class="badge badge-sm"></span>
              </td>
              <td>
                <!-- <span class="svg-container">
                  <svg-icon v-if="item.type === 1" icon-class="Single" />
                  <svg-icon v-else-if="item.type === 2" icon-class="Multiple" />
                  <svg-icon v-else icon-class="Answer" />
                </span> -->
                <span v-question:type="item.type"></span>
              </td>
              <td>
                <div class="text-left w-14 overflow-hidden text-ellipsis whitespace-nowrap">{{ item.enterprise_name }}</div>
              </td>
              <td>
                <div class="flex items-center space-x-3">
                  <!-- <div class="avatar">
                    <div class="mask mask-squircle w-12 h-12">
                      <img :src="getAvatar(item.id)" alt="Avatar Tailwind CSS Component" />
                    </div>
                  </div> -->
                  <div>
                    <div class="font-bold">{{ item.username }}</div>
                    <!-- <div class="text-sm opacity-50">{{ item.enterprise_name }}</div> -->
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div v-question:status="item.status" class="text-sm"></div>
                  <el-switch v-model="item.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" @change="changeStatus(item.id)"> </el-switch>
                </div>
              </td>
              <td>{{ item.reads }}</td>

              <th>
                <button class="btn btn-ghost btn-sm" @click="editor(item)">编辑</button>
                <button class="btn btn-ghost btn-sm text-red-600" @click="deleteEvent(item)">删除</button>
              </th>
            </tr>
          </tbody>

          <!-- foot -->
          <tfoot>
            <tr>
              <th></th>
              <th>序号</th>
              <th>题目</th>
              <th>学科-阶段</th>
              <th>题型</th>
              <th class="text-left">企业</th>
              <th class="text-left">创建者</th>
              <th>状态</th>
              <th>访问量</th>
              <th class="text-center">操作</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
      <el-pagination
        class="text-center mt-2"
        background
        :total.sync="total"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size.sync="pagination.limit"
        :page-sizes="[1, 3, 5, 10, 20, 30, 50, 100]"
        :current-page.sync="pagination.page"
        @current-change="handleCurrentChange"
        @size-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <div v-else>
      <div class="hero bg-white rounded-3xl">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">没有数据</h1>
            <p class="py-6">请重试</p>
            <button class="btn btn-primary" @click="initData()">确定</button>
          </div>
        </div>
      </div>
    </div>
    <Dialoger ref="Dialoger" @initData="initData()"></Dialoger>
  </div>
</template>

<script>
import { questionListAPI, questionRemoveAPI, questionStatusAPI } from '@/api/question'
import QSelect from './select.vue'
import Dialoger from './qdialog.vue'
import { userListAPI } from '@/api/user'
import jsCookie from 'js-cookie'
export default {
  name: 'Question',
  components: { Dialoger, QSelect },
  data() {
    return {
      currentPage: 1,
      total: 10,
      pagination: {
        page: 1,
        limit: Number(jsCookie.get('limit')) || 5,
      },
      data: [],
      search: false,
      searchForm: {},
    }
  },
  async created() {
    this.initData(this.pagination)
  },
  methods: {
    // 当前页面改变
    async handleCurrentChange() {
      this.initData(this.pagination)
      jsCookie.set('limit', this.pagination.limit)
    },

    // 初始化数据
    async initData(data) {
      let res = {}
      if (this.search) {
        res = await questionListAPI(Object.assign(this.searchForm, this.pagination))
      } else {
        res = await questionListAPI(data)
      }
      this.total = res.data.pagination.total
      // this.pagination.page = res.data.pagination.page
      this.data = res.data.items
    },
    // 修改题目状态
    changeStatus(data) {
      questionStatusAPI({ id: data })
    },
    // 搜索事件
    searchEvent(data, isSearch) {
      this.search = isSearch
      this.searchForm = data
      this.initData()
    },
    // 显示对话框
    DialogerShow(status) {
      this.$refs.Dialoger.dialogFormVisible = true
    },
    // 编辑对话框
    editor(item) {
      this.$refs.Dialoger.dialogFormVisible = true
      this.$refs.Dialoger.isEdit = true
      this.$refs.Dialoger.form = JSON.parse(JSON.stringify(item))
    },
    // 获取头像
    async getAvatar(username) {
      const res = await userListAPI({ username })
      console.log(res)
      return
    },
    // 删除事件
    deleteEvent(data) {
      this.$confirm('确认是否删除？', '温馨提醒', {
        distinguishCancelAndClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '我点错了',
        showClose: false,
      })
        .then(async () => {
          await questionRemoveAPI({ id: data.id })
          // 解决数据只剩一条点击删除后页面为空的问题
          if (this.data.length === 1 && this.pagination.page > 1) {
            this.pagination.page = this.pagination.page - 1
          }
          this.initData(this.pagination)
        })
        .catch((text) => {
          console.log(text)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.question {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.svg-container {
  // padding: 6px 5px 6px 15px;
  // color: #000;
  // vertical-align: middle;
  margin-right: 4px;
  // line-height: 1;
  // display: inline-table;
  .svg-icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
</style>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 24px;
  // &::-webkit-scrollbar {
  //   width: 0;
  // }
}
</style>
