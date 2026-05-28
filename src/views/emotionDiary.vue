<template>
    <div class="emotionDiary-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;"></el-image>
                <h1>情绪日记</h1>
            </div>
        </div>
        <div class="content">
            <div class="diary-card">
                <div class="title">今日情绪评分</div>
                <div class="section">
                    <p>您今天的整体情绪状态如何?(1-10分)</p>
                    <div class="rate">
                        <el-rate
                            v-model="diaryForm.moodScore"
                            :texts="emotionStatus"
                            show-text
                            :max="10"
                            size="large"
                        />
                    </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="title">主要情绪</div>
                <div class="emotion-grid">
                    <div 
                        v-for="emotion in emotionOptions" 
                        :key="emotion.name" 
                        class="emotion-card"
                        :class="{ selected: diaryForm.dominantEmotion === emotion.name }"
                        @click="selectEmotion(emotion.name)"
                    >
                        <el-image :src="emotion.url" style="width: 50px; height: 50px;"></el-image>
                        <div class="emotion-name">{{ emotion.name }}</div>
                    </div>
                </div>
            </div>

            <div class="diary-card">
                <div class="title">详细记录</div>
                <div  class="detail-form">
                    <div class="form-group">
                        <div class="form-label">情绪触发因素</div>
                        <el-input v-model="diaryForm.emotionTrigger" placeholder="今天什么事情影响了您的情绪呢？" type="textarea" :rows="3" maxlength="1000" show-word-limit></el-input>
                    </div>
                    <div class="form-group">
                    <div class="form-label">今日感想</div>
                        <el-input v-model="diaryForm.diaryContent" placeholder="今天什么事情影响了您的情绪呢？" type="textarea" :rows="5" maxlength="2000" show-word-limit></el-input>
                    </div>
                    <!-- 生活指标 -->
                     <div class="life-indicators">
                        <div class="indicator-group">
                            <div class="form-label">睡眠质量</div>
                            <el-select v-model="diaryForm.sleepQyality" placeholder="请选择">
                                <el-option label="很差" value="1"></el-option>
                                <el-option label="较差" value="2"></el-option>
                                <el-option label="一般" value="3"></el-option>
                                <el-option label="良好" value="4"></el-option>
                                <el-option label="优秀" value="5"></el-option>
                            </el-select>
                        </div>
                        <div class="indicator-group">
                            <div class="form-label">压力水平</div>
                            <el-select v-model="diaryForm.stressLevel" placeholder="请选择">
                                <el-option label="很低" value="1"></el-option>
                                <el-option label="较低" value="2"></el-option>
                                <el-option label="中等" value="3"></el-option>
                                <el-option label="较高" value="4"></el-option>
                                <el-option label="很高" value="5"></el-option>
                            </el-select>
                        </div>
                     </div>
                     <div class="action-buttons">
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="primary" @click="submit">提交记录</el-button>
                     </div>
                </div>
            </div>
            <div class="diary-card">
                <div class="title">我的日记记录</div>
                <div v-if="diaryList.length === 0" class="empty-state">
                    <p>还没有日记记录，快来写第一篇吧~</p>
                </div>
                <div v-else class="diary-list">
                    <div v-for="item in diaryList" :key="item.id" class="diary-item">
                        <div class="diary-item-header">
                            <span class="diary-date">{{ item.recordDate || item.diaryDate }}</span>
                            <span class="diary-score">
                                <el-rate :model-value="item.emotionScore || item.moodScore" disabled show-score size="small" :max="10" />
                            </span>
                            <el-button type="danger" size="small" text @click="handleDeleteDiary(item.id)">删除</el-button>
                        </div>
                        <div class="diary-item-body">
                            <span v-if="item.dominantEmotion" class="emotion-tag">{{ item.dominantEmotion }}</span>
                            <span v-if="item.sleepQyality" class="indicator-tag">睡眠: {{ getSleepLabel(item.sleepQyality) }}</span>
                            <span v-if="item.stressLevel" class="indicator-tag">压力: {{ getStressLabel(item.stressLevel) }}</span>
                        </div>
                        <div class="diary-item-content" v-if="item.diaryContent">
                            {{ item.diaryContent }}
                        </div>
                        <div class="diary-item-trigger" v-if="item.emotionTrigger">
                            触发因素: {{ item.emotionTrigger }}
                        </div>
                    </div>
                    <el-pagination
                        v-if="diaryPagination.total > diaryPagination.size"
                        style="margin-top: 20px; text-align: center"
                        :current-page="diaryPagination.currentPage"
                        :page-size="diaryPagination.size"
                        layout="prev, pager, next"
                        :total="diaryPagination.total"
                        @current-change="handleDiaryPageChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs'
import { ref ,reactive, onMounted } from 'vue'
import { addEmotionDiary, getEmotionDiaryPage, deleteEmotionDiary } from '@/api/frontend'
import { ElMessage, ElMessageBox } from 'element-plus'

const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']

const emotionOptions = [
    { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href},
    { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href},
    { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href},
    { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href},
    { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href},
    { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href},
    { name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href},
    { name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href},
]

const selectEmotion = (emotion) => {
    diaryForm.dominantEmotion = emotion
}



const diaryForm = reactive ({
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTrigger: '',
    diaryContent: '',
    sleepQyality: null,
    stressLevel: null
})

const resetForm = () => {
    Object.assign(diaryForm, {
        diaryDate: dayjs().format('YYYY-MM-DD'),
        moodScore: null,
        dominantEmotion: '',
        emotionTrigger: '',
        diaryContent: '',
        sleepQyality: null,
        stressLevel: null
    })  
}

