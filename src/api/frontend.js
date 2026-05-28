import service from '@/utils/request'

export const register = (data) => {
    return service.post('/user/add', data)
}

export const startSession = (data) => {
    const token = localStorage.getItem('token')
    return service.post('/psychological-chat/session/start', data, {
        headers: { token }
    })
}

export const getSessionList = (pageNum = 1, pageSize = 10) => {
    const token = localStorage.getItem('token')
    return service.get('/psychological-chat/sessions', {
        headers: { token },
        params: { pageNum, pageSize }
    })
}

export const deleteSession = (sessionId) => {
    const token = localStorage.getItem('token')
    return service.delete(`/psychological-chat/sessions/${sessionId}`, {
        headers: { token }
    })
}

export const getSessionDetail = (sessionId) => {
    const token = localStorage.getItem('token')
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`, {
        headers: { token },
        params: { userId: userInfo.userId }
    })
}

export const sendMessage = async (sessionId, userMessage, onChunk) => {
    const token = localStorage.getItem('token')
    if (!token) {
        throw new Error('未登录，请先登录')
    }
    try {
        console.log('发送消息请求:', { sessionId, userMessage, token })
        const response = await fetch('/api/psychological-chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ sessionId, userMessage })
        })

        console.log('响应状态:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('服务器错误:', errorText)
            throw new Error(`服务器错误: ${response.status}`)
        }

        if (!response.body) {
            throw new Error('服务器响应为空')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let result = ''
        
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            console.log('原始数据块:', chunk)
            
            const lines = chunk.split('\n')
            for (const line of lines) {
                let data = ''
                if (line.includes('data:')) {
                    const idx = line.indexOf('data:')
                    data = line.slice(idx + 5)
                } else if (line.startsWith('{')) {
                    data = line
                }
                
                if (data && data !== '[DONE]' && data.trim()) {
                    try {
                        const json = JSON.parse(data)
                        if (json && json.data && json.data.content) {
                            console.log('收到内容:', json.data.content)
                            result += json.data.content
                            if (onChunk) onChunk(json.data.content)
                        }
                    } catch (e) {
                        // Not JSON, skip
                    }
                }
            }
        }
        console.log('完整回复:', result)
        
        return result
    } catch (error) {
        console.error('发送消息失败:', error)
        throw error
    }
}


export const getSessionEmotion = (sessionId) => {
    return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

export const addEmotionDiary = (data) => {
    return service.post(`/emotion-diary`, data)
}

export const getEmotionDiaryPage = (params) => {
    const token = localStorage.getItem('token')
    return service.get('/emotion-diary/page', {
        params,
        headers: { token }
    })
}

export const deleteEmotionDiary = (id) => {
    const token = localStorage.getItem('token')
    return service.delete(`/emotion-diary/${id}`, {
        headers: { token }
    })
}

export const getKnowledgeList = (params) => {
    const token = localStorage.getItem('token')
    return service.get(`/knowledge/article/page`, { 
        params,
        headers: { token }
    })
}

export const getKnowledgeDetail = (articleId) => {
    const token = localStorage.getItem('token')
    return service.get(`/knowledge/article/${articleId}`, {
        headers: { token }
    }).then(res => {
        return res || {}
    })
}


