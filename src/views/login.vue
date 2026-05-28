<template>
    <div class="container">
        <div class="back-link">
            <router-link to="/">
                <el-icon><arrow-left /></el-icon>
                返回首页
            </router-link>
        </div>
        <div class="title">
            <h2>登录您的账户</h2>
            <p>请输入您的登录信息</p>
        </div>
        <div class="form-container">
            <el-form
                ref="ruleFormRef"
                :model="formData"
                :rules="rules"
                label-position="top"
            >
                <el-form-item prop="username">
                    <div class="form-label">
                        <span class="required">*</span>用户名或邮箱
                    </div>
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱" />
                </el-form-item>
                <el-form-item prop="password">
                    <div class="form-label">
                        <span class="required">*</span>密码
                    </div>
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password />
                </el-form-item>
                <el-button class="login-btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
            </el-form>
            <div class="footer">
                <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref ,reactive} from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const ruleFormRef = ref()

const formData = reactive({
    username: '',
    password: ''
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})
const submitForm = async (formRef) => {
    if (!formRef) return
        await formRef.validate((valid,fields) => {
            if (valid) {
                console.log('开始登录，formData:', formData)
                login(formData).then(data => {
                    console.log('登录成功，返回数据:', data)
                    console.log('返回数据类型:', typeof data)
                    console.log('返回数据JSON:', JSON.stringify(data))
                    // 检查数据结构
                    if(data && data.token) {
                        console.log('登录成功，token:', data.token)
                        console.log('登录成功，userInfo:', data.userInfo)
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

                        if(data.userInfo && data.userInfo.userType === 2){
                            console.log('用户类型为2，跳转到后台管理页面')
                            router.push('/back/dashboard')
                        }else{
                            console.log('用户类型不是2，跳转到用户端首页')
                            router.push('/user/home')
                        }
                    } else if(data && data.data && data.data.token) {
                        console.log('登录成功，token:', data.data.token)
                        console.log('登录成功，userInfo:', data.data.userInfo)
                        localStorage.setItem('token', data.data.token)
                        localStorage.setItem('userInfo', JSON.stringify(data.data.userInfo))

                        if(data.data.userInfo && data.data.userInfo.userType === 2){
                            console.log('用户类型为2，跳转到后台管理页面')
                            router.push('/back/dashboard')
                        }else{
                            console.log('用户类型不是2，跳转到用户端首页')
                            router.push('/user/home')
                        }
                    } else {
                        console.error('登录失败：缺少token或数据结构不正确')
                        ElMessage.error('登录失败，请检查用户名和密码')
                    }
                }).catch(error => {
                    console.error('登录失败，错误信息:', error)
                    ElMessage.error('登录失败，请检查用户名和密码')
                })
            }
        })
}

</script>
<style scoped lang="scss">
.container {
    width: 400px;
    margin: 0 auto;
    padding: 60px 20px 40px;

    .back-link {
        margin-bottom: 40px;
        a {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #666;
            text-decoration: none;
            font-size: 14px;
            &:hover {
                color: #4A9C8C;
            }
        }
    }

    .title {
        text-align: center;
        margin-bottom: 40px;
        h2 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #000;
        }
        p {
            font-size: 14px;
            color: #666;
        }
    }

    .form-container {
        .form-label {
            font-size: 14px;
            margin-bottom: 8px;
            color: #333;
            .required {
                color: #ff4d4f;
                margin-right: 4px;
            }
        }

        .el-form-item {
            margin-bottom: 24px;
        }

        .login-btn {
            margin-top: 30px;
            width: 100%;
            height: 48px;
            font-size: 16px;
            background-color: #7eb8ff;
            border-color: #7eb8ff;
            border-radius: 4px;
            &:hover {
                background-color: #6aa8f0;
                border-color: #6aa8f0;
            }
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            p {
                font-size: 14px;
                color: #666;
                a {
                    color: #3498db;
                    text-decoration: none;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}

// 覆盖Element Plus输入框的默认样式
:deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    background-color: white !important;
    &:hover {
        box-shadow: none !important;
        border-color: #3498db !important;
        background-color: white !important;
    }
    &.is-focus {
        box-shadow: none !important;
        border-color: #3498db !important;
        background-color: white !important;
    }
}

:deep(.el-input__inner) {
    background-color: white !important;
    &:focus {
        box-shadow: none !important;
        background-color: white !important;
    }
}
</style>

