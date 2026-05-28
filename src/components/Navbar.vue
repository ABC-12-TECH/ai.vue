<template>
  <div class="navbar">
    <div class="flex-box">
        <el-button @click="handleCollapse">
            <el-icon><Expand /></el-icon>
        </el-button>
        <p class="page-title">{{ currentPageTitle }}</p>
    </div>
    <div class="flex-box">
        <el-dropdown @command="handleCommand">
            <div class="flex-box">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <p class="user-name">admin</p>
                <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useRouter, useRoute } from 'vue-router'
import { Expand, ArrowDown } from '@element-plus/icons-vue'

const store = useAdminStore()
const router = useRouter()
const route = useRoute()

// 计算当前页面标题
const currentPageTitle = computed(() => {
    const matchedRoute = route.matched[route.matched.length - 1]
    return matchedRoute?.meta?.title || '导航栏'
})

const handleCommand = (command) => {
    console.log(command)
    if (command === 'logout') {
        // 清除本地存储的token
        localStorage.removeItem('token')
        // 跳转到登录页面
        router.push('/auth/login')
    }
}

const handleCollapse = () => {
    console.log('handleCollapse called')
    console.log('Before toggle:', store.isCollapse)
    store.toggleCollapse()
    console.log('After toggle:', store.isCollapse)
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: white;
    box-shadow: 0 1px 4px rgba(0,21, 0, 0.08);
    border-bottom: 1px solid #e5e7eb;
    .flex-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .page-title {
        margin-left: 20px;
        font-size: 26px;
        font-weight: bold;
       
    }
}
</style>
