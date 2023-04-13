<template>
  <div>
    <el-dialog :title="{ add: '新增学科', edit: '编辑学科' }[mode]" :visible.sync="isShow" class="dialog" @close="delEvent">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="form.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称">
          <el-input v-model="form.short_name"></el-input>
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
          <button class="btn btn-ghost btn-outline" @click="isShow = false">取消</button>
          <button class="btn btn-primary" @click="submit">确认</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { subjectAddAPI, subjectEditAPI } from '@/api/subject'
export default {
  data() {
    return {
      mode: 'add',
      isShow: false,
      form: {
        rid: '',
        name: '',
        short_name: '',
        intro: '',
        remark: '',
      },
      rules: {
        rid: [
          { required: true, message: '编码不能为空', trigger: 'change' },
          { max: 7, min: 2, message: '请输入2-7个字符', trigger: 'change' },
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'change' },
          { max: 7, min: 2, message: '请输入2-7个字符', trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (result) => {
        if (result) {
          const res = this.mode == 'add' ? await subjectAddAPI(this.form) : await subjectEditAPI(this.form)
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.isShow = false
            this.$emit('getdata')
          }
          // if (this.mode == 'add') {
          //   res = await subjectAddAPI(this.form)
          //   // console.log(res)
          // } else {
          //   res = await subjectEditAPI(this.form)
          // }
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