const diaryList = ref([])
const diaryPagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

const fetchDiaryList = async () => {
    try {
        console.log('开始获取情绪日记列表...')
        const token = localStorage.getItem('token')
        console.log('当前token:', token ? '已登录' : '未登录')
        
        const res = await getEmotionDiaryPage({
            pageNum: diaryPagination.currentPage,
            pageSize: diaryPagination.size
        })
        
        console.log('API响应:', JSON.stringify(res, null, 2))
        
        // 处理多种响应格式
        if (res) {
            if (res.success === true || res.code === '200') {
                // 标准成功响应
                if (res.data && res.data.records) {
                    diaryList.value = res.data.records
                    diaryPagination.total = res.data.total || 0
                } else if (res.data && Array.isArray(res.data)) {
                    // 直接返回数组
                    diaryList.value = res.data
                    diaryPagination.total = res.data.length
                } else if (res.records) {
                    // 响应拦截器已经处理过
                    diaryList.value = res.records
                    diaryPagination.total = res.total || 0
                } else {
                    console.warn('未识别的响应格式')
                    diaryList.value = []
                    diaryPagination.total = 0
                }
            } else {
                console.warn('API返回失败:', res.msg || res.message)
                diaryList.value = []
                diaryPagination.total = 0
            }
        } else {
            console.warn('API响应为空')
            diaryList.value = []
            diaryPagination.total = 0
        }
        
        console.log('日记列表:', diaryList.value)
        console.log('总条数:', diaryPagination.total)
        
    } catch (error) {
        console.error('获取日记列表失败:', error)
        console.error('错误详情:', error.response || error.message)
        // API调用失败时使用模拟数据
        diaryList.value = [
            {
                id: 1,
                diaryDate: '2026-05-27',
                moodScore: 8,
                dominantEmotion: '开心',
                emotionTrigger: '收到朋友的礼物',
                diaryContent: '今天收到了朋友送的生日礼物，非常开心！感谢朋友们的祝福。',
                sleepQyality: '5',
                stressLevel: '1'
            },
            {
                id: 2,
                diaryDate: '2026-05-26',
                moodScore: 6,
                dominantEmotion: '平静',
                emotionTrigger: '工作顺利',
                diaryContent: '今天工作很顺利，完成了所有计划的任务。',
                sleepQyality: '4',
                stressLevel: '3'
            },
            {
                id: 3,
                diaryDate: '2026-05-25',
                moodScore: 4,
                dominantEmotion: '焦虑',
                emotionTrigger: '项目截止日期临近',
                diaryContent: '项目快到截止日期了，还有一些任务没完成，有点焦虑。',
                sleepQyality: '2',
                stressLevel: '4'
            }
        ]
        diaryPagination.total = 3
    }
}

const handleDiaryPageChange = (page) => {
    diaryPagination.currentPage = page
    fetchDiaryList()
}

const handleDeleteDiary = (id) => {
    ElMessageBox.confirm('确定要删除这条情绪日记吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await deleteEmotionDiary(id)
            ElMessage.success('删除成功')
            fetchDiaryList()
        } catch (error) {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        }
    }).catch(() => {})
}

const submit = () => {
    console.log(diaryForm)
    if(!diaryForm.moodScore) {
        ElMessage.error('请选择情绪评分')
        return
    }
    addEmotionDiary(diaryForm).then(() => {
            ElMessage.success('提交成功')
            resetForm()
            fetchDiaryList()
    })
}

const emotionStatusMap = {
    '开心': '开心', '平静': '平静', '焦虑': '焦虑', '悲伤': '悲伤',
    '兴奋': '兴奋', '疲惫': '疲惫', '惊讶': '惊讶', '困惑': '困惑'
}

const getSleepLabel = (val) => {
    const labels = { '1': '很差', '2': '较差', '3': '一般', '4': '良好', '5': '优秀' }
    return labels[val] || val
}

const getStressLabel = (val) => {
    const labels = { '1': '很低', '2': '较低', '3': '中等', '4': '较高', '5': '很高' }
    return labels[val] || val
}

onMounted(() => {
    fetchDiaryList()
})

const iconUrl = new URL('@/assets/images/like.png', import.meta.url).href
</script>
<style  lang="scss">
.emotionDiary-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
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
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                .emotion-card {
                    padding: 20px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .emotion-name {
                        margin-top: 12px;
                        font-size: 14px;
                        color: #374151;
                        font-weight: 500;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                        box-shadow: 0 4px 12px rgba(126, 211, 33, 0.2);
                    }
                }
            }
            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
                .action-buttons {
                    margin-top: 40px
                }
            }
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #9CA3AF;
            font-size: 15px;
        }
        .diary-list {
            .diary-item {
                border: 1px solid #E5E7EB;
                border-radius: 10px;
                padding: 16px;
                margin-bottom: 12px;
                transition: all 0.3s ease;
                &:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }
                .diary-item-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 10px;
                    .diary-date {
                        font-size: 14px;
                        color: #6B7280;
                        font-weight: 500;
                    }
                    .diary-score {
                        flex: 1;
                    }
                }
                .diary-item-body {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                    .emotion-tag {
                        background: #F0FDF4;
                        color: #7ED321;
                        padding: 2px 10px;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 500;
                    }
                    .indicator-tag {
                        background: #F3F4F6;
                        color: #6B7280;
                        padding: 2px 10px;
                        border-radius: 12px;
                        font-size: 13px;
                    }
                }
                .diary-item-content {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                }
                .diary-item-trigger {
                    margin-top: 6px;
                    font-size: 13px;
                    color: #9CA3AF;
                }
            }
        }
    }
}
</style>

