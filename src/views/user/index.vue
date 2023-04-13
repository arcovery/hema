<template>
  <div class="user">
    <el-card>
      <el-form ref="form" class="top" :inline="true" :model="form">
        <el-form-item label="用户名称">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role_id">
            <el-option v-for="item in userData.userNameType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <button class="btn-primary btn" @click="searchEvent">查询</button>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-outline" @click="clearEvent">清除</button>
        </el-form-item>
        <el-form-item>
          <button class="btn" icon="el-icon-plus" type="primary" @click="addEvent">新增用户</button>
        </el-form-item>
        <el-form-item>
          <button v-print="{ id: 'info', popTitle: '用户信息' }" class="btn">打印</button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div id="info">
        <el-table :data="list">
          <el-table-column width="80" label="序号">
            <template #default="{ $index }">
              <div>
                {{ (page.page - 1) * page.limit + $index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" sortable />
          <el-table-column prop="phone" label="电话" sortable />
          <el-table-column width="300" prop="email" label="邮箱" sortable />
          <el-table-column prop="role" label="角色" sortable />
          <el-table-column prop="remark" label="备注" sortable />
          <el-table-column prop="status" label="状态" sortable>
            <template slot-scope="{ row }">
              <div>{{ row.status ? '禁用' : '启用' }}</div>
              <el-switch v-model="row.status" :active-value="0" :inactive-value="1" active-color="#13ce66" inactive-color="#ff4949" @click.native="useEvent(row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column width="230" label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="editEvent(row)">编辑</el-button>
              <el-button type="text" @click="useEvent(row)">{{ row.status ? '启用' : '禁用' }}</el-button>
              <el-button type="text" @click="delEvent(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page">
        <el-pagination
          :current-page.sync="page.page"
          :page-sizes="[1, 5, 10, 50, 100, 200, 300, 400]"
          :page-size.sync="page.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="sizeChange"
        />
      </div>
    </el-card>
    <Add ref="add" @getData="getaddData" />
  </div>
</template>

<script>
import Add from './components/Add.vue'
import { userListAPI, userRemoveAPI, userStatusAPI } from '@/api/user'
import jsCookie from 'js-cookie'
import userData from '@/api/constant/user'
export default {
  components: {
    Add,
  },
  data() {
    return {
      list: [],
      form: {
        username: '',
        email: '',
        role_id: '',
      },
      searchForm: {
        username: '',
        email: '',
        role_id: '',
      },
      search: false,
      page: {
        page: 1,
        limit: +jsCookie.get('user_size') || 5,
      },
      total: 100,
      userData,
      value: '',
    }
  },
  computed: {
    empty() {
      return Object.values(this.form).some((i) => i)
    },
  },
  watch: {
    search(val) {
      if (val) {
        this.searchForm = JSON.parse(JSON.stringify(this.form))
      }
    },
  },
  created() {
    this.getData({ ...this.form, page: 1, limit: this.page.limit })
  },
  mounted() {
    document.onkeyup = (e) => {
      // console.log(Object.values(this.form).some((i) => i) === true)
      if (this.empty) {
        if (e.key == 'Enter') {
          this.searchEvent()
        }
      } else {
        this.getData(this.page)
      }
    }
  },
  beforeDestroy() {
    document.onkeyup = null
  },
  methods: {
    addEvent() {
      this.$refs.add.isShow = true
    },
    async getData(data) {
      const res = await userListAPI(data)
      this.list = res.data.items
      this.total = res.data.pagination.total
      // console.log(res)
    },
    getaddData() {
      this.getData(this.page)
    },
    sizeChange() {
      if (this.search) {
        this.getData({ ...this.searchForm, ...this.page })
      } else {
        this.getData({ ...this.form, ...this.page })
      }
      jsCookie.set('user_size', this.page.limit)
    },
    async delEvent(row) {
      await this.$confirm('确认是否删除?', '温馨提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '我点错了',
        showClose: false,
      })
        .then(async () => {
          // console.log(row)
          await userRemoveAPI(row)
          this.$message.success('删除成功')
          if (this.page.page > 1 && this.list.length === 1) {
            this.page.page--
          }
          this.getData({ ...this.form, ...this.page })
        })
        .catch((text) => {
          console.log(text)
        })
    },
    editEvent(row) {
      console.log(row)
      // row.status = row.status ? '禁用' : '启用'
      // if (row.status === 1) {
      //   this.$refs.add.form.status = '禁用'
      // } else {
      //   this.$refs.add.form.status = '启用'
      // }
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
    },
    async useEvent(row) {
      console.log(row)
      const res = await userStatusAPI({ id: row.id })
      // console.log('参数', res)
      if (res.code === 200) {
        row.status = row.status ? 0 : 1
        // console.log('参数2', row.status)
      } else {
        row.status = row.status ? 0 : 1
      }
      // console.log(row.status)
    },
    async searchEvent() {
      if (!this.empty) {
        this.$message('请输入内容')
      } else {
        this.search = true
        this.getData({ ...this.form, page: 1, limit: this.page.limit }) //page: 1, limit: this.page.limit
      }
    },
    clearEvent() {
      this.search = false
      this.$refs.form.resetFields()
      this.form = {
        username: '',
        email: '',
        role_id: '',
      }
      this.getData({ ...this.form, page: 1, limit: this.page.limit })
    },
  },
}
</script>

<style lang="scss" scoped>
.user {
  padding: 20px;
}
.page {
  text-align: center;
  padding-top: 20px;
}
</style>
