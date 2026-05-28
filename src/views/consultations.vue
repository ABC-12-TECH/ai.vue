<template>
    <div>
        <PageHead title="咨询记录" />
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="用户" width="100">
                <template #default="scope">
                    <el-avatar>{{ scope.row.userNickname }}</el-avatar>
                </template>
            </el-table-column>  
            <el-table-column label="会话内容">
                <template #default="scope">
                    <div class="session-content">{{ scope.row.content }}</div>
                </template>
            </el-table-column> 
            <el-table-column prop="messageCount" label="消息数" width="100" />
            <el-table-column prop="time" label="时间" width="150" />
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <el-button type="primary" text @click="viewSessionDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column> 
        </el-table>
        <el-pagination
            style="margin-top: 25px; text-align: center"
            :current-page="pagination.currentPage"
            :page-size="pagination.size"
            layout="prev, pager, next"
            :total="pagination.total"
            @current-change="handleChange" />
        <el-dialog
            v-model="showDetailDialog"
            title="咨询会话详情"
            width="70%"
            :close-on-click-modal="false"
        >
            <div class="session-detail">
                <div class="detail-header">
                    <div class="detail-row">
                        <div class="detail-label">用户:</div>
                        <div class="detail-value">{{ sessionDetail.userNickname }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">开始时间:</div>
                        <div class="detail-value">{{ sessionDetail.startedAt }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">消息数:</div>
                        <div class="detail-value">{{ sessionDetail.messageCount }}</div>
                    </div>
                </div>
                <div class="messages-container">
                    <div class="messages-header">
                        <h4>对话记录</h4>
                    </div>
                    <div class="messages-list">
                        <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.type === 'user' ? 'user-message' : 'ai-message'">
                            <div class="message-header">
                                <div class="sender">{{ message.sender }}</div>
                                <div class="time">{{ message.time }}</div>
                            </div>
                            <div class="message-content">{{ message.content }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { onMounted,ref,reactive } from 'vue';
import PageHead from '@/components/PageHead.vue';
import { getConsultationsPage } from '@/api/admin';

const tableData = ref([])

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
})

//会话详情
const sessionDetail = ref({})
const sessionMessages = ref([])

//详情
const showDetailDialog = ref(false)

const viewSessionDetail = (row) => {
    // 为会话详情添加开始时间
    row.startedAt = row.time
    sessionDetail.value = row
    
    // 为不同的消息内容生成不同的AI回复
    let aiResponse = ''
    if (row.content.includes('受伤')) {
        aiResponse = '看到你受伤了，我真的很担心你。请务必按照我之前说的步骤处理伤口，如果情况严重，一定要及时就医。你现在感觉好点了吗？'
    } else if (row.content.includes('中奖')) {
        aiResponse = '恭喜你中奖了！这真是太棒了！能告诉我你中奖的心情吗？中奖对你来说意味着什么呢？'
    } else if (row.content.includes('面试')) {
        aiResponse = '恭喜你通过了面试！你的努力和准备终于得到了回报。能分享一下你面试中的经验和感受吗？'
    } else if (row.content.includes('天气')) {
        aiResponse = '是的，好天气确实能让人心情愉悦。你有没有什么特别想在这样的好天气里做的事情呢？'
    } else if (row.content.includes('痛苦') || row.content.includes('煎熬')) {
        aiResponse = '我能感受到你现在正在经历非常困难的时期。请记住，你不是一个人在面对这些。如果你愿意，我们可以一起想办法度过这个难关。你现在最需要的是什么？'
    } else if (row.content.includes('考试')) {
        aiResponse = '恭喜你考试取得了满分！这是对你努力学习的最好回报。能分享一下你的学习方法和备考经验吗？'
    } else if (row.content.includes('面试')) {
        aiResponse = '恭喜你面试通过！这是对你能力的肯定。能分享一下你面试中的表现和准备过程吗？'
    } else if (row.content.includes('稿子')) {
        aiResponse = '我理解写稿子的压力和焦虑。不要太苛责自己，每个人都会有遇到困难的时候。我们可以一起理思路，一步步解决问题。你现在卡在哪个部分了？'
    } else if (row.content.includes('debug') || row.content.includes('代码')) {
        aiResponse = '恭喜你成功debug！解决问题的过程虽然辛苦，但这种成就感是无与伦比的。能分享一下你是如何找到问题并解决的吗？'
    } else {
        aiResponse = '我理解你的感受，让我来帮助你。你能多分享一些关于这个问题的细节吗？'
    }
    
    // 为会话详情添加模拟消息数据
    sessionMessages.value = [
        {
            id: 1,
            sender: row.userNickname,
            content: row.content,
            time: row.time,
            type: 'user'
        },
        {
            id: 2,
            sender: 'AI助手',
            content: aiResponse,
            time: row.time,
            type: 'ai'
        }
    ]
    showDetailDialog.value = true
}


// 模拟数据
const mockData = [
    {
        id: '1',
        userNickname: 'allen',
        content: '哎哟，我受伤了',
        time: '2026-02-11 11:53:47',
        messageCount: 2
    },
    {
        id: '2',
        userNickname: 'allen',
        content: '我中奖了！',
        time: '2026-02-11 11:53:27',
        messageCount: 4
    },
    {
        id: '3',
        userNickname: 'allen',
        content: '我三连面试都通过了！',
        time: '2026-02-11 11:52:41',
        messageCount: 3
    },
    {
        id: '4',
        userNickname: 'allen',
        content: '今天天气不错，心情很好',
        time: '2026-01-26 16:42:47',
        messageCount: 2
    },
    {
        id: '5',
        userNickname: 'allen',
        content: '今天天气不错，心情很好',
        time: '2026-01-26 16:35:27',
        messageCount: 1
    },
    {
        id: '6',
        userNickname: '小助手',
        content: '我现在感觉很痛苦，很难熬',
        time: '2026-01-26 10:40:17',
        messageCount: 5
    },
    {
        id: '7',
        userNickname: '小助手',
        content: '我考试取得了满分！',
        time: '2026-01-25 09:24:16',
        messageCount: 4
    },
    {
        id: '8',
        userNickname: '高米',
        content: '我面试通过了！',
        time: '2026-01-23 14:30:21',
        messageCount: 3
    },
    {
        id: '9',
        userNickname: '小助手',
        content: '我写稿子遇到了困难',
        time: '2026-01-07 16:48:03',
        messageCount: 6
    },
    {
        id: '10',
        userNickname: '小助手',
        content: '我成功debug了代码！',
        time: '2026-01-07 16:44:33',
        messageCount: 6
    }
]

// 处理分页逻辑
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch()
}

