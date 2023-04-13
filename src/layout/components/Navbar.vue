<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

      <breadcrumb class="breadcrumb-container" />
    </div>
    <div class="flex-none gap-2">
      <div class="form-control">
        <el-input type="text" placeholder="搜索" class="input input-bordered" />
      </div>
      <div class="tooltip tooltip-bottom" data-tip="提醒">
        <div class="dropdown dropdown-bottom dropdown-end">
          <label tabindex="0">
            <button class="btn btn-ghost btn-circle">
              <div class="indicator">
                <svg-icon icon-class="alarm" />
                <span class="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </label>
          <div tabindex="0" class="dropdown-content menu p-5 shadow bg-base-100 rounded-box w-52">
            <div class="flex justify-between">
              <div class="card-title">提醒</div>
              <button class="btn btn-ghost btn-circle">
                <div class="tooltip tooltip-bottom" data-tip="设置"></div>
              </button>
            </div>
            <li><a>123</a></li>
            <li><a>123</a></li>
          </div>
        </div>
      </div>

      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn bg-transparent border-none hover:bg-transparent">
          <div class="avatar">
            <div class="w-12 h-12 rounded-full">
              <img :src="baseUrl + userInfo.avatar" />
            </div>
          </div>
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a @click="logout">退出</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      baseUrl: import.meta.env.VITE_APP_BASE_API,
    }
  },
  computed: {
    // store MAP映射数据
    ...mapGetters(['sidebar', 'userInfo']),
  },
  methods: {
    // tab栏切换
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
}
</style>
