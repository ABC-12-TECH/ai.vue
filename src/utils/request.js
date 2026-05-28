import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers['Token'] = token
            config.headers['token'] = token
        }
        console.log('请求token:', token)
        console.log('请求URL:', config.url)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

//响应拦截器
request.interceptors.response.use(
    response => {
        const {  data,config } = response
        console.log('响应数据:', data)
        console.log('请求URL:', config.url)
        const code = data.code
        if(code === 200 || code === '200' || data.success === true){
            return data
        } else if(code === -1 || code === '-1'){
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            const msg = data.msg || data.message || '登录过期，请重新登录'
            if(!config.url?.includes('/login')) {
                ElMessage.error(msg)
                router.push('/auth/login').catch(() => {})
            } else {
                ElMessage.error(msg)
            }
            return Promise.reject(new Error(msg))
        } else if(code === 500 || code === '500') {
            console.log('后端500错误:', data)
            return data
        } else {
            return data
        }
    },
    error => {
        console.error('响应错误:', error)
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            ElMessage.error('无法连接到后端服务，请检查网络')
        } else if (error.response) {
            ElMessage.error('服务器错误: ' + (error.response.status || '未知'))
        } else {
            ElMessage.error('网络请求失败')
        }
        return Promise.reject(error)
    }
)

export default request
