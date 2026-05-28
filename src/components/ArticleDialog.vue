<template>
    <el-dialog
        :title="isEdit ? '编辑文章' : '新增文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
    >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="category">
                <el-select v-model="form.category" placeholder="请选择分类" clearable>
                    <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
                <el-input type="textarea" v-model="form.summary" placeholder="请输入文章摘要（可选）" maxlength="1000" show-word-limit :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-select v-model="form.tagsArray" placeholder="请选择文章标签" multiple  filterable allow-create style="width: 100%;">
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
                </el-select>    
            </el-form-item>
            <el-row :gutter="20" align="middle">
                <el-col :span="4">
                    <el-form-item label="封面图片" />
                </el-col>
                <el-col :span="16">
                    <div class="cover-uploader"></div>
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :before-upload="beforeUpload"
                        :http-request="handleUploadRequest"
                        :show-file-list="false"
                        accept="image/*"
                    >
                        <div v-if="!imgUrl" class="cover-placeholder">
                            <p>点击上传封面</p>
                        </div>
                        <img v-else :src="imgUrl" alt="封面图片" class="cover-image">
                    </el-upload>
                    <div v-if="imgUrl" class="cover-remove">
                        <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
                    </div>
                </el-col>
            </el-row>
            <div style="margin-top: 20px;"></div>
            <el-form-item label="文章内容" prop="content">
                <RichTextEditor 
                v-model="form.content"
                placeholder="请输入文章内容" 
                :maxCharCount="5000"
                @change="handleContentChange"
                @create="handleEditorCreate"
                minHeight="400px"
                />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h3>内容预览</h3>
            <div v-html="form.content"></div>
        </div>
        <template #footer>
            <el-button  @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
            <el-button  @click="handleClose">取消</el-button>
            <el-button  type="primary" @click="handleSubmit"  :loading="loading">{{isEdit ? '更新文章' : '创建文章'}}</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref,reactive,computed,nextTick,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile,createArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: null
    }
})

const btnPreview = ref(false)

const emit = defineEmits(['update:modelValue','success','create'])

const dialogVisible = computed({
    get () {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})




// 判断是否为编辑模式
const isEdit = computed(() => {
    return props.article && props.article.id
})

const handleClose = () => {
    formRef.value.resetFields()
    businessId.value = null
    handleRemove()
    dialogVisible.value = false
}

const form = reactive({
    "title": '',
    "content": '',
    "coverImage": '1',
    "category": '',
    "summary": '',
    "tags": '',
    "tagsArray": [],
    "id": ''
})

const imgUrl = ref('')

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    category: [
        { required: true, message: '请选择分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
    ],
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const beforeUpload = (file)  =>{
    console.log(file)
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isImage) {
        ElMessage.error('请上传图片文件')  
        return false
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB')
        return false
    }
return true
}

const businessId = ref(null)
const handleUploadRequest =async ({ file }) =>{
    // 模拟上传成功
    console.log('上传文件:', file)
    imgUrl.value = URL.createObjectURL(file)
    form.coverImage = 'mock-file-path'
    ElMessage.success('上传成功')
}

const handleRemove = () => {
    imgUrl.value = ''
    form.coverImage = ''
}

const handleContentChange = (data) => {
    console.log(data,'富文本内容')
    form.content = data.html


}

const editorInstance = ref(null)
const handleEditorCreate = (editor) => {
    editorInstance.value = editor

    if (form.content && editor) {
        nextTick(() => {
            editor.setHtml(form.content)
        })
    }
    
}

// 监听 article 属性变化，更新表单数据
watch(() => props.article, (newArticle) => {
    if (newArticle) {
        form.id = newArticle.id || ''
        form.title = newArticle.title || ''
        form.content = newArticle.content || ''
        form.coverImage = newArticle.coverImage || ''
        form.category = newArticle.categoryId || ''
        form.summary = newArticle.summary || ''
        form.tags = newArticle.tags || ''
        form.tagsArray = newArticle.tags ? newArticle.tags.split(',') : []
        
        // 更新封面图片
        if (newArticle.coverImage) {
            imgUrl.value = newArticle.coverImage
        } else {
            imgUrl.value = ''
        }
        
        // 延迟更新富文本编辑器内容
        nextTick(() => {
            if (editorInstance.value && form.content) {
                editorInstance.value.setHtml(form.content)
            }
        })
    } else {
        // 重置表单
        form.id = ''
        form.title = ''
        form.content = ''
        form.coverImage = ''
        form.category = ''
        form.summary = ''
        form.tags = ''
        form.tagsArray = []
        imgUrl.value = ''
    }
}, { immediate: true })

const formRef = ref()
const loading = ref(false)
const handleSubmit =  () => {
    formRef.value.validate( (valid,fields) => {
        if(valid) {
            loading.value = true
            console.log(form,'FormData')
            const submiData = {
                ...form,
                tags: form.tagsArray.join(',')
            }
            delete submiData.tagsArray

            // 模拟创建文章成功
            setTimeout(() => {
                loading.value = false
                ElMessage.success('创建成功')
                // 生成一个新的文章对象
                const newArticle = {
                    id: Date.now(), // 使用时间戳作为临时ID
                    title: form.title,
                    categoryId: form.category,
                    author: '系统管理员',
                    readCount: 0,
                    publishTime: new Date().toLocaleString(),
                    status: 0 // 默认状态为草稿
                }
                emit('create', newArticle)
                emit('success')
                dialogVisible.value = false
            }, 1000)
        }

    })
   

}

</script>

<style lang="scss" scoped>
.cover-placeholder {
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8b949e;
    background: #f6f8fa;
}

.avatar-uploader {
    width: 200px;
    height: 120px;
    overflow: hidden;
}

.cover-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}
</style>
