<template>
  <div class="question-container">
    <QSelect @searchEvent="searchEvent" @DialogerShow="DialogerShow(false)"></QSelect>

    <div class="card w-full bg-base-100 shadow-xl p-5">
      <!-- <button class="btn btn-primary">题库列表</button> -->
      <div class="overflow-x-auto w-full">
        <table class="table w-full">
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
              <th>学科<span class="badge badge-sm">阶段</span></th>
              <th>题型</th>
              <th>企业</th>
              <th>创建者</th>
              <th>状态</th>
              <th>访问量</th>
              <th class="text-center">操作</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-if="data.length">
            <tr v-for="(item, index) in data" :key="item.id" class="">
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <td>{{ index }}</td>
              <td v-html="item.title"></td>
              <td>
                {{ item.subject_name }}
                <br />
                <span v-question:step="item.step" :class="{ 'badge-accent': item.step === 1, 'badge-primary': item.step === 2, 'badge-primary': item.step === 2 }" class="badge badge-sm"></span>
              </td>
              <td>
                <span class="svg-container">
                  <svg-icon v-if="item.type === 1" icon-class="Single" />
                  <svg-icon v-else-if="item.type === 2" icon-class="Multiple" />
                  <svg-icon v-else icon-class="Answer" />
                </span>
                <span v-question:type="item.type"></span>
              </td>
              <td>
                <div class="border text-center rounded-2xl">{{ item.enterprise_name }}</div>
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

              <th class="text-center">
                <button class="btn btn-ghost btn-xs" @click="editor(item)">编辑</button>
                <button class="btn btn-ghost btn-xs text-red-600 btn-disabled">删除</button>
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
              <th>企业</th>
              <th>创建者</th>
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
    <Dialoger ref="Dialoger"></Dialoger>
  </div>
</template>

<script>
import { questionListAPI, questionStatusAPI } from '@/api/question'
import QSelect from './select.vue'
import Dialoger from './qdialog.vue'
import { userListAPI } from '@/api/user'
export default {
  name: 'Question',
  components: { Dialoger, QSelect },
  data() {
    return {
      currentPage: 1,
      total: 10,
      pagination: {
        page: 1,
        limit: 5,
      },
      data: [],
    }
  },
  async created() {
    this.initData(this.pagination)
  },
  methods: {
    // 当前页面改变
    async handleCurrentChange() {
      this.initData(this.pagination)
    },

    // 初始化数据
    async initData(data) {
      const res = await questionListAPI(data)
      this.total = res.data.pagination.total
      // this.pagination.page = res.data.pagination.page
      this.data = res.data.items
    },
    // 修改题目状态
    changeStatus(data) {
      questionStatusAPI({ id: data })
    },
    // 搜索事件
    searchEvent(data) {
      const res = Object.assign(data, this.pagination)
      this.initData(res)
    },
    // 显示对话框
    DialogerShow(status) {
      this.$refs.Dialoger.dialogFormVisible = true
    },
    editor(item) {
      this.$refs.Dialoger.dialogFormVisible = true
      this.$refs.Dialoger.form = item
    },
    async getAvatar(username) {
      const res = await userListAPI({ username: 'wlj12334' })
      console.log(res)
      return
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
