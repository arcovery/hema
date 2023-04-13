<template>
  <el-row>
    <el-col>
      <el-card class="enterprise-container">
        <div class="div">
          <el-form class="form" :model="form" :inline="true">
            <el-form-item label="企业编号">
              <el-input v-model="form.eid"></el-input>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="创建者">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="item in getname.status" :key="item.id" :value="item.id" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <button class="btn btn-primary" @click="SearchEnevt">搜索</button>
              <button class="btn btn-eee btn-outline" @click="clearEvent">清除</button>
              <button class="btn" @click="addClick">+新增企业</button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <el-card class="enterprise-container">
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
              <!-- {{ row }} -->
              <div>{{ row.status ? '启用' : '禁用' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="delEvent(row)">编辑</el-button>
              <el-button type="text" @click="RowEnevet(row)">{{ row.status ? '禁用' : '启用' }}</el-button>
              <el-button type="text" @click="elEvent(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page.sync="page.page"
            :page-size.sync="page.limit"
            :page-sizes="[1, 5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="sizeChange"
            @current-change="sizeChange"
          >
          </el-pagination>
        </div>
      </el-card>
      <Add ref="add" :add="Add" @getData="getData(page)"></Add>
    </el-col>
  </el-row>
</template>

<script>
import { enterpriseListAPI, enterpriseRemoveAPI, enterpriseStatusAPI } from '@/api/enterprise'
import Add from './components/Add.vue'
import getname from '@/api/constant/question'
import jsCookie from 'js-cookie'
import { rule } from 'postcss'
export default {
  name: 'Enterprise',
  components: {
    Add,
  },
  data() {
    return {
      getname,
      search: false,
      list: [],
      Add: [],
      form: {
        eid: '', //	否	string	企业id
        name: '', //	否	string	企业名称
        username: '', //	否	string	用户名
        status: '', //	否	string	状态 1（启用） 0（禁用）
      },
      form2: {
        eid: '', //	否	string	企业id
        name: '', //	否	string	企业名称
        username: '', //	否	string	用户名
        status: '', //	否	string	状态 1（启用） 0（禁用）
      },
      page: {
        page: 1, //	:'',//否	string	页码 默认为1
        limit: +jsCookie.get('employees_size') || 10, //t	否	string	页尺寸 默认为10
      },
      total: 100,
    }
  },
  watch: {
    search(val) {
      if (val) {
        this.form2 = JSON.parse(JSON.stringify(this.form))
      }
    },
  },
  created() {
    this.getData(this.page)
  },
  methods: {
    async getData(data) {
      const res = await enterpriseListAPI(data)
      this.total = res.data.pagination.total
      this.list = res.data.items
    },
    sizeChange() {
      if (this.search) {
        this.getData({ ...this.form2, ...this.page })
      } else {
        this.getData({ ...this.page })
      }
      jsCookie.set('employees_size', this.page.limit)
    },
    addClick() {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'add'
    },
    async elEvent(row) {
      this.$confirm('确认是否删除?', '温馨提醒', {
        distinguishCancelAndClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '我点错了',
        showClose: false,
      })
        .then(async () => {
          await enterpriseRemoveAPI(row)
          if (this.page.page > 1 && this.list.length === 1) {
            this.page.page--
          }

          this.getData(this.page)
        })
        .catch((text) => {
          console.log(text)
        })

      // this.sizeChange()
    },
    async delEvent(row) {
      // cosizeChange
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.id = row.id
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
      // this.$refs.add.agetData()
    },
    async RowEnevet(row) {
      const res = await enterpriseStatusAPI({ id: row.id })
      if (res.code === 200) {
        row.status = row.status ? 0 : 1
      }
      this.getData(this.page)
    },
    async SearchEnevt() {
      //判断对象的值是不是全为空
      if (this.form.eid || this.form.name || this.form.username || this.form.status === 0 || this.form.status === 1) {
        this.list.every((item) => {
          if (item === this.form) {
            return true
          }
        })
        const res = await enterpriseListAPI({ ...this.form, page: 1, limit: this.page.limit })
        this.total = res.data.pagination.total
        this.list = res.data.items
        this.search = true
      } else {
        return false
      }
    },
    clearEvent() {
      this.form = {
        eid: '',
        name: '',
        username: '',
        status: '',
      }
      this.search = false
      this.getData({ ...this.form, ...this.page })
    },
  },
}
</script>

<style lang="scss" scoped>
.enterprise-container {
  margin: 10px;
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
