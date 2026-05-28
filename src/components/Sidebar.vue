<template>
  <el-aside :width="isCollapsed ? '80px' : '264px'">
     <el-menu
        :collapse="isCollapsed"
        :collapse-transition="false"
        default-active="/back/dashboard"
        router
        class="menu-style"
      >
       <div class="brand">
        <el-image style="width: 50px; height: 50px;  margin-right: 10px;" :src="iconUrl" alt="logo"/>
        <div v-if="!isCollapsed" class="info-card">
         <h1 class="brand-title">心理健康AI助手</h1>
         <p class="brand-subtitle">管理后台</p>
        </div>
       </div>
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" @click="handleMenuClick(item.path)">
          <el-icon><component :is="getIconComponent(item.meta.icon)" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
        
      </el-menu>
  </el-aside>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { PieChart, ChatLineSquare, Message, User } from '@element-plus/icons-vue'

const router = useRouter()
const store = useAdminStore()

const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

const isCollapsed = computed(() => {
    return store.isCollapse
})

// 菜单项
const menuItems = [
  {
    path: '/back/dashboard',
    meta: {
      title: '数据分析',
      icon: 'PieChart'
    }
  },
  {
    path: '/back/knowledge',
    meta: {
      title: '知识文章',
      icon: 'ChatLineSquare'
    }
  },
  {
    path: '/back/consultations',
    meta: {
      title: '咨询管理',
      icon: 'Message'
    }
  },
  {
    path: '/back/emotional',
    meta: {
      title: '情绪日记',
      icon: 'User'
    }
  }
]

// 获取图标组件
const getIconComponent = (iconName) => {
  const iconMap = {
    PieChart,
    ChatLineSquare,
    Message,
    User
  }
  return iconMap[iconName] || User
}

// 处理菜单项点击
const handleMenuClick = (path) => {
  console.log('点击了菜单项:', path)
  router.push(path)
  console.log('跳转到:', path)
}
</script>
<style lang="scss" scoped>
.menu-style {
    height: 100%;
}
.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7ed;
    .info-card {
        .brand-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1f2937;
        }
        .brand-subtitle {
            font-size: 14px;
            color: #6b7280;
        }
    }

   
}
</style>