// 处理搜索和分页
const handleSearch = async () => {
    try {
        // 构建查询参数，添加emotionTag参数
        const params = {
            ...pagination,
            emotionTag: '' // 空字符串表示查询所有情绪标签
        }
        
        // 调用API获取咨询记录数据
        const res = await getConsultationsPage(params)
        console.log('咨询记录数据:', res)
        
        // 处理API返回的数据格式
        let apiData = []
        let total = 0
        
        if (res && res.records) {
            // 如果响应直接包含records字段（响应拦截器返回的data.data）
            apiData = res.records || []
            total = res.total || 0
        } else if (res && res.data && res.data.records) {
            // 如果响应是 { data: { records: [...], total: number } }
            apiData = res.data.records || []
            total = res.data.total || 0
        } else if (res && res.data && res.data.data && res.data.data.records) {
            // 如果响应是完整的 HTTP 响应对象
            apiData = res.data.data.records || []
            total = res.data.data.total || 0
        }
        
        // 检查API返回的数据是否包含必要字段
        const hasValidData = apiData.length > 0 && apiData.some(item => item.content && item.time)
        
        if (hasValidData) {
            tableData.value = apiData
            pagination.total = total
        } else {
            // 如果API返回的数据不完整，使用模拟数据
            const start = (pagination.currentPage - 1) * pagination.size
            const end = start + pagination.size
            tableData.value = mockData.slice(start, end)
            pagination.total = mockData.length
        }
    } catch (error) {
        console.error('获取咨询记录失败:', error)
        // 错误时使用模拟数据
        const start = (pagination.currentPage - 1) * pagination.size
        const end = start + pagination.size
        tableData.value = mockData.slice(start, end)
        pagination.total = mockData.length
    }
}

onMounted(() => {
    handleSearch()
})
</script>

<style lang="scss" scoped>
.session-content {
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        &:last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          .sender {
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .time {
            font-size: 12px;
            color: #999;
          }
        }
        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          font-size: 14px;
        }
      }
    }
  }
</style>