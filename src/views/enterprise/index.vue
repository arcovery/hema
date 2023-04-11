<template>
  <el-row>
    <el-col>
      <el-card class="enterprise-container">
        <div class="div">
          <el-form class="form">
            <el-form-item label="企业编号">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="创建者">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select placeholder="请选择">
                <el-option v-for="item in getname.status" :key="item.id" v-model="item.value" :value="item.id" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form>
              <button class="btn btn-primary">搜索</button>
              <button class="btn btn-eee btn-outline">清除</button>
              <button class="btn" @click="addClick">+新增企业</button>
            </el-form>
          </el-form>
        </div>

        <el-table :data="list">
          <el-table-column label="序号">
            <template #default="{ $index }">
              <div>
                {{ (page.page - 1) * page.limit + $index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="eid" label="企业编号"></el-table-column>
          <el-table-column prop="name" label="企业名称"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column prop="update_time" label="创建日期"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <div>{{ row.status ? '启用' : '禁用' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="delEvent(row)">编辑</el-button>
              <el-button type="text" @click="row.status = !row.status">{{ row.status ? '禁用' : '启用' }}</el-button>
              <el-button type="text" @click="elEvent(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page.sync="page.page"
            :page-size.sync="page.limit"
            :page-sizes="[1, 5, 10, 15, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="sizeChange"
            @current-change="getData"
          >
          </el-pagination>
        </div>
      </el-card>
      <Add ref="add" @getData="getData"></Add>
    </el-col>
  </el-row>
</template>

<script>
import { enterpriseListAPI, enterpriseRemoveAPI } from '@/api/enterprise'
import Add from './components/Add.vue'
import getname from '@/api/constant/question'
import jsCookie from 'js-cookie'
export default {
  name: 'Enterprise',
  components: {
    Add,
  },
  data() {
    return {
      list: [],
      getname,
      page: {
        page: 1, //	:'',//否	string	页码 默认为1
        limit: +jsCookie.get('employees_size') || 10, //t	否	string	页尺寸 默认为10
        // name: '', //	否	string	企业名称
        // eid: '', //	否	string	企业id
        // username: '', //	否	string	用户名
        // status: '', //	否	string	状态 1（启用） 0（禁用）
      },
      total: 100,
    }
  },
  created() {
    this.getData()
    // console.log('getname', this.getname)
    // console.log('list', this.list)
  },
  methods: {
    async getData() {
      const res = await enterpriseListAPI(this.page)
      this.list = res.data.items
      this.total = res.data.pagination.total
      console.log('getData', res)
    },
    sizeChange() {
      jsCookie.set('employees_size', this.page.limit)
      this.getData()
    },
    addClick() {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'add'
    },
    async elEvent(row) {
      await this.$confirm('是否确定删除')
      await enterpriseRemoveAPI(row)
      if (this.page.page > 1 && this.list.length === 0) {
        this.page.page--
        // console.log(this.page.page)
        // console.log(this.list)
      }
      this.getData()
      // console.log(res)
    },
    async delEvent(row) {
      // console.log(this.list)
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.id = row.id
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
      // this.$refs.add.agetData()
    },
    RowEnevet(row) {
      console.log(row)
    },
  },
}
</script>

<style lang="scss" scoped>
.enterprise-container {
  margin: 20px;
  .div {
    .form {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .btn-eee {
        margin: 10px;
      }
    }
  }
  .block {
    text-align: center;
    padding-top: 20px;
  }
}
</style>
