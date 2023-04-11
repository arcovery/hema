<template>
  <el-dialog :title="{ add: '新增学科', edit: '编辑学科' }[mode]" :visible.sync="isShow" @close="closeEvent">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="form.role_id">
          <el-option v-for="item in userData.userNameType" :key="item.id" :value="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status">
          <el-option v-for="item in userData.statusType" :key="item.id" :value="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input v-model="form.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <button class="btn btn-primary" @click="submit">确定</button>
        <button class="btn" @click="isShow = false">取消</button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import userData from '@/api/constant/user'
import { userAddAPI, userEditAPI } from '@/api/user'
export default {
  data() {
    return {
      isShow: false,
      mode: 'add',
      userData,
      form: {
        username: '',
        email: '',
        phone: '',
        role_id: '',
        status: '',
        remark: '',
        id: '',
      },
      rules: {
        username: [{ required: true, message: '必填', trigger: 'change' }],
        email: [
          { required: true, message: '必填', trigger: 'change' },
          { pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入正确邮箱地址', trigger: 'change' },
        ],
        phone: [
          { required: true, message: '必填', trigger: 'change' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号码', trigger: 'change' },
        ],
        role_id: [{ required: true, message: '必填', trigger: 'change' }],
        status: [{ required: true, message: '必填', trigger: 'change' }],
        remark: [{ required: true, message: '必填', trigger: 'change' }],
      },
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      if (this.mode === 'add') {
        const res = await userAddAPI(this.form)
        if (res.code === 200) {
          this.isShow = false
          this.$message.success('新增成功')
          this.$emit('getData')
        } else {
          this.isShow = true
          this.$message.error(res.message)
        }
      } else {
        await userEditAPI(this.form)
        this.$message.success('编辑成功')
        this.isShow = false
        this.$emit('getData')
      }
    },
    closeEvent() {
      this.$refs.form.resetFields()
      this.form = {
        username: '',
        email: '',
        phone: '',
        role_id: '',
        status: '',
        remark: '',
      }
    },
  },
}
</script>

<style></style>
