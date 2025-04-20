<template>
    <div class="func-container">
        <div class="title">
            <div class="title-left">
                <el-button type="primary" @click="handleAdd">添加模块</el-button>
                <el-button @click="handleAdd">物模型TSL</el-button>
                <el-button @click="handleAdd">历史版本</el-button>
                <el-button type="primary" @click="handleAdd">编辑草稿</el-button>
            </div>
            <div class="right-btn">
                <el-button type="primary" @click="handleAdd">发布上线</el-button>
            </div>
        </div>
        <!-- 功能定义 -->
        <div class="content-wrapper">
            <!-- 左侧菜单栏 -->
            <sidebar-menu :menu-list="menuList" :default-active="menuList.length > 0 ? menuList[0].id : ''"
                @menu-select="handleMenuSelect" @menu-edit="handleMenuEdit" @menu-delete="handleMenuDelete" />

            <!-- 右侧内容区域 -->
            <content-table />

        </div>
        <!-- 添加模块对话框 -->
        <global-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400px" :confirm-loading="loading"
            @confirm="handleSubmit" @cancel="dialogVisible = false">
            <global-form ref="moduleForm" :model="moduleForm" :rules="mooduleRules" :form-items="moduleFormItems"
                :show-footer="false" label-width="100px" />
        </global-dialog>
    </div>
</template>

<script>
import SidebarMenu from './components/SidebarMenu.vue'
import ContentTable from './components/ContentTable.vue'

export default {
    name: 'FunctionDefinition',
    components: {
        SidebarMenu,
        ContentTable
    },
    data() {
        return {
            loading: false,
            activeMenu: '',
            menuList: [
                { identifier: '', name: '默认模块', desc: '' },
                { identifier: 'driver_mcu', name: '驱动电机控制单元_MCU', desc: '' },
                { identifier: 'dianc_bms', name: '电池管理系统_BMS', desc: '' },
                { identifier: 'car_bcu', name: '车身控制单元_BCU', desc: '' },
                { identifier: 'cds_obc', name: '车载充电器_OBC', desc: '' },
            ],
            tableData: [],
            moduleFormItems: [
                {
                    label: '模块名称',
                    prop: 'name',
                    type: 'input',
                    required: true,
                    showWordLimit: true,
                    maxlength: 30,
                },
                {
                    label: '模块标识符',
                    prop: 'identifier',
                    type: 'input',
                    required: true,
                    showWordLimit: true,
                    maxlength: 30,
                },
                {
                    label: '模块描述',
                    prop: 'desc',
                    type: 'textarea',
                    showWordLimit: true,
                    maxlength: 4096,
                }
            ],
            dialogVisible: false,
            dialogTitle: '',
            moduleForm: {
                name: '',
                identifier: '',
                dataType: '',
                accessMode: 'r',
                description: ''
            },
            mooduleRules: {
                name: [
                    { required: true, message: '请输入模块名称', trigger: 'blur' },
                    {
                        pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-@()]{4,30}$/,
                        message: '模块名称支持中文、英文字母、数字和特殊字符_-@()，长度4~30个字符',
                        trigger: ['blur', 'change']
                    }
                ],
                identifier: [
                    { required: true, message: '请输入标识符', trigger: 'blur' },
                    {
                        pattern: /^[a-zA-Z0-9_]{1,30}$/,
                        message: '标识符仅支持英文大小写字母、数字和下划线',
                        trigger: ['blur', 'change']
                    }
                ],
            },
            advancedDialogVisible: false,
            advancedForm: {
                dataSpec: '',
                unit: '',
                step: 1,
                range: ''
            },
            advancedRules: {
                dataSpec: [{ required: false, message: '请输入数据规格', trigger: 'blur' }],
                unit: [{ required: false, message: '请输入数据单位', trigger: 'blur' }],
                step: [{ required: false, message: '请输入步长', trigger: 'blur' }],
                range: [{ required: false, message: '请输入取值范围', trigger: 'blur' }]
            },
            dataTypeOptions: [
                { label: '整数型', value: 'int' },
                { label: '浮点型', value: 'float' },
                { label: '布尔型', value: 'bool' },
                { label: '文本型', value: 'text' },
                { label: '日期型', value: 'date' }
            ]
        }
    },
    created() {
        this.getFunctionList()
    },
    methods: {
        // 获取功能列表
        async getFunctionList() {
            this.loading = true
            try {
                // TODO: 调用API获取功能列表
                this.tableData = [
                    {
                        name: '温度',
                        identifier: 'temperature',
                        dataType: 'float',
                        accessMode: 'r',
                        description: '设备温度数据'
                    },
                    {
                        name: '湿度',
                        identifier: 'humidity',
                        dataType: 'float',
                        accessMode: 'r',
                        description: '设备湿度数据'
                    }
                ]
            } catch (error) {
                console.error('获取功能列表失败:', error)
                this.$message.error('获取功能列表失败')
            } finally {
                this.loading = false
            }
        },
        // 菜单选择
        handleMenuSelect(index) {
            this.activeMenu = index
            this.getFunctionList()
        },
        // 编辑菜单
        handleMenuEdit(item) {
            //this.$message.info(`编辑菜单: ${item.name}`)
            this.dialogTitle = '编辑模块'
            this.dialogVisible = true
            this.moduleForm = {
                name: item.name,
                identifier: item.identifier,
                desc: item.desc
            }
            this.$nextTick(() => {
                this.$refs.moduleForm && this.$refs.moduleForm.resetFields()
            })

        },
        // 删除菜单
        handleMenuDelete(item) {
            this.$confirm(`确认是否删除模块：${item.name}?`, '删除模块', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message.success('删除成功')
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        },
        // 添加功能
        handleAdd() {
            this.dialogTitle = '添加模块'
            this.dialogVisible = true
            this.moduleForm = {
                name: '',
                identifier: '',
                desc: ''
            }
            this.$nextTick(() => {
                this.$refs.moduleForm && this.$refs.moduleForm.resetFields()
            })
        },
        // 编辑功能
        handleEdit(row) {
            this.dialogTitle = '编辑功能'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.form = { ...row }
            })
        },
        // 删除功能
        handleDelete(row) {
            this.$confirm('确认删除该功能?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // TODO: 实现删除功能的逻辑
                this.$message.success('删除成功')
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        },

        // 提交表单
        handleSubmit() {
            this.$refs.moduleForm.validate(async (valid) => {
                if (valid) {
                    try {
                        // TODO: 调用API保存数据
                        this.$message.success('保存成功')
                        this.dialogVisible = false
                        this.getFunctionList()
                    } catch (error) {
                        this.$message.error('保存失败')
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.func-container {
    height: 100%;

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .title-left {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .content-wrapper {
        display: flex;
        height: calc(80vh - 100px);
        background-color: #fff;
        border-radius: 4px;
    }
}

.advanced-dialog {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    height: 100% !important;
    position: fixed !important;
    z-index: 3000 !important;
}
</style>
