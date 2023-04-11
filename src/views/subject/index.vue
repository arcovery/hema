<template>
  <div class="subject-container">
    <el-card>
      <el-form v-model="formsubject" :inline="true" class="form">
        <el-form-item label="学科编号">
          <el-input v-model="formsubject.num"></el-input>
        </el-form-item>
        <el-form-item label="学科名称">
          <el-input v-model="formsubject.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="formsubject.creator"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formsubject.sate" placeholder="请选择">
            <el-option label="启用" value="qiyong"></el-option>
            <el-option label="禁用" value="jingyong"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-primary">搜索</button>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-ghost btn-outline">清除</button>
        </el-form-item>
        <el-form-item>
          <button class="btn btn-primary" @click="addEvent">+新增学科</button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="rid" label="学科编号"> </el-table-column>
        <el-table-column prop="name" label="学科名称"> </el-table-column>
        <el-table-column prop="short_name" label="学科简称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column prop="update_time" label="创建日期"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template #default="{ row }">
            <el-button type="text" size="medium" @click="editEvent(row)">编辑</el-button>
            <el-button type="text" size="medium">禁用</el-button>
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
          @size-change="getData"
          @current-change="getData"
        >
        </el-pagination>
      </div>
    </el-card>
    <Add ref="add" @getdata="getData" />
  </div>
</template>

<script>
import { subjectListAPI, subjectRemoveAPI } from '@/api/subject'
import Add from './component/Add.vue'
export default {
  name: 'Subject',
  components: {
    Add,
  },
  data() {
    return {
      formsubject: {
        num: '',
        name: '',
        creator: '',
        sate: '',
      },
      tableData: [],
      page: {
        page: 1,
        limit: 3,
      },
      total: 50,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await subjectListAPI(this.page)
      this.tableData = res.data.items
      this.total = res.data.pagination.total
      // console.log(res)
    },
    // 新增
    addEvent() {
      this.$refs.add.isShow = true
      this.$refs.add.tt = 'add'
    },
    // 删除
    async delEvent(id) {
      await this.$confirm('您确定删除此学科吗?', '警告')
      await subjectRemoveAPI({ id })
      this.$message.success('删除成功')
      if (this.page.page > 1 && this.tableData.length === 1) {
        this.page.page--
      }
      this.getData()
    },
    //编辑
    editEvent(row) {
      this.$refs.add.isShow = true
      this.$refs.add.form = JSON.parse(JSON.stringify(row))
      this.$refs.add.tt = 'edit'
      console.log(row)
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
