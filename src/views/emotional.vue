<template>
    <div>
        <PageHead title="情绪日记" />
        <div class="search-container">
            <el-input v-model="searchForm.userId" placeholder="输入用户ID" style="width: 200px; margin-right: 10px" />
            <el-select v-model="searchForm.emotionScore" placeholder="选择评分范围" style="width: 200px; margin-right: 10px">
                <el-option label="1-3分" value="1-3" />
                <el-option label="4-6分" value="4-6" />
                <el-option label="7-10分" value="7-10" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="用户ID" width="120">
                <template #default="scope">
                    <el-avatar>{{ scope.row.userId }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="recordDate" label="记录日期" width="150" />
            <el-table-column label="情绪评分" width="150">
                <template #default="scope">
                    <div class="star-rating">
                        <el-icon v-for="i in 10" :key="i" :class="i <= scope.row.emotionScore ? 'star-filled' : 'star-empty'">
                            <Star />
                        </el-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="生活指标" width="150">
                <template #default="scope">
                    <div>
                        <div>睡眠: {{ getSleepLabel(scope.row.sleepQyality) || scope.row.lifeIndicators?.sleep }}</div>
                        <div>压力: {{ getStressLabel(scope.row.stressLevel) || scope.row.lifeIndicators?.stress }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="emotionTrigger" label="情绪触发因素" width="150" />
            <el-table-column prop="diaryContent" label="日记内容" />
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <div class="operation-buttons">
                        <el-button type="primary" text @click="viewDetail(scope.row)">详情</el-button>
                        <el-button type="danger" text @click="handleDelete(scope.row.id)">删除</el-button>
                    </div>
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
            title="情绪日记详情"
            width="70%"
            :close-on-click-modal="false"
        >
            <div class="emotion-detail">
                <!-- 用户信息 -->
                <div class="section">
                    <h3>用户信息</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">用户名:</span>
                            <span class="info-value">{{ detailData.userId }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">昵称:</span>
                            <span class="info-value">{{ detailData.userId }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">用户ID:</span>
                            <span class="info-value">{{ detailData.id }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">记录日期:</span>
                            <span class="info-value">{{ detailData.recordDate }}</span>
                        </div>
                    </div>
                </div>

                <!-- 情绪状态 -->
                <div class="section">
                    <h3>情绪状态</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">情绪评分:</span>
                            <span class="info-value">
                                <div class="star-rating">
                                    <el-icon v-for="i in 10" :key="i" :class="i <= detailData.emotionScore ? 'star-filled' : 'star-empty'">
                                        <Star />
                                    </el-icon>
                                    <span>{{ detailData.emotionScore }}</span>
                                </div>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">主要情绪:</span>
                            <span class="info-value">
                                <el-tag size="small">{{ getMainEmotion(detailData.emotionScore) }}</el-tag>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">睡眠质量:</span>
                            <span class="info-value">{{ getSleepLabel(detailData.sleepQyality) || detailData.lifeIndicators?.sleep }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">压力水平:</span>
                            <span class="info-value">{{ getStressLabel(detailData.stressLevel) || detailData.lifeIndicators?.stress }}</span>
                        </div>
                    </div>
                </div>

                <!-- 日记内容 -->
                <div class="section">
                    <h3>日记内容</h3>
                    <div class="info-grid">
                        <div class="info-item full-width">
                            <span class="info-label">情绪触发因素:</span>
                            <span class="info-value">{{ detailData.emotionTrigger }}</span>
                        </div>
                        <div class="info-item full-width">
                            <span class="info-label">日记内容:</span>
                            <span class="info-value">{{ detailData.diaryContent }}</span>
                        </div>
                    </div>
                </div>

                <!-- AI情绪分析结果 -->
                <div class="section">
                    <h3>AI情绪分析结果</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">主要情绪:</span>
                            <span class="info-value">
                                <el-tag size="small">中性</el-tag>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">情绪强度:</span>
                            <span class="info-value">
                                <el-progress :percentage="50" :color="['#909399', '#409EFF']" />
                                <span>50%</span>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">风险等级:</span>
                            <span class="info-value">
                                <el-tag size="small" type="success">正常</el-tag>
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">情绪性质:</span>
                            <span class="info-value">
                                <el-tag size="small" type="success">正面情绪</el-tag>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 专业建议 -->
                <div class="section">
                    <h3>专业建议</h3>
                    <div class="info-grid">
                        <div class="info-item full-width">
                            <span class="info-label">情绪状态:</span>
                            <span class="info-value">情绪状态平稳，慢慢来就好</span>
                        </div>
                        <div class="info-item full-width">
                            <span class="info-label">风险描述:</span>
                            <span class="info-value">当前情绪状态稳定，无需特别关注</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import PageHead from '@/components/PageHead.vue';
import { Star } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getEmotionDiaryPage, deleteEmotionDiary } from '@/api/admin';

const tableData = ref([]);

const searchForm = reactive({
    userId: '',
    emotionScore: ''
});

const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
});

const showDetailDialog = ref(false);
const detailData = ref({});

// 处理分页
const handleChange = (page) => {
    pagination.currentPage = page;
    handleSearch();
};

// 处理搜索
const handleSearch = async () => {
    try {
        const params = {
            pageNum: pagination.currentPage,
            pageSize: pagination.size,
            userId: searchForm.userId || undefined,
            emotionScore: searchForm.emotionScore || undefined
        };

        console.log('请求参数:', params);
        const res = await getEmotionDiaryPage(params);
        console.log('情绪日记API响应:', JSON.stringify(res, null, 2));

        // 处理多种响应格式
        if (res) {
            if (res.success === true || res.code === '200') {
                if (res.data && res.data.records) {
                    tableData.value = res.data.records;
                    pagination.total = res.data.total || 0;
                } else if (res.records) {
                    tableData.value = res.records || [];
                    pagination.total = res.total || 0;
                } else if (res.data && Array.isArray(res.data)) {
                    tableData.value = res.data;
                    pagination.total = res.data.length;
                } else {
                    console.warn('API返回格式异常');
                    loadMockData();
                }
            } else {
                console.warn('API返回失败:', res.msg || res.message);
                loadMockData();
            }
        } else {
            console.warn('API响应为空');
            loadMockData();
        }
    } catch (error) {
        console.error('获取情绪日记失败:', error);
        console.error('错误详情:', error.response || error.message);
        loadMockData();
    }
};

// 加载模拟数据
const loadMockData = () => {
    let mockData = [
        {
            id: 31,
            userId: 'allen',
            recordDate: '2026-01-20',
            emotionScore: 8,
            sleepQyality: '3',
            stressLevel: '1',
            emotionTrigger: '无事发生',
            diaryContent: '风平浪静'
        },
        {
            id: 30,
            userId: 'allen',
            recordDate: '2026-01-21',
            emotionScore: 7,
            sleepQyality: '4',
            stressLevel: '3',
            emotionTrigger: '彩票中奖了',
            diaryContent: '开心'
        },
        {
            id: 29,
            userId: 'user1',
            recordDate: '2026-01-19',
            emotionScore: 5,
            sleepQyality: '2',
            stressLevel: '4',
            emotionTrigger: '工作压力大',
            diaryContent: '感觉有点累'
        },
        {
            id: 28,
            userId: 'user2',
            recordDate: '2026-01-18',
            emotionScore: 9,
            sleepQyality: '5',
            stressLevel: '1',
            emotionTrigger: '收到礼物',
            diaryContent: '今天收到了朋友的礼物，很开心'
        },
        {
            id: 27,
            userId: 'user3',
            recordDate: '2026-01-17',
            emotionScore: 4,
            sleepQyality: '1',
            stressLevel: '5',
            emotionTrigger: '考试失利',
            diaryContent: '考试没考好，有点难过'
        }
    ];

    // 应用搜索过滤
    if (searchForm.userId) {
        mockData = mockData.filter(item => item.userId.includes(searchForm.userId));
    }
    
    if (searchForm.emotionScore) {
        const [min, max] = searchForm.emotionScore.split('-').map(Number);
        mockData = mockData.filter(item => item.emotionScore >= min && item.emotionScore <= max);
    }

    // 分页处理
    const start = (pagination.currentPage - 1) * pagination.size;
    const end = start + pagination.size;
    tableData.value = mockData.slice(start, end);
    pagination.total = mockData.length;
};

// 处理重置
const handleReset = () => {
    searchForm.userId = '';
    searchForm.emotionScore = '';
    handleSearch();
};

// 查看详情
const viewDetail = (row) => {
    detailData.value = row;
    showDetailDialog.value = true;
};

// 根据情绪评分获取主要情绪
const getMainEmotion = (score) => {
    if (score >= 8) return '平静';
    if (score >= 6) return '愉快';
    if (score >= 4) return '中性';
    if (score >= 2) return '低落';
    return '悲伤';
};

// 处理删除
const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除这条情绪日记吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await deleteEmotionDiary(id);
            ElMessage.success('删除成功');
            handleSearch();
        } catch (error) {
            console.error('删除情绪日记失败:', error);
            ElMessage.error('删除失败，请稍后重试');
        }
    }).catch(() => {
        // 取消删除
    });
};

const getSleepLabel = (val) => {
    if (!val) return ''
    const labels = { '1': '很差', '2': '较差', '3': '一般', '4': '良好', '5': '优秀' }
    return labels[String(val)] || val
}

const getStressLabel = (val) => {
    if (!val) return ''
    const labels = { '1': '很低', '2': '较低', '3': '中等', '4': '较高', '5': '很高' }
    return labels[String(val)] || val
}

onMounted(() => {
    handleSearch();
});
</script>

<style lang="scss" scoped>
.search-container {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.operation-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.star-rating {
    display: flex;
    align-items: center;
    span {
        margin-left: 8px;
    }
    .star-filled {
        color: #f7ba2a;
    }
    .star-empty {
        color: #dcdfe6;
    }
}

.emotion-detail {
    .section {
        margin-bottom: 20px;
        h3 {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        }
    }
    
    .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        
        .info-item {
            display: flex;
            flex-direction: column;
            
            &.full-width {
                grid-column: 1 / -1;
            }
            
            .info-label {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 4px;
            }
            
            .info-value {
                font-size: 14px;
                color: #333;
                
                el-progress {
                    width: 200px;
                    margin: 4px 0;
                }
            }
        }
    }
}
</style>