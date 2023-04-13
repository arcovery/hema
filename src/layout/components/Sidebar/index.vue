<template>
  <div :class="{ 'has-logo': showLogo }" class="sidebar">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="sl_sidebar_sugs flex flex-col items-center card p-2 z-10 text-white">
      <div v-if="userInfo" class="avatar">
        <div class="w-24 h-24 rounded-full">
          <img :src="baseUrl + userInfo.avatar" />
        </div>
      </div>
      <div v-else class="avatar placeholder">
        <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
          <span class="text-3xl">{{ userInfo.name }}</span>
        </div>
      </div>

      <div class="card-title mt-3">{{ userInfo.name }}</div>
      <div class="text-xl text-gray-400">@{{ userInfo.name }}</div>
      <div class="w-full px-4 order-1">
        <div class="flex justify-center">
          <div class="p-3 text-center">
            <span class="text-xl font-bold block uppercase tracking-wide">{{ 0 }}</span>
            <span class="text-sm">关注</span>
          </div>
          <div class="p-3 text-center">
            <span class="text-xl font-bold block uppercase tracking-wide">{{ 0 }}</span
            ><span class="text-sm">获赞</span>
          </div>
          <div class="p-3 text-center">
            <span class="text-xl font-bold block uppercase tracking-wide">{{ 0 }}</span
            ><span class="text-sm">粉丝</span>
          </div>
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.module.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      baseUrl: import.meta.env.VITE_APP_BASE_API,
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    ...mapState('user', ['userInfo']),

    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
}
</script>
<style lang="scss" scoped>
.sidebar {
  background-color: white !important;
}
</style>
