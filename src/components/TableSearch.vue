<template>
    <el-form ref="ruleFormRef" :model="formData" class="table-search-form">
        <el-row :gutter="20">
            <template v-for="item in formItem" :key="item.prop">
                <el-col :span="8">
                    <el-form-item :label="item.label" :prop="item.prop" class="form-item">
                        <el-input v-if="item.comp === 'input'" v-model="formData[item.prop]" :placeholder="item.placeholder"></el-input>
                        <el-select v-else-if="item.comp === 'select'" v-model="formData[item.prop]" :placeholder="item.placeholder" class="select-input">
                            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-row>
    </el-form>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    formItem: {
        type: Array,
        default: () => []
    }
})


const emit = defineEmits(['search'])

const formData = ref({})

// 初始化表单数据
for (const item of props.formItem) {
    formData.value[item.prop] = ''
}

// 监听表单数据变化，触发搜索事件
watch(formData, () => {
    emit('search', formData.value)
}, { deep: true })

const handleSearch = () => {
    emit('search', formData.value)
}

const handleReset = () => {
    for (const item of props.formItem) {
        formData.value[item.prop] = ''
    }
    emit('search', formData.value)
}

</script>

<style scoped>
.table-search-form {
    margin-bottom: 20px;
}

.form-item {
    margin-bottom: 0;
}

.select-input {
    width: 100%;
}

/* 调整下拉框的样式 */
:deep(.el-select) {
    width: 100%;
}

:deep(.el-select .el-input__inner) {
    border-radius: 4px;
}

:deep(.el-select-dropdown) {
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-select-dropdown__item) {
    padding: 10px 15px;
    cursor: pointer;
}

:deep(.el-select-dropdown__item:hover) {
    background-color: #f5f7fa;
}

:deep(.el-select-dropdown__item.selected) {
    color: #4A9C8C;
    font-weight: 500;
}
</style>