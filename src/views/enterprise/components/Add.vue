<template>
  <el-dialog :title="{ add: '新增企业', edit: '编辑企业' }[mode]" width="600px" :visible.sync="isShow" class="center">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model="form.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short">
        <el-input v-model="form.short"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="center">
        <el-button>取消</el-button>
        <el-button class="btn" @click="addClick">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { enterpriseAddAPI } from '@/api/enterprise'
export default {
  data() {
    return {
      isShow: false,
      mode: 'add',
      form: {
        eid: '', //	是	string	企业编号
        name: '', //	是	string	企业名称
        short: '', // name	是	string	简称
        intro: '', //	是	string	企业简介
        remark: '', //
      },
      rules: {
        eid: [{ required: true, message: '请输入企业编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入企业名称', trigger: 'change' }],
        short: [{ required: true, message: '请输入企业简称', trigger: 'change' }],
        intro: [{ required: true, message: '请输入企业简介', trigger: 'change' }],
      },
    }
  },
  methods: {
    async addClick() {
      this.$refs.form.validate(async (result) => {
        if (result) {
          const res = await enterpriseAddAPI(this.form)
          this.$message.success('新增员工成功')
          // 关闭弹框
          this.isShow = false
          // 刷新父级列表数据，
          this.$emit('getData') // 需要父级组件内在Add组件标签上绑定getData方法
          // 父级组件内 <Add   @getData="getData" />
          this.$refs.form.resetFields()
          this.form = {
            eid: '', //	是	string	企业编号
            name: '', //	是	string	企业名称
            short: '', // name	是	string	简称
            intro: '', //	是	string	企业简介
            remark: '', //
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}
</style>
