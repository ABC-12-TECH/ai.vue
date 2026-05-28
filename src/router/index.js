import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'



const backendRouters = [
    {
        path: '/back',
        component: BackendLayout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: {
                    title: '数据分析',
                    icon: 'PieChart',
                }
            },
            {
                path: 'knowledge',
                component: () => import('@/views/knowledge.vue'),
                meta: {
                    title: '知识文章',
                    icon: 'ChatLineSquare',
                }
            },
            {
                path: 'consultations',
                component: () => import('@/views/consultations.vue'),
                meta: {
                    title: '咨询管理',
                    icon: 'Message',
                }
            },
            {
                path: 'emotional',
                component: () => import('@/views/emotional.vue'),
                meta: {
                    title: '情绪日记',
                    icon: 'User',
                }
            },
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                component: () => import('@/views/login.vue'),
                meta: {
                    title: '登录',

                }
            },
            {
                path: 'register',
                component: () => import('@/views/register.vue'),
                meta: {
                    title: '注册',

                }
            }
        ]
    }
]



// 前端路由
const frontendRouters = [
    {
        path: '/',
        component: FrontendLayout,
        children: [
            {
                path: '',
                component: () => import('@/views/home.vue'),
            },
            {
                path: 'consultation',
                component: () => import('@/views/consultation.vue'),
            },
            {
                path: 'emotion-diary',
                component: () => import('@/views/emotionDiary.vue'),
            },
            {
                path: 'knowledge',
                component: () => import('@/views/knowledge.vue'),
            },
            {
                path: 'knowledge/article/:id',
                component: () => import('@/views/articleDetail.vue'),
                props: true,
            }
        ]
    }
]

// 用户端路由
const userRouters = [
    {
        path: '/user',
        component: FrontendLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/user/home'
            },
            {
                path: 'home',
                component: () => import('@/views/home.vue'),
                meta: {
                    title: '用户首页',
                    requiresAuth: true
                }
            },
            {
                path: 'consultation',
                component: () => import('@/views/consultation.vue'),
                meta: {
                    title: 'AI咨询',
                    requiresAuth: true
                }
            },
            {
                path: 'emotion-diary',
                component: () => import('@/views/emotionDiary.vue'),
                meta: {
                    title: '情绪日记',
                    requiresAuth: true
                }
            },
            {
                path: 'knowledge',
                component: () => import('@/views/frontendknowledge.vue'),
                meta: {
                    title: '知识库',
                    requiresAuth: true
                }
            },
            {
                path: 'knowledge/article/:id',
                component: () => import('@/views/articleDetail.vue'),
                props: true,
                meta: {
                    title: '文章详情',
                    requiresAuth: true
                }
            }
        ]
    }
]

const router  = createRouter({
    history: createWebHistory(),
    routes: [
        ...frontendRouters,
        ...backendRouters,
        ...userRouters
    ]
})











// 路由守卫
router.beforeEach((to, from, next) => {
    // 检查是否登录
    const token = localStorage.getItem('token')

    // 如果是访问需要登录的页面
    if (to.path.startsWith('/back/') || to.path.startsWith('/user/')) {
        // 如果已登录，继续访问
        if (token) {
            next()
        } else {
            // 未登录，跳转到登录页
            next('/auth/login')
        }
    }
    // 其他页面（如首页、登录、注册），直接访问
    else {
        next()
    }
})

export default router
