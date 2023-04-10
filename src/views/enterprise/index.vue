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
                <el-option label="禁用" value="shanghai">禁用</el-option>
                <el-option label="启用" value="beijing">启用</el-option>
              </el-select>
            </el-form-item>
            <el-form>
              <button class="btn btn-primary">搜索</button>
              <button class="btn btn-eee btn-outline">清除</button>
              <button class="btn">+新增企业</button>
            </el-form>
          </el-form>
        </div>

        <el-table :data="list">
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="name" label="企业编号"></el-table-column>
          <el-table-column prop="name" label="企业名称"></el-table-column>
          <el-table-column prop="name" label="创建者"></el-table-column>
          <el-table-column prop="name" label="状态"></el-table-column>
          <el-table-column prop="name" label="操作">
            <template>
              <el-button type="text">编辑</el-button>
              <el-button type="text">启用</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page.sync="page.page"
            :page-size.sync="page.size"
            :page-sizes="[1, 5, 20, 50, 100, 200, 300, 400]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getData"
            @current-change="getData"
          >
          </el-pagination>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { enterpriseListAPI } from '@/api/enterprise'
export default {
  name: 'Enterprise',
  data() {
    return {
      list: [{}],
      page: {
        page: 1, //  是  1  页码
        size: 10, //  是  10  每页条数
      },
      total: 100,
    }
  },
  methods: {
    async getData() {
      // const res = await enterpriseListAPI({})
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
