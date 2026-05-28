<template>
    <div class="knowledge-container">
         <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;"></el-image>
                <h1>知识库</h1>
            </div>
        </div>
        <div class="content">
            <div class="recommend-section">
                <div class="section-title">推荐阅读</div>
                <div class="recommend-list">
                    <div v-for="item in recommendList" :key="item.id" class="recommend-item" @click="goToArticle(item.id)">
                        <h4>{{item.title}}</h4>
                        <p class="read-count">
                            <el-icon><Histogram/></el-icon>
                            阅读量{{item.readCount}}
                        </p>
                    </div>
                </div>
            </div>

            <div class="article-list">
                <div v-for="item in articleList" :key="item.id" class="article-item" @click="goToArticle(item.id)">
                    <div class="article-image">
                        <el-image 
                            style="width: 240px; height: 150px; object-fit: cover; border-radius: 8px;" 
                            :src="getImage(item.coverImage)"
                        ></el-image>
                    </div>
                    <div class="article-info">
                        <div class="title-row">
                            <h3 class="article-title">{{ item.title }}</h3>
                            <el-tag size="small" effect="plain" type="primary" v-if="item.categoryName">{{ item.categoryName }}</el-tag>
                        </div>
                        <div class="meta-row">
                            <span class="author">
                                <el-icon><Avatar /></el-icon>
                                {{ item.author || '系统管理员' }}
                            </span>
                            <span class="date">
                                <el-icon><List /></el-icon>
                                {{ item.createTime || dayjs(item.updatedAt).format('YYYY-MM-DD') }}
                            </span>
                            <span class="view-count">
                                <el-icon><Platform /></el-icon>
                                观看人数: {{ item.readCount || 0 }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="pagination-wrapper">
                <el-pagination
            style="margin-top: 25px; text-align: center"
            :page-size="pagination.size"
            layout="prev, pager, next"
            :total="pagination.total"
            @change="handleChange" />
            </div>
    </div>
</template>
<script setup>
import {dayjs, ElMessage } from 'element-plus'
import {ref, reactive ,onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { getKnowledgeList } from '@/api/frontend'


const router = useRouter()

import iconUrl from '@/assets/images/book.png'
import { Avatar, Platform, List } from '@element-plus/icons-vue'

const knowledgeList = ref([])
const recommendList = ref([])

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

const articleList = ref([])
const getPageList = () => {
    const params = {
        sortField: 'readCount',
        sortDirection: 'desc',
        ...pagination
    }
    getKnowledgeList(params).then(res => {
        console.log('获取知识库列表:', res)
        if (res && (res.records || res.data?.records)) {
            articleList.value = res.records || res.data.records
            pagination.total = res.total || res.data.total
        } else {
            ElMessage.warning('暂无文章数据')
            articleList.value = []
            pagination.total = 0
        }
    }).catch(err => {
        console.error('获取知识库列表失败:', err)
        ElMessage.error('获取文章失败')
        articleList.value = []
        pagination.total = 0
    })
}

const getImage = (url) => {
    return url ? 'http://159.75.169.224:1235' + url : 'https://file.itndedu.com/psychology_ai.png'
}

const handleChange = (page) => {
    pagination.currentPage = page
    getPageList()
}

const goToArticle = (id) => {
    router.push(`/user/knowledge/article/${id}`)
}



onMounted(() => {
    const params = {
        sortField: 'readCount',
        sortDirection: 'desc',
        currentPage: '1',
        size: '5'
    }
    getPageList()
    getKnowledgeList(params).then(res => {
        console.log('获取推荐列表:', res)
        if (!res) {
            ElMessage.warning('暂无推荐文章')
            return
        }
        if (res.records && res.records.length > 0) {
            recommendList.value = res.records
        } else if (res.data && res.data.records && res.data.records.length > 0) {
            recommendList.value = res.data.records
        } else {
            ElMessage.warning('暂无推荐文章')
        }
    }).catch(err => {
        console.error('获取知识文章失败:', err)
        ElMessage.error('获取文章失败')
    })
})
</script>
<style lang="scss">
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
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
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 16px;
                display: flex;
                gap: 16px;
                transition: all 0.3s ease;
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                }
                .article-image {
                    flex-shrink: 0;
                }
                .article-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .title-row {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        .article-title {
                            font-size: 16px;
                            font-weight: 600;
                            color: #374151;
                            margin: 0;
                            flex: 1;
                            margin-right: 12px;
                            line-height: 1.4;
                        }
                    }
                    .meta-row {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        font-size: 14px;
                        color: #6B7280;
                        .author {
                            display: flex;
                            align-items: center;
                        }
                        .date {
                            display: flex;
                            align-items: center;
                        }
                        .view-count {
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        }
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>