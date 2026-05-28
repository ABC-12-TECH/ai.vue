<template>
    <div class="articleDetail-container">
        <div class="header-section">
            <div class="header-content">
                <h1>知识文章详情</h1>
            </div>
        </div>
        <div class="content">
            <!-- 文章信息卡片 -->
            <div class="diary-card">
                <p class="title">文章信息</p>
                <div class="sub-title">
                    <span>{{ articleDetail.categoryName }}</span>
                    <span>{{ dayjs(articleDetail.updatedAt).format('YYYY-MM-DD') }}</span>
                </div>
                <h1 class="article-title">{{ articleDetail.title }}</h1>
                <div class="summary-content" v-if="articleDetail.summary">
                    <p>{{ articleDetail.summary }}</p>
                </div>
                <div class="author-info">
                    <span class="author">{{ articleDetail.authorName || '系统管理员' }}</span>
                    <span class="read-count">{{ articleDetail.readCount || 0 }}次阅读</span>
                </div>
            </div>
            
            <!-- 正文内容卡片 -->
            <div class="diary-card">
                <p class="title">正文内容</p>
                <div class="content-wrapper" v-html="formatContent(articleDetail.content)"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeDetail } from '@/api/frontend'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const route = useRoute()
const articleDetail = ref({})

const formatContent = (content) => {
    if (!content) return ''
    // 移除所有背景色样式和文字颜色样式
    return content
        .replace(/background-color[^;]*;/gi, '')
        .replace(/bgcolor=[^\s>]+/gi, '')
        .replace(/color[^;]*;/gi, '')
        .replace(/color=[^\s>]+/gi, '')
}

onMounted(() => {
    const articleId = route.params.id
    console.log('文章ID:', articleId)
    if (articleId) {
        getKnowledgeDetail(articleId).then(res => {
            console.log('API返回:', res)
            if (res) {
                // 处理不同的数据结构
                if (res.data) {
                    articleDetail.value = res.data
                } else {
                    articleDetail.value = res
                }
                console.log('文章详情数据:', articleDetail.value)
            }
        }).catch(err => {
            console.error('获取文章详情失败:', err)
            ElMessage.error('获取文章详情失败')
        })
    }
})
</script>

<style scoped>
.articleDetail-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    min-height: 100vh;
}

.header-section {
    background: linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%);
    color: white;
    padding: 48px;
    .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
}

.content {
    margin: 0 auto;
    width: 980px;
    padding: 20px;
    .diary-card {
        margin-bottom: 20px;
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        .title {
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
        }
        .sub-title {
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .article-title {
            font-size: 22px;
            font-weight: 600;
            color: #111827;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .summary-content {
            background: rgba(126, 211, 33, 0.1);
            border-left: 4px solid #7ED321;
            padding: 10px 15px;
            border-radius: 0 8px 8px 0;
            position: relative;
            margin-bottom: 15px;
            font-size: 14px;
            line-height: 1.5;
        }
        .author-info {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: #6B7280;
            margin-top: 15px;
        }
        .content-wrapper {
            font-size: 15px;
            color: #374151;
            line-height: 1.6;
            opacity: 1;
            p {
                margin-bottom: 12px;
            }
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                margin: 18px 0 10px;
                color: #111827;
                font-weight: 600;
            }
            h2 {
                font-size: 16px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 6px;
            }
            h3 {
                font-size: 15px;
            }
            ul,
            ol {
                padding-left: 18px;
                margin-bottom: 12px;
            }
            li {
                margin-bottom: 6px;
            }
        }
    }
}
</style>