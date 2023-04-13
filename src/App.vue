<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Likes from './utils/likes'
// import DevicePixelRatio from '@/utils/DevicePixelRatio'

export default {
  name: 'App',

  data() {
    return {
      likes: null,
    }
  },

  computed: {
    ...mapState('settings', ['switch']),
  },

  watch: {
    switch() {
      this.switchEvent()
    },
  },
  mounted() {
    this.likes = new Likes()
    this.switchEvent()
  },
  created() {
    // new DevicePixelRatio().init()
  },
  methods: {
    switchEvent() {
      this.switch ? this.likes.create() : this.likes.destroy()
    },
  },
}
</script>
<style scoped>
#app {
  position: relative;
  overflow: hidden;
}
</style>
