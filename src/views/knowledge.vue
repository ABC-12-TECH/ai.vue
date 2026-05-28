<template>
    <div>
       <PageHead title="知识文章">
        <template #buttons>
            <el-button @click="handleEdit({})" type="primary">新增</el-button>
        </template>
       </PageHead>
       <TableSearch :formItem="formItem" @search="handleSearch"/>
       <el-table :data="Array.isArray(tableData) ? tableData : []" style="width: 100%; margin-top: 25px">
        <el-table-column  label="文章标题" width="200">
        <template #default="scope">
            <div style="display: flex; align-items: center;">
                <el-icon><Timer /></el-icon>
                <span>{{scope.row.title}}</span>
            </div>
        </template>
        </el-table-column>
        <el-table-column  label="分类" width="150">
        <template #default="scope">
            <div style="display: flex; align-items: center;">
                <el-icon><Timer /></el-icon>
                <span>{{categoryMap[scope.row.categoryId]}}</span>
            </div>
        </template>
        </el-table-column>
        <el-table-column  label="作者" width="120">
        <template #default="scope">
            <span>{{scope.row.authorName}}</span>
        </template>
        </el-table-column>
        <el-table-column  label="阅读量" width="80">
        <template #default="scope">
            <span>{{scope.row.readCount}}</span>
        </template>
        </el-table-column>
        <el-table-column  label="发布时间" width="180">
        <template #default="scope">
            <span>{{scope.row.publishedAt}}</span>
        </template>
        </el-table-column>
        <el-table-column  label="操作" width="200">
        <template #default="scope">
            <el-button  @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0" type="text" size="small" style="color: #67C23A;">发布</el-button>
            <el-button @click="handleUnpublish(scope.row)" v-else type="text" size="small" style="color: #E6A23C;">下线</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small" style="color: #F56C6C;">删除</el-button>
        </template>
        </el-table-column>
       </el-table>
       <el-pagination
       style="margin-top: 25px;"
       :page-size="pagination.size"
       layout="prev, pager, next"
       :total="pagination.total"
       @change="handleChange" />
       <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories" @success="handleSuccess" @create="handleCreate"/>
    </div>
</template>
<script setup>
import { onMounted, ref,reactive, computed } from 'vue'

import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree, articlePage, getArticleDetail ,changeArticleStatus,deleteArticle} from '@/api/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus'

