<template>
  <div>
    <div v-for="(item, index) in selectOptions" :key="index">
      <div class="flex items-center my-8">
        <input v-if="title == 1" :checked="singleSelect == item.label" type="radio" name="radio" class="radio radio-primary" @click="checkboxEvent(item)" />
        <input v-else type="checkbox" :checked="multipleSelect.includes(item.label)" class="checkbox checkbox-primary" @click="selectFun(item)" />
        <span class="mx-2">{{ item.label }}</span>
        <el-input v-model="item.text" placeholder="">
          <div v-if="item.image" slot="suffix">
            <el-popover placement="left" width="265" trigger="hover">
              <el-image class="w-60 h-60" :src="baseURL + item.image" :preview-src-list="imageList"> </el-image>
              <el-image slot="reference" class="h-10 w-10 rounded-full mr-1 align-middle mt-1" :src="baseURL + item.image" fit="cover"></el-image>
            </el-popover>
          </div>
        </el-input>
        <Upload ref="upload" v-model="item.image" :name="'file'" :action="true">
          <button class="btn btn-ghost mx-2 btn-xl" @click.prevent="uploadPic">上传图片</button>
        </Upload>
      </div>
    </div>
  </div>
</template>

<script>
import question from '@/api/constant/question.js'
import Upload from '@/components/upload/index.vue'
export default {
  components: {
    Upload,
  },
  props: {
    title: {
      type: Number,
      default: 1,
    },
    selectOptions: {
      type: Array,
      default: Function,
    },
    singleSelect: {
      type: String,
      default: '',
    },
    multipleSelect: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      baseURL: import.meta.env.VITE_APP_BASE_API,
      // List: [
      //   { label: 'A', text: '语义化的HTML有利于机器的阅读，如PDA手持设备、搜索引擎爬虫；但不利于人的阅读', image: '' },
      //   { label: 'B', text: 'Table 属于过时的标签，遇到数据列表时，需尽量使用 div 来模拟表格', image: '' },
      //   { label: 'C', text: '语义化是HTML5带来的新概念，此前版本的HTML无法做到语义化', image: '' },
      //   { label: 'D', text: 'header、article、address都属于语义化明确的标签', image: '' },
      // ],
      checkList: [],
      dialogVisible: false,
      question,
      num: 5,
    }
  },
  computed: {
    // 多选框选中数据
    ChooseList() {
      return this.List.filter((item) => {
        if (this.checkList.includes(item.label)) {
          return item
        }
      })
    },
    imageList() {
      return this.selectOptions.map((item) => {
        return this.baseURL + item.image
      })
    },
  },
  methods: {
    checkboxEvent(item) {
      this.$emit('update:single-select', item.label)
    },
    uploadPic() {
      console.log(this.$refs.upload)
    },
    selectFun(item) {
      if (!this.multipleSelect.includes(item.label)) {
        this.multipleSelect.push(item.label) // 判断已选列表中是否存在该id，不是则追加进去
      } else {
        const index = this.multipleSelect.indexOf(item.label) // 求出当前id的所在位置
        this.multipleSelect.splice(index, 1) // 否则则删除
      }
      // this.$emit('input', this.checkList)
    },
    handlePictureCardPreview(file) {},
    handleDownload(file) {},
    handleRemove(file) {},
  },
}
</script>

<style></style>
