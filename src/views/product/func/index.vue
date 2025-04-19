<template>
    <div class="func-container">
        <div class="title">
            <div class="title-left">
                <el-button @click="handleAdd">物模型TSL</el-button>
                <el-button @click="handleAdd">历史版本</el-button>
            </div>
            <div class="right-btn">
                <el-button type="primary" @click="handleAdd">发布上线</el-button>
            </div>
        </div>
        <!-- 功能定义 -->
        <div class="content-wrapper">
            <!-- 左侧菜单栏 -->
            <div class="sidebar">
                <el-menu :default-active="activeMenu" class="func-menu" @select="handleMenuSelect">
                    <el-menu-item v-for="item in menuList" :key="item.id" :index="item.id">
                        <span>{{ item.name }}</span>
                        <div class="menu-operations">
                            <el-tooltip content="编辑" placement="top">
                                <i class="el-icon-edit" style="color:#067288" @click.stop="handleMenuEdit(item)"></i>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <i class="el-icon-delete" style="color:#ED3636"
                                    @click.stop="handleMenuDelete(item)"></i>
                            </el-tooltip>
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>

            <!-- 右侧内容区域 -->
            <div class="main-content">
                <div class="filter-container" style="margin-bottom: 20px;">
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加功能</el-button>
                </div>
                <table-page :table-data="tableData" :columns="columns" :loading="loading" :show-selection="false"
                    :show-index="false" :show-operation="true" :row-key="'identifier'" :show-footer="false"
                    :showPagination="false">
                    <!-- 数据类型列 -->
                    <template #dataType="{ row }">
                        <el-tag size="small">{{ row.dataType }}</el-tag>
                    </template>
                    <!-- 读写类型列 -->
                    <template #accessMode="{ row }">
                        <el-tag size="small" :type="row.accessMode === 'rw' ? 'success' : 'info'">
                            {{ row.accessMode === 'rw' ? '读写' : '只读' }}
                        </el-tag>
                    </template>
                    <!-- 操作列 -->
                    <template #operation="{ row }">
                        <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
                    </template>
                </table-page>
            </div>

            <!-- 功能表单对话框 -->
            <global-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :confirm-loading="loading"
                @confirm="handleSubmit" @cancel="dialogVisible = false">
                <global-form ref="form" :model="form" :rules="rules" :form-items="[
                    {
                        label: '功能名称',
                        prop: 'name',
                        type: 'input',
                        placeholder: '请输入功能名称',
                        required: true
                    },
                    {
                        label: '标识符',
                        prop: 'identifier',
                        type: 'input',
                        placeholder: '请输入标识符',
                        required: true
                    },
                    {
                        label: '数据类型',
                        prop: 'dataType',
                        type: 'select',
                        placeholder: '请选择数据类型',
                        options: dataTypeOptions,
                        required: true
                    },
                    {
                        label: '读写类型',
                        prop: 'accessMode',
                        type: 'radio',
                        options: [
                            { label: '只读', value: 'r' },
                            { label: '读写', value: 'rw' }
                        ]
                    },
                    {
                        label: '输入参数',
                        type: 'input-button',
                        btnText: '添加参数'
                    },
                    {
                        label: '描述',
                        prop: 'description',
                        type: 'textarea',
                        rows: 3,
                        placeholder: '请输入描述信息'
                    }
                ]" :show-footer="false" label-width="100px" @button-click="handleParamButtonClick" />
                <el-button type="primary" @click="openAdvancedConfig">高级配置</el-button>


                <!-- 高级配置弹框 -->
                <global-dialog title="高级配置" :visible.sync="advancedDialogVisible" width="500px" append-to-body
                    custom-class="advanced-dialog" @confirm="handleAdvancedSubmit" top="20vh">
                    <global-form ref="advancedForm" :model="advancedForm" :rules="advancedRules" :form-items="[
                        {
                            label: '数据规格',
                            prop: 'dataSpec',
                            type: 'input',
                            placeholder: '请输入数据规格'
                        },
                        {
                            label: '数据单位',
                            prop: 'unit',
                            type: 'input',
                            placeholder: '请输入数据单位'
                        },
                        {
                            label: '步长',
                            prop: 'step',
                            type: 'input-number',
                            placeholder: '请输入步长'
                        },
                        {
                            label: '取值范围',
                            prop: 'range',
                            type: 'input',
                            placeholder: '请输入取值范围，如：0-100'
                        }
                    ]" :show-footer="false" label-width="100px" />
                </global-dialog>

            </global-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FunctionDefinition',
    data() {
        return {
            loading: false,
            activeMenu: '',
            menuList: [
                { id: '1', name: '默认模块' },
                { id: '2', name: '驱动电机控制单元_MCU' },
                { id: '3', name: '电池管理系统_BMS' },
                { id: '4', name: '车身控制单元_BCU' },
                { id: '5', name: '车载充电器_OBC' },
                { id: '6', name: '车载空调控制单元_ACU' },
                { id: '7', name: '车载娱乐系统_IVS' },
                { id: '8', name: '车载导航系统_GPS' },
                { id: '9', name: '车载通信系统_TCU' },
                { id: '10', name: '车载娱乐系统_IVS' },
                { id: '11', name: '车载导航系统_GPS' },
                { id: '12', name: '车载通信系统_TCU' },
                { id: '13', name: '车载娱乐系统_IVS' },
                { id: '14', name: '车载导航系统_GPS' },
                { id: '15', name: '车载通信系统_TCU' },
                { id: '16', name: '车载娱乐系统_IVS' },
                { id: '17', name: '车载导航系统_GPS' },
                { id: '18', name: '车载通信系统_TCU' },
                { id: '19', name: '车载娱乐系统_IVS' },
                { id: '20', name: '车载导航系统_GPS' },
                { id: '21', name: '车载通信系统_TCU' },
                { id: '22', name: '车载娱乐系统_IVS' },
                { id: '23', name: '车载导航系统_GPS' },
                { id: '24', name: '车载通信系统_TCU' },
                { id: '25', name: '车载娱乐系统_IVS' },
                { id: '26', name: '车载导航系统_GPS' },
                { id: '27', name: '车载通信系统_TCU' },
                { id: '28', name: '车载娱乐系统_IVS' },
                { id: '29', name: '车载导航系统_GPS' },
                { id: '30', name: '车载通信系统_TCU' },
                { id: '31', name: '车载娱乐系统_IVS' },
                { id: '32', name: '车载导航系统_GPS' },
                { id: '33', name: '车载通信系统_TCU' },
                { id: '34', name: '车载娱乐系统_IVS' },
                { id: '35', name: '车载导航系统_GPS' },
                { id: '36', name: '车载通信系统_TCU' },
                { id: '37', name: '车载娱乐系统_IVS' },
                { id: '38', name: '车载导航系统_GPS' },
                { id: '39', name: '车载通信系统_TCU' },
                { id: '40', name: '车载娱乐系统_IVS' },
                { id: '41', name: '车载导航系统_GPS' },
                { id: '42', name: '车载通信系统_TCU' },
                { id: '43', name: '车载娱乐系统_IVS' },
                { id: '44', name: '车载导航系统_GPS' },
                { id: '45', name: '车载通信系统_TCU' },
            ],
            tableData: [],
            columns: [
                { prop: 'name', label: '功能名称', width: '150' },
                { prop: 'identifier', label: '标识符', width: '150' },
                { prop: 'dataType', label: '数据类型', width: '120' },
                { prop: 'accessMode', label: '读写类型', width: '120' },
                { prop: 'description', label: '描述', minWidth: '200' },
                { prop: 'operation', label: '操作', width: '150', fixed: 'right' }
            ],
            dialogVisible: false,
            dialogTitle: '',
            form: {
                name: '',
                identifier: '',
                dataType: '',
                accessMode: 'r',
                description: ''
            },
            rules: {
                name: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
                identifier: [{ required: true, message: '请输入标识符', trigger: 'blur' }],
                dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }]
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
            this.$message.info(`编辑菜单: ${item.name}`)
        },
        // 删除菜单
        handleMenuDelete(item) {
            this.$confirm('确认删除该菜单项?', '提示', {
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
            this.dialogTitle = '添加功能'
            this.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.form && this.$refs.form.resetFields()
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
        // 打开高级配置弹框
        openAdvancedConfig() {
            this.advancedDialogVisible = true
        },

        // 提交高级配置
        handleAdvancedSubmit() {
            this.$refs.advancedForm.validate(async (valid) => {
                if (valid) {
                    Object.assign(this.form, this.advancedForm)
                    this.advancedDialogVisible = false
                }
            })
        },
        handleParamButtonClick(item) {
            if (item.type === 'input-button') {
                this.openAdvancedConfig()
            }
        },
        // 提交表单
        handleSubmit() {
            this.$refs.form.validate(async (valid) => {
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
        height: calc(100% - 60px);
        background-color: #fff;
        border-radius: 4px;

        .sidebar {
            width: 200px;
            flex-shrink: 0;
            height: 100%;
            border-right: 1px solid #e6e6e6;
            overflow: hidden;

            .func-menu {
                width: 100%;
                height: 100%;
                overflow-y: auto;

                /* 自定义滚动条样式 */
                &::-webkit-scrollbar {
                    width: 6px;
                }

                &::-webkit-scrollbar-thumb {
                    background: #c0c4cc;
                    border-radius: 3px;
                }

                &::-webkit-scrollbar-track {
                    background: #f5f7fa;
                }

                .el-menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    height: 40px;
                    line-height: 40px;
                    color: #303133 !important;
                    font-size: 14px;
                    font-weight: 500;

                    &:hover {
                        background-color: #F8F8F8;
                    }

                    &.is-active {
                        color: #067288 !important;
                        background-color: #F8F8F8 !important;
                    }

                    span {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-right: 10px;
                    }

                    .menu-operations {
                        display: none;
                        gap: 8px;
                        flex-shrink: 0;

                        i {
                            font-size: 14px;
                            cursor: pointer;
                        }
                    }

                    &:hover .menu-operations {
                        display: flex;
                    }
                }
            }
        }

        .main-content {
            flex: 1;
            padding: 20px;
        }
    }
}

.advanced-dialog {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    height: 100% !important;
    position: fixed !important;
    z-index: 3000 !important;

    .el-dialog__wrapper {
        position: absolute;

        .el-dialog {
            margin: 0 auto !important;
            height: 100%;

            .el-dialog__body {
                height: calc(100% - 120px);
                overflow-y: auto;
                padding: 20px;
            }

            .el-dialog__header {
                padding: 20px;
            }

            .el-dialog__footer {
                padding: 20px;
            }
        }
    }
}
</style>
