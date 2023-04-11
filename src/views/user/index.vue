<template>
  <div class="user">
    <el-card>
      <el-form ref="form" class="top" :inline="true" :model="form">
        <el-form-item label="用户名称">
          <el-input v-model="form.username" size="small" />
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
          <button class="btn" type="primary" @click="searchEvent">查询</button>
        </el-form-item>
        <el-form-item>
          <button class="btn" @click="clearEvent">清除</button>
        </el-form-item>
        <el-form-item>
          <button class="btn" icon="el-icon-plus" type="primary" @click="addEvent">新增用户</button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="list">
        <el-table-column label="序号">
          <template #default="{ $index }">
            <div>
              {{ (page.page - 1) * page.limit + $index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable />
        <el-table-column prop="phone" label="电话" sortable />
        <el-table-column prop="email" label="邮箱" sortable />
        <el-table-column prop="role" label="角色" sortable />
        <el-table-column prop="remark" label="备注" sortable />
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="{ row }">
            <div>{{ row.status ? '禁用' : '启用' }}</div>
            <el-switch v-model="row.status" :active-value="0" :inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <button class="btn" type="text" @click="editEvent(row)">编辑</button>
            <button class="btn" type="text" @click="useEvent(row)">{{ row.status ? '启用' : '禁用' }}</button>
            <button class="btn" type="text" @click="delEvent(row)">删除</button>
          </template>
        </el-table-column>
      </el-table>
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
    <Add ref="add" @getData="getData" />
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
      page: {
        page: 1,
        limit: +jsCookie.get('user_size') || 5,
      },
      total: 100,
      userData,
      value: '',
    }
  },
  // computed: {
  //   async searchItem() {

  //   },
  // },
  created() {
    this.getData()
  },
  methods: {
    addEvent() {
      this.$refs.add.isShow = true
    },
    async getData(data) {
      const res = await userListAPI(data)
      this.list = res.data.items
      this.total = res.data.pagination.total
      console.log(res)
    },
    sizeChange() {
      this.getData({ ...this.form, ...this.page })
      jsCookie.set('user_size', this.page.limit)
    },
    async delEvent(row) {
      await this.$confirm('确认删除？')
      // console.log(row)
      await userRemoveAPI(row)
      this.$message.success('删除成功')
      this.getData()
    },
    editEvent(row) {
      console.log(row)
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
    },
    async useEvent(row) {
      console.log(row)
      const res = await userStatusAPI({ id: row.id })
      // console.log(res)
      if (res.code === 200) {
        row.status = row.status ? 0 : 1
      }
    },
    async searchEvent() {
      this.getData({ ...this.form, page: 1, limit: this.page.limit })
    },
    clearEvent() {
      this.$refs.form.resetFields()
      this.form = {
        username: '',
        email: '',
        role_id: '',
      }
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
