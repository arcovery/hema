<template>
  <el-upload :class="{ 'avatar-uploader': !action }" :action="baseURL + '/uploads'" name="image" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="httpRequest">
    <slot></slot>
    <div v-if="!action">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </div>
  </el-upload>
</template>
<script>
import { uploadsAPI } from '@/api/login'
import { questionUploadAPI } from '@/api/question'
export default {
  props: {
    action: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: 'image',
    },
  },
  data() {
    return {
      imageUrl: '',
      baseURL: import.meta.env.VITE_APP_BASE_API,
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log('res接口返回值', res)
      this.$emit('input', this.baseURL + '/' + res.data.file_path)
      //   this.imageUrl = this.baseURL + '/' + res.data.file_path
      //   this.imageUrl = URL.createObjectURL(file.raw)  // 使用文件对象转换成blob地址
    },
    // 上传前校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交图片
    async httpRequest(res) {
      // res.file上传文件的文件对象
      const data = new FormData()
      const name = this.action ? 'file' : 'image'
      data.append(name, res.file)
      const apiRes = this.action ? await questionUploadAPI(data) : await uploadsAPI(data)
      const file = this.action ? apiRes.data.url : apiRes.data.file_path
      this.imageUrl = this.baseURL + '/' + file
      this.$emit('input', file)
      this.$emit('validateField')
      console.log('httpRequest', apiRes)
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
