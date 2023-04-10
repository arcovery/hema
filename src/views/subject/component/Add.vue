<template>
  <div>
    <el-dialog title="新增学科" :visible.sync="isShow" class="dialog" @close="delEvent">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="form.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称">
          <el-input v-model="form.abb"></el-input>
        </el-form-item>
        <el-form-item label="学科简介">
          <el-input v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="button">
          <button class="btn btn-ghost btn-outline">取消</button>
          <button class="btn btn-primary" @click="submit">确认</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { subjectAddAPI } from '@/api/subject'
export default {
  data() {
    return {
      isShow: false,
      form: {
        rid: '',
        name: '',
        abb: '',
        intro: '',
        remark: '',
      },
      rules: {
        rid: [{ required: true, message: '编码不能为空', trigger: 'change' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (result) => {
        if (result) {
          const res = await subjectAddAPI(this.form)
          this.$message.success('增加成功')
          this.isShow = false
          this.$emit('getdata')
          console.log(res)
        }
      })
    },
    delEvent() {
      this.$refs.form.resetFields()
      this.form = {
        rid: '',
        name: '',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  text-align: center;
  ::v-deep.el-dialog__header {
    background-color: #04bafa;
  }
  ::v-deep.el-dialog__title {
    color: #fff;
  }
  .button {
    // padding-top: 20px;
    text-align: center;
  }
}
</style>
