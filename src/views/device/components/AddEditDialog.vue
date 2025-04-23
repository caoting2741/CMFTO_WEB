<template>
    <global-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px"
        custom-class="device-dialog" @confirm="dialogStatus === 'create' ? createData() : updateData()">
        <global-form ref="dataForm" :model="temp" :rules="rules" :form-items="formItems" :show-footer="false"
            label-width="140px">
            <template #form-item-loc="item">
                <div class="loc-container">
                    <el-input v-model="temp.coordinate" :disabled="true" placeholder="coordinate"
                        class="coordinate-input"></el-input>
                    <el-input v-model="temp.locDesc" placeholder="" class="loc-desc-input"></el-input>
                    <el-button type="primary" plain size="mini" @click="handleViewLocation">重置</el-button>
                </div>
            </template>
            <template #form-item-devTags="item">
                <div class="dev-tags-container">
                    <div class="tags-list">
                        <div v-for="(tag, index) in devTags" :key="index" class="tag-item">
                            <div class="tag-input-container">
                                <el-input v-model="tag.key" placeholder="请输入标签key" class="tag-key"
                                    @input="() => handleTagInput(tag, index)"></el-input>
                                <div v-if="devTagErrors[index]?.key" class="tag-error">{{ devTagErrors[index].key }}
                                </div>
                            </div>
                            <div class="tag-input-container">
                                <el-input v-model="tag.value" placeholder="请输入标签value" class="tag-value"
                                    @input="() => handleTagInput(tag, index)"></el-input>
                                <div v-if="devTagErrors[index]?.value" class="tag-error">{{ devTagErrors[index].value }}
                                </div>
                            </div>
                            <el-button type="danger" plain size="mini" @click="removeDevTag(index)">删除</el-button>
                        </div>
                    </div>
                    <div class="add-tag">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addDevTag">新增标签</el-button>
                    </div>
                </div>
            </template>
        </global-form>
    </global-dialog>
</template>

<script>
export default {
    name: 'AddEditDialog',
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false
        },
        dialogStatus: {
            type: String,
            default: 'create'
        },
        temp: {
            type: Object,
            default: () => ({})
        },
        productOptions: {
            type: Array,
            default: () => []
        }
    },
    data() {

        return {
            textMap: {
                update: '编辑设备',
                create: '创建设备'
            },
            devTags: [
                { key: '', value: '' }
            ],
            devTagErrors: [],
            rules: {
                name: [{ required: true, message: '设备名称必填', trigger: 'blur' }],
                productId: [{ required: true, message: '所属产品必选', trigger: 'change' }],
                sn: [{ required: true, message: '设备编号必填', trigger: 'blur' }]
            }
        }
    },
    computed: {
        formItems() {
            return [
                {
                    label: '所属产品',
                    prop: 'product_key',
                    type: 'select',
                    options: this.productOptions
                },
                {
                    label: 'deviceName',
                    prop: 'name',
                    type: 'input',
                    showWordLimit: true,
                    maxlength: 32,
                },
                {
                    label: 'deviceSecret',
                    prop: 'sn',
                    type: 'input',
                },
                {
                    label: '备注名称',
                    prop: 'desc',
                    type: 'input',
                    showWordLimit: true,
                    maxlength: 64,
                },
                {
                    label: '地理位置标签',
                    prop: 'loc',
                    type: 'slot'
                },
                {
                    label: '设备标签',
                    prop: 'devTags',
                    type: 'slot'
                }
            ]
        }
    },
    methods: {
        handleViewLocation() {
            this.$emit('view-location')
        },
        validateTagKey(key, tags, currentIndex) {     
            if (!key) {
                return '标签key不能为空'
            }
            if (key.length > 30) {
                return '标签key不能超过30个字符'
            }
            // 验证key的字符
            const keyPattern = /^[a-zA-Z0-9#@%&*\-_/]+$/
            if (!keyPattern.test(key)) {
                return '标签key只支持英文字母、数字和特殊字符#@%&*-_/'
            }
            // 验证key不重复
            const isDuplicate = tags.some((tag, index) =>
                index !== currentIndex && tag.key === key
            )
            if (isDuplicate) {
                return '标签key不可重复定义'
            }
            return ''
        },

        // 添加标签value的验证规则
        validateTagValue(value) {
            if (!value) {
                return '标签value不能为空'
            }
            if (value.length > 128) {
                return '标签value不能超过128个字符'
            }
            // 验证value的字符
            const valuePattern = /^[a-zA-Z0-9\u4e00-\u9fa5_\-.,#@%/&:]+$/
            if (!valuePattern.test(value)) {
                return '标签value只支持中文、英文字母、数字和特殊字符_-.#@%/&:'
            }
            return ''
        },
        handleTagInput(tag, index) {
            const keyError = this.validateTagKey(tag.key, this.devTags, index)
            const valueError = this.validateTagValue(tag.value)
            this.$set(this.devTagErrors, index, {
                key: keyError,
                value: valueError
            })

            return !keyError && !valueError
        },

        // 验证所有标签
        validateAllDevTags() {
            return this.devTags.every((tag, index) => this.validateDevTag(tag, index))
        },
        addDevTag() {
            this.devTags.push({ key: '', value: '' })
        },
        removeDevTag(index) {
            this.devTags.splice(index, 1)
        },
        validateDevTag(tag, index) {
            const errors = {}
            if (!tag.key) {
                errors.key = '标签key不能为空'
            }
            if (!tag.value) {
                errors.value = '标签value不能为空'
            }
            this.$set(this.devTagErrors, index, errors)
        },
        createData() {
            this.$refs.dataForm.validate((valid) => {
                if (valid && this.validateAllDevTags()) {
                    this.$emit('create')
                }
            })
        },
        updateData() {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    this.$emit('update')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.loc-container {
    display: flex;
    gap: 8px;
    align-items: center;

    .coordinate-input {
        width: 180px;
    }

    .loc-desc-input {
        flex: 1;
    }
}

.dev-tags-container {
    .tags-list {
        .tag-item {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            align-items: flex-start;

            .tag-input-container {
                flex: 1;

                .tag-error {
                    color: #F56C6C;
                    font-size: 12px;
                    margin-top: 4px;
                    line-height: 1;
                }
            }
        }
    }

    .add-tag {
        margin-top: 8px;
    }
}
</style>
