<template>
  <el-upload :class="{ 'avatar-uploader': !hide }" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="httpRequest">
    <slot></slot>
    <div v-if="!hide">
      <i v-if="isShow" class="el-icon-plus avatar-uploader-icon"></i>
    </div>
    <slot name="file"> </slot>
  </el-upload>
</template>
<script>
import { uploadsAPI } from '@/api/login'
import { questionUploadAPI } from '@/api/question'
export default {
  props: {
    hide: {
      type: Boolean,
      default: false,
    },
    name: {
      required: true,
      type: String,
      default: 'image',
    },
    type: {
      required: true,
      type: String,
      default: 'image',
    },
  },
  data() {
    return {
      imageUrl: '',
      baseURL: import.meta.env.VITE_APP_BASE_API,
      file: '',
      isShow: true, //是否显示上传按钮
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // this.$emit('input', this.baseURL + '/' + res.data.file_path)
      //   this.imageUrl = this.baseURL + '/' + res.data.file_path
      //   this.imageUrl = URL.createObjectURL(file.raw)  // 使用文件对象转换成blob地址
    },
    // 上传前校验
    beforeAvatarUpload(file) {
      if (this.type === 'image') {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      } else {
        const isMP4 = file.type === 'video/mp4'
        const isLt100M = file.size / 1024 / 1024 < 100
        if (!isMP4) {
          this.$message.error('只能上传 MP4 格式!')
        }
        if (!isLt100M) {
          this.$message.error('文件大小不能超过 100MB!')
        }
        return isMP4 && isLt100M
      }
    },
    // 提交图片
    async httpRequest(res) {
      // res.file上传文件的文件对象
      const data = new FormData()
      data.append(this.name, res.file)
      const resp = this.name === 'file' ? await questionUploadAPI(data) : await uploadsAPI(data)
      this.file = this.name === 'file' ? resp.data.url : resp.data.file_path
      this.$emit('input', this.file)
      this.$emit('validateField')
      this.isShow = false
    },

    // this.Url = this.baseURL + '/' + this.file
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