const formItem = [
    {comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题'},
    {comp: 'select', prop: 'categoryId', label: '分类', placeholder: '请选择分类'},
    {comp: 'select', prop: 'status', label: '状态', placeholder: '请选择状态', options: [{
        label: '全部',
        value: ''
    }, {
        label: '草稿',
        value: 0
    }, {
        label: '已发布',
        value: 1
    }, {
        label: '已下线',
        value: 2
    }
]},
]

const pagination = ref({
    total: 0,
    size: 10,
     currentPage: 1,
})

const handleChange = (page) => {
    pagination.value.currentPage = page
    handleSearch()
}



// 存储文章数据的变量
const articles = ref([
    {
        id: 1,
        title: '测试233',
        categoryId: 3,
        author: '系统管理员',
        readCount: 0,
        publishTime: '2026-01-20 09:45:37',
        status: 0
    },
    {
        id: 2,
        title: '学生心理压力应对策略',
        categoryId: 4,
        author: '系统管理员',
        readCount: 35,
        publishTime: '2025-09-07 08:30:00',
        status: 1
    },
    {
        id: 3,
        title: '正念练习入门指南1',
        categoryId: 2,
        author: '系统管理员',
        readCount: 42,
        publishTime: '2025-09-06 13:10:00',
        status: 1
    },
    {
        id: 4,
        title: '睡眠质量与心理健康',
        categoryId: 1,
        author: '系统管理员',
        readCount: 27,
        publishTime: '2025-09-05 11:45:00',
        status: 1
    },
    {
        id: 5,
        title: '建立健康的人际关系',
        categoryId: 3,
        author: '系统管理员',
        readCount: 18,
        publishTime: '2025-09-04 16:20:00',
        status: 1
    },
    {
        id: 6,
        title: '职场压力管理指南',
        categoryId: 4,
        author: '系统管理员',
        readCount: 31,
        publishTime: '2025-09-03 09:15:00',
        status: 1
    },
    {
        id: 7,
        title: '情绪调节的五个有效策略',
        categoryId: 2,
        author: '系统管理员',
        readCount: 23,
        publishTime: '2025-09-02 14:30:00',
        status: 1
    },
    {
        id: 8,
        title: '如何识别和管理焦虑情绪',
        categoryId: 1,
        author: '系统管理员',
        readCount: 15,
        publishTime: '2025-09-01 10:00:00',
        status: 1
    }
])

const handleSearch =async (formData) => {
    console.log('查询参数:', formData)

    const params = {
        ...pagination.value,
        ...formData,
    }

    try {
        console.log('开始获取文章数据')
        const res = await articlePage(params)
        console.log('文章数据:', res)
        console.log('文章数据类型:', typeof res)
        console.log('文章数据JSON:', JSON.stringify(res))
        
        // 使用 API 返回的数据
        if (res && res.records) {
            // 如果响应直接包含records字段（响应拦截器返回的data.data）
            tableData.value = res.records || []
            pagination.value.total = res.total || 0
        } else if (res && res.data && res.data.records) {
            // 如果响应是 { data: { records: [...], total: number } }
            tableData.value = res.data.records || []
            pagination.value.total = res.data.total || 0
        } else if (res && res.data && res.data.data && res.data.data.records) {
            // 如果响应是完整的 HTTP 响应对象
            tableData.value = res.data.data.records || []
            pagination.value.total = res.data.data.total || 0
        } else {
            // 如果 API 调用失败，使用存储的文章数据作为备用
            tableData.value = articles.value
            pagination.value.total = articles.value.length
        }
        console.log('表格数据:', tableData.value)
        console.log('表格数据类型:', typeof tableData.value)
        console.log('表格数据是否为数组:', Array.isArray(tableData.value))
    } catch (error) {
        console.error('获取文章数据失败:', error)
        // 错误时使用存储的文章数据
        tableData.value = articles.value
        pagination.value.total = articles.value.length
    }
}

const categoryMap = reactive([])

const categories = ref([])

//新增和编辑
const dialogVisible = ref(false)
const currentArticle = ref(null)
const handleSuccess = () => {
    handleSearch({})
}
const handleEdit = (row) => {
    if (!row.id) {
        currentArticle.value = null
        dialogVisible.value = true
    } else {
        // 检查是否为模拟数据
        if (row.id <= 8) {
            // 使用模拟数据
            const mockArticle = {
                id: row.id,
                title: row.title,
                content: `<p>这是 ${row.title} 的内容</p><p>文章分类：${categoryMap[row.categoryId]}</p>`,
                categoryId: row.categoryId,
                summary: `这是 ${row.title} 的摘要`,
                tags: '测试,标签',
                coverImage: ''
            }
            currentArticle.value = mockArticle
            dialogVisible.value = true
        } else {
            // 使用 API 数据
            getArticleDetail(row.id).then(res => {
                console.log('编辑详情:', res)
                // 处理 API 返回的数据格式
                if (res && res.data) {
                    currentArticle.value = res.data
                } else {
                    currentArticle.value = res
                }
                dialogVisible.value = true
            })
        }
    }
}

//发布
const handlePublish  = (row) => {
    ElMessageBox.confirm(
        `确认发布文章 ${row.title} 吗？`,
        '确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        }
    ).then (() => {
        changeArticleStatus(row.id,{status:1}).then(res => {
                ElMessage.success('发布成功')
                handleSearch()
        })
    })
}

const handleUnpublish  = (row) => {
    ElMessageBox.confirm(
        `确认下线文章 ${row.title} 吗？`,
        '确认',
        {
            confirmButtonText: '确认下线',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then (() => {
        changeArticleStatus(row.id,{status:0}).then(res => {
                ElMessage.success('下线成功')
                handleSearch()
        })
    })

}

const handleDelete  = (row) => {
    ElMessageBox.confirm(
        `确认删除文章 ${row.title} 吗？`,
        '确认',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'danger'
        }
    ).then (() => {
        deleteArticle(row.id).then(res => {
                ElMessage.success('删除成功')
                handleSearch()
        })
    })

}

const handleCreate = (newArticle) => {
    console.log('创建的文章:', newArticle)
    articles.value.unshift(newArticle)
    handleSearch({})
}

const tableData = ref([])
console.log('初始化 tableData:', tableData.value)
console.log('tableData 是否为数组:', Array.isArray(tableData.value))
onMounted(async () => {

    const res = await categoryTree()
    console.log('分类数据:', res)
    // 检查响应结构
    let categoriesData = []
    if (res && Array.isArray(res)) {
        // 如果响应直接是数组（响应拦截器返回的data.data）
        categoriesData = res
    } else if (res && res.data && Array.isArray(res.data)) {
        // 如果响应是 { data: [...] }
        categoriesData = res.data
    } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
        // 如果响应是完整的 HTTP 响应对象
        categoriesData = res.data.data
    }
    
    if (Array.isArray(categoriesData)) {
        categories.value = categoriesData.map(item => {
            categoryMap[item.id] = item.categoryName
            return {
                label: item.categoryName,
                value: item.id,
            }
        })
        formItem[1].options = categories.value
        console.log('分类选项:', formItem[1].options)
    } else {
        console.error('获取分类数据失败:', res)
        // 添加默认分类数据，用于测试
        categoryMap[1] = '心理健康基础'
        categoryMap[2] = '情绪管理'
        categoryMap[3] = '人际关系'
        categoryMap[4] = '压力缓解'
        categories.value = [
            { label: '心理健康基础', value: 1 },
            { label: '情绪管理', value: 2 },
            { label: '人际关系', value: 3 },
            { label: '压力缓解', value: 4 }
        ]
        formItem[1].options = categories.value
    }
    
    // 初始化文章数据
    handleSearch({})
})
</script>