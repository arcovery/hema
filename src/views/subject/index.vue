<template>
  <div class="subject-container">
    <el-card>
      <el-form v-model="formsubject" :inline="true" class="form">
        <el-form-item label="学科编号">
          <el-input v-model.trim="formsubject.rid" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="学科名称">
          <el-input v-model.trim="formsubject.name" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model.trim="formsubject.username" clearable=""></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formsubject.status" clearable="" placeholder="请选择">
            <el-option label="禁用" value="1"></el-option>
            <el-option label="启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-primary" @click="searchEvent">搜索</button>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-ghost btn-outline" @click="clearEvent">清除</button>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-primary" @click="addEvent">+新增学科</button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="list" style="width: 100%">
        <el-table-column label="序号">
          <template #default="{ $index }">
            <div>
              {{ (page.page - 1) * page.limit + $index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rid" label="学科编号"> </el-table-column>
        <el-table-column prop="name" label="学科名称"> </el-table-column>
        <el-table-column prop="short_name" label="学科简称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="update_time" label="创建日期" width="200px"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <div>
              {{ row.status == 1 ? '禁用' : '启用' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="200px">
          <template #default="{ row }">
            <el-button type="text" size="medium" @click="editEvent(row)">编辑</el-button>
            <el-button type="text" size="medium" @click="stopEvent(row)">{{ row.status == 1 ? '启用' : '禁用' }}</el-button>
            <el-button type="text" size="medium" @click="delEvent(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page.sync="page.page"
          :page-size.sync="page.limit"
          :page-sizes="[1, 3, 5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="sizeChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <Add ref="add" @getdata="getData(page)" />
  </div>
</template>

<script>
import { subjectListAPI, subjectRemoveAPI, subjectStatusAPI } from '@/api/subject'
import commonData from '@/api/constant/common'
import Add from './component/Add.vue'
import jsCookie from 'js-cookie'
export default {
  name: 'Subject',
  components: {
    Add,
  },
  data() {
    return {
      formsubject: {
        rid: '',
        name: '',
        username: '',
        status: '',
      },
      search: '',
      searchform: {},
      list: [],
      page: {
        page: 1,
        limit: +jsCookie.get('www') || 3,
      },
      commonData,
      total: 50,
    }
  },
  watch: {
    search(val) {
      if (val) {
        this.searchform = JSON.parse(JSON.stringify(this.formsubject))
      }
    },
  },
  created() {
    this.getData(this.page)
  },
  methods: {
    //渲染列表
    async getData(data) {
      const res = await subjectListAPI(data)
      this.list = res.data.items
      this.total = res.data.pagination.total
      // console.log(res)
    },
    sizeChange() {
      if (this.search) {
        this.getData({ ...this.searchform, ...this.page })
      } else {
        this.getData(this.page)
      }
      jsCookie.set('www', this.page.limit)
    },
    // 新增
    addEvent() {
      this.$refs.add.isShow = true
      this.$refs.add.mode = 'add'
    },
    // 删除
    async delEvent(id) {
      await this.$confirm('您确定删除此学科吗?', '警告')
      const res = await subjectRemoveAPI({ id })
      if (res.code == 200) {
        this.$message.success('删除成功')
        if (this.page.page > 1 && this.list.length === 1) {
          this.page.page--
        }
        this.getData(this.page)
      }
    },
    // 编辑
    editEvent(row) {
      this.$refs.add.isShow = true
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
      this.$refs.add.mode = 'edit'
    },
    //禁用按钮
    async stopEvent(row) {
      const res = await subjectStatusAPI({ id: row.id })
      console.log(res)
      if (res.code === 200) {
        row.status = row.status ? 0 : 1
      }
      // if (this.search) {
      //   this.getData({ ...this.searchform, ...this.page })
      // } else {
      //   this.getData(this.page)
      // }
    },
    // 搜索
    async searchEvent() {
      if (Object.values(this.formsubject).some((i) => i)) {
        this.search = true
        const res = await subjectListAPI({ ...this.formsubject, ...this.page })
        console.log(res)
        this.list = res.data.items
        this.total = res.data.pagination.total
      } else {
        this.$message.error('请输入搜索内容')
      }
    },
    //清空
    clearEvent() {
      Object.keys(this.formsubject).forEach((i) => (this.formsubject[i] = ''))
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
.subject {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.subject-container {
  .pagination {
    text-align: center;
    padding-top: 30px;
  }
}
</style>
