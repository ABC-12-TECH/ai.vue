import request from '@/utils/request'

// 登录接口
export function login(data) {
    return request.post('/user/login', data)
}

// 注册接口
export function userRegister(data) {
    return request.post('/user/add', data)
}

// 获取分类
export function categoryTree() {
    return request.get('/knowledge/category/tree')
}

// 知识文章列表
export function articlePage(params) {
    return request.get('/knowledge/article/page', { params })
}

// 文件上传
export function uploadFile(file, businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessFiled', 'cover')

    return request.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 文章新增
export function createArticle(data) {
    return request.post('/knowledge/article', data)
}

// 获取知识文章详情
export function getArticleDetail(id) {
    return request.get(`/knowledge/article/${id}`)
}

// 更新知识文章
export function updateArticle(id, data) {
    return request.put(`/knowledge/article/${id}`, data)
}

// 更新文章状态
export function changeArticleStatus(id, data) {
    return request.put(`/knowledge/article/${id}/status`, data)
}

// 删除知识文章
export function deleteArticle(id) {
    return request.delete(`/knowledge/article/${id}`)
}

// 分页查询咨询会话
export function getConsultationsPage(params) {
    return request.get('/psychological-chat/sessions', { params })
}

// 获取会话消息列表
export function getSessionDetail(sessionId) {
    return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 创建新的会话
export function createChatSession(data) {
    return request.post('/psychological-chat/session/start', data)
}

// 获取用户的会话列表
export function getUserChatSessions(params) {
    return request.get('/psychological-chat/sessions', { params })
}

// 流式对话接口
export function streamChat(data) {
    return request.post('/psychological-chat/stream', data, {
        headers: {
            'Accept': 'text/event-stream'
        },
        responseType: 'stream'
    })
}

// 获取会话情绪分析结果
export function getSessionEmotion(sessionId) {
    return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 删除咨询会话
export function deleteChatSession(sessionId) {
    return request.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 情绪日记相关API
export function getEmotionDiaryPage(params) {
    return request.get('/emotion-diary/page', { params })
}

export function getEmotionDiaryDetail(id) {
    return request.get(`/emotion-diary/${id}`)
}

export function deleteEmotionDiary(id) {
    return request.delete(`/emotion-diary/${id}`)
}

// 数据分析相关API
export function getDashboardStats() {
    return request.get('/dashboard/stats')
}

export function getEmotionTrend(params) {
    return request.get('/dashboard/emotion-trend', { params })
}

export function getConsultationStats(params) {
    return request.get('/dashboard/consultation-stats', { params })
}

export function getUserActivityTrend(params) {
    return request.get('/dashboard/activity-trend', { params })
}
