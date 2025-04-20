<template>
  <div class="main-content">
    <table-page :table-data="tableData" :columns="columns" :height="height" :loading="loading" :total="total"
      :page.sync="listQuery.page" :limit.sync="listQuery.limit" @search="handleSearch" @reset="handleReset"
      @pagination="getList" :row-key="'id'" :search-model="searchModel" :search-items="searchItems">
      <template #operation-buttons>
        <el-button type="primary" @click="handleAdd">添加自定功能</el-button>
      </template>
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
    <!-- 功能表单对话框 -->
    <global-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :confirm-loading="loading"
      @confirm="handleSubmit" @cancel="dialogVisible = false">
      <global-form ref="customFuncForm" :model="customFuncForm" :rules="customFuncRules" :form-items="customFuncItems"
        :show-footer="false" label-width="100px" @select-change="handleSelectChange"
        @button-click="handleParamButtonClick">
        <template #form-item-rangeItem="{ item }">
          <div class="range-container">
            <el-input v-model="customFuncForm.min" @blur="handleRangeInputBlur" placeholder="最小值"
              class="range-input"></el-input>
            <span class="range-separator">~</span>
            <el-input v-model="customFuncForm.max" @blur="handleRangeInputBlur" placeholder="最大值"
              class="range-input"></el-input>
          </div>
        </template>
        <template #form-item-enumItem="{ item }">
          <div class="enum-container">
            <div class="enum-header">
              <div class="enum-title">参数值</div>
              <div class="enum-title">枚举描述</div>
            </div>
            <div v-for="(enumOption, index) in customFuncForm.enumValues" :key="index" class="enum-row">
              <el-input v-model="enumOption.value" placeholder="编号如‘0’" @blur="handleEnumInputBlur"
                class="enum-input"></el-input>
              <span class="enum-separator">~</span>
              <el-input v-model="enumOption.description" @blur="handleEnumInputBlur" placeholder="对该枚举值的描述"
                class="enum-desc-input"></el-input>
              <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="removeEnumValue(index)"
                v-if="customFuncForm.enumValues.length > 1"></el-button>
            </div>
            <div class="enum-add">
              <el-button class="mini" type="text" @click="addEnumValue" icon="el-icon-plus">添加枚举项</el-button>
            </div>
          </div>
        </template>
        <template #form-item-boolItem="{ item }">
          <div class="bool-options-container">
            <div class="bool-item">
              <div class="bool-row">
                <span class="bool-value">0 - </span>
                <el-input v-model="customFuncForm.boolOptions['0']" placeholder="如：关" class="bool-label-input"
                  @blur="handleBoolInputBlur"></el-input>
              </div>
              <div class="bool-row">
                <span class="bool-value">1 - </span>
                <el-input v-model="customFuncForm.boolOptions['1']" placeholder="如：开" class="bool-label-input"
                  @blur="handleBoolInputBlur"></el-input>
              </div>
            </div>
          </div>
        </template>
        <template #form-item-jsonObj="item">
          <div class="params-container">
            <div v-if="customFuncForm.params && customFuncForm.params.length > 0" class="params-table">
              <div class="params-header">
                <div class="param-name">参数名称</div>
                <div class="param-operations">操作</div>
              </div>
              <div v-for="(param, index) in customFuncForm.params" :key="index" class="param-row">
                <div class="param-name">{{ param.name }}</div>
                <div class="param-operations">
                  <el-button type="text" @click="editParam(index)">编辑</el-button>
                  <el-button type="text" style="color: #F56C6C;" @click="deleteParam(index)">删除</el-button>
                </div>
              </div>
            </div>
            <div class="add-param">
              <el-button type="text" icon="el-icon-plus" @click="addNewParam">新增参数</el-button>
            </div>
          </div>
        </template>
      </global-form>
      <!-- 新增参数弹框 -->
      <global-dialog :title="paramDialogTitle" :visible.sync="advancedDialogVisible" width="500px" append-to-body
        custom-class="advanced-dialog" @confirm="handleAdvancedSubmit" top="20vh">
        <global-form ref="advancedForm" :model="advancedForm" :rules="advancedRules" :form-items="advancedItems"
          :show-footer="false" label-width="100px" @select-change="handleAdvSelectChange">
          <template #form-item-rangeItem="{ item }">
            <div class="range-container">
              <el-input v-model="advancedForm.min" placeholder="最小值" class="range-input"></el-input>
              <span class="range-separator">~</span>
              <el-input v-model="advancedForm.max" placeholder="最大值" class="range-input"></el-input>
            </div>
          </template>
          <template #form-item-enumItem="{ item }">
            <div class="enum-container">
              <div class="enum-header">
                <div class="enum-title">参数值</div>
                <div class="enum-title">枚举描述</div>
              </div>
              <div v-for="(enumOption, index) in advancedForm.enumValues" :key="index" class="enum-row">
                <el-input v-model="enumOption.value" placeholder="编号如‘0’" class="enum-input"></el-input>
                <span class="enum-separator">~</span>
                <el-input v-model="enumOption.description" placeholder="对该枚举值的描述" class="enum-desc-input"></el-input>
                <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="removeEnumValue(index)"
                  v-if="advancedForm.enumValues.length > 1"></el-button>
              </div>
              <div class="enum-add">
                <el-button class="mini" type="text" @click="addEnumValue" icon="el-icon-plus">添加枚举项</el-button>
              </div>
            </div>
          </template>
          <template #form-item-boolItem="{ item }">
            <div class="bool-options-container">
              <div class="bool-item">
                <div class="bool-row">
                  <span class="bool-value">0 - </span>
                  <el-input v-model="advancedForm.boolOptions['0']" placeholder="如：关"
                    class="bool-label-input"></el-input>
                </div>
                <div class="bool-row">
                  <span class="bool-value">1 - </span>
                  <el-input v-model="advancedForm.boolOptions['1']" placeholder="如：开"
                    class="bool-label-input"></el-input>
                </div>
              </div>
            </div>
          </template>
        </global-form>
      </global-dialog>

    </global-dialog>
  </div>
</template>

<script>
export default {
  name: 'ContentTable',
  props: {

  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'type', label: '功能类型' },
        { prop: 'name', label: '功能名称' },
        { prop: 'identifier', label: '标识符' },
        { prop: 'dataType', label: '数据类型', slotName: 'dataType' },
        { prop: 'accessMode', label: '数据定义', slotName: 'accessMode' },
      ],
      loading: false,
      total: 0,
      height: 'calc(75vh-74px)',
      searchItems: [
        { label: '属性名称', prop: 'property_name', type: 'input' },
        { label: '属性标识', prop: 'property_id', type: 'input' },
      ],
      listQuery: {
        page: 1,
        limit: 10,
        property_name: '',
        property_id: ''
        //status: ''
      },
      // 搜索表单值
      searchModel: {
        property_name: '',
        property_id: ''
      },

      dialogVisible: false,
      dialogTitle: '',
      customFuncForm: {
        modelType: 'propertiy',
        name: '',
        identifier: '',
        dataType: '',
        min: '',
        max: '',
        step: '',
        unit: '',
        enumValues: [],
        accessMode: 'r',
        description: '',
        boolOptions: {
          '0': '',
          '1': ''
        },
        strLength: 10240,
        dateFormate: 'Sting类型的UTC时间戳'
      },

      customFuncRules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.trim() === '') {
                callback(new Error('请输入功能名称'));
              } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9\-_\/\.]*$/.test(value)) {
                callback(new Error('名称只能包含中文、字母、数字、-、_、/和.，且必须以中文、字母或数字开头'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        identifier: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.trim() === '') {
                callback(new Error('请输入标识符'));
              } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                callback(new Error('标识符只能包含字母、数字和下划线'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        dataType: [
          {
            required: true,
            message: '请选择数据类型',
            trigger: 'change'
          }
        ]

      },
      advancedDialogVisible: false,
      advancedForm: {
        name: '',
        identifier: '',
        dataType: '',
        min: '',
        max: '',
        step: '',
        unit: '',
        enumValues: [],
        accessMode: 'r',
        description: '',
        boolOptions: {
          '0': '关',
          '1': '开'
        },
        strLength: 10240,
        dateFormate: 'Sting类型的UTC时间戳'
      },
      advancedRules: {

      },
      paramDialogTitle: ''
    }
  },
  computed: {
    customFuncItems() {
      const baseItems = [
        {
          label: '功能类型',
          prop: 'modelType',
          type: 'radio',
          required: true,
          buttonStyle: true,
          options: [
            { label: '属性', value: 'propertiy' },
            { label: '服务', value: 'service' },
            { label: '事件', value: 'event' }
          ]
        },
        {
          label: '功能名称',
          prop: 'name',
          type: 'input',
          placeholder: '请输入功能名称',
          required: true,
          showWordLimit: true,
          maxlength: 30,
        },
        {
          label: '标识符',
          prop: 'identifier',
          type: 'input',
          placeholder: '请输入标识符',
          required: true,
          showWordLimit: true,
          maxlength: 50,
        },
        {
          label: '数据类型',
          prop: 'dataType',
          type: 'select',
          placeholder: '请选择数据类型',
          options: this.dataTypeOptions,
          required: true
        }
      ];
      if (this.customFuncForm.dataType === 'int32' || this.customFuncForm.dataType === 'float' || this.customFuncForm.dataType === 'double') {
        baseItems.push(
          {
            label: '取值范围',
            prop: 'rangeItem',
            type: 'slot',
            required: true,
            rules: {
              validator: (rule, value, callback) => {
                this.validateRange(callback);
              },
              trigger: 'blur'
            }
          },
          {
            label: '步长',
            prop: 'step',
            type: 'input',
            required: true,
          },
          {
            label: '单位',
            type: 'input',
            prop: 'unit'
          }
        )
      } else
        if (this.customFuncForm.dataType === 'enum') {
          // 为枚举类型添加枚举项配置
          baseItems.push({
            label: '枚举项',
            prop: 'enumItem',
            type: 'slot',
            required: true,
            rules: {
              validator: (rule, value, callback) => {
                this.validateEnum(callback);
              },
            }
          });

          this.$set(this.customFuncForm, 'enumValues', [
            { value: '', description: '' }
          ]);

        } else if (this.customFuncForm.dataType === 'bool') {
          // 为布尔类型添加布尔值配置
          baseItems.push({
            label: '布尔值',
            prop: 'boolItem',
            type: 'slot',
            required: true,
            rules: {
              validator: (rule, value, callback) => {
                this.validateBool(callback);
              },
            }
          });

          this.$set(this.customFuncForm, 'boolOptions', {
            '0': '',
            '1': ''
          });

        } else if (this.customFuncForm.dataType === 'text') {
          baseItems.push({
            label: '数据长度',
            prop: 'strLength',
            type: 'input-with-unit',
            unit: '字节',
            required: true
          })
        } else if (this.customFuncForm.dataType === 'date') {
          baseItems.push({
            label: '事件格式',
            prop: 'dateFormate',
            type: 'input',
            disabled: true,
          })
        } else if (this.customFuncForm.dataType === 'struct') {
          baseItems.push({
            label: 'JSON对象',
            type: 'slot',
            prop: 'jsonObj',
            required: true
          })
        }
      // 添加通用的其他表单项
      baseItems.push(
        {
          label: '读写类型',
          prop: 'accessMode',
          type: 'radio',
          options: [
            { label: '读写', value: 'rw' },
            { label: '只读', value: 'r' }
          ]
        },
        {
          label: '描述',
          prop: 'description',
          type: 'textarea',
          rows: 3,
          placeholder: '请输入描述信息'
        }
      );

      return baseItems;
    },
    advancedItems() {
      const bsItems = [
        {
          label: '参数名称',
          prop: 'name',
          type: 'input',
          required: true,
          showWordLimit: true,
          maxlength: 30,
        },
        {
          label: '标识符',
          prop: 'identifier',
          type: 'input',
          required: true,
          showWordLimit: true,
          maxlength: 50,
        },
        {
          label: '数据类型',
          prop: 'dataType',
          type: 'select',
          options: this.dataTypeOptions.filter((itm) => itm.value !== 'struct'),
        }
      ]
      if (this.advancedForm.dataType === 'int32' || this.advancedForm.dataType === 'float' || this.advancedForm.dataType === 'double') {
        bsItems.push(
          {
            label: '取值范围',
            prop: 'rangeItem',
            type: 'slot',
            required: true
          },
          {
            label: '步长',
            prop: 'step',
            type: 'input',
            required: true,
          },
          {
            label: '单位',
            type: 'input',
            prop: 'unit'
          }
        )
      } else
        if (this.advancedForm.dataType === 'enum') {
          // 为枚举类型添加枚举项配置
          bsItems.push({
            label: '枚举项',
            prop: 'enumItem',
            type: 'slot',
            required: true
          });

          this.$set(this.advancedForm, 'enumValues', [
            { value: '', description: '' }
          ]);

        } else if (this.advancedForm.dataType === 'bool') {
          // 为布尔类型添加布尔值配置
          bsItems.push({
            label: '布尔值',
            prop: 'boolItem',
            type: 'slot',
            required: true
          });

          this.$set(this.advancedForm, 'boolOptions', {
            '0': '',
            '1': ''
          });

        } else if (this.advancedForm.dataType === 'text') {
          bsItems.push({
            label: '数据长度',
            prop: 'strLength',
            type: 'input-with-unit',
            unit: '字节',
            required: true
          })
        } else if (this.advancedForm.dataType === 'date') {
          bsItems.push({
            label: '事件格式',
            prop: 'dateFormate',
            type: 'input',
            disabled: true,
          })
        }
      return bsItems

    },
    dataTypeOptions() {
      return [
        { label: 'int32(整数型)', value: 'int32' },
        { label: 'float(单精度浮点型)', value: 'float' },
        { label: 'double(双精度浮点型)', value: 'double' },
        { label: 'enum(枚举型)', value: 'enum' },
        { label: 'bool(布尔型)', value: 'bool' },
        { label: 'text(字符串)', value: 'text' },
        { label: 'date(时间型)', value: 'date' },
        { label: 'struct(结构体)', value: 'struct' },
      ]
    }
  },
  methods: {
    getList() {
      this.tableData = []
    },
    handleAdd() {
      this.dialogTitle = '添加自定义功能'
      // this.customFuncForm = {

      // }
      this.dialogVisible = true

    },
    handleSelectChange(val, type) {
      // let form =  this.$refs.customFuncForm.getFormData()
      // console.log(form)
      if (type == 'dataType') {
        this.customFuncForm = this.$refs.customFuncForm.getFormData()

      }
    },
    handleAdvSelectChange(val, type) {
      if (type == 'dataType') {
        this.$set(this.advancedForm, 'dataType', val)
      }
    },
    validateRange(callback) {
      // 获取当前数据类型
      const dataType = this.customFuncForm.dataType;

      // 获取表单中的最小值和最大值
      const minStr = this.customFuncForm.min;
      const maxStr = this.customFuncForm.max;

      // 检查是否为空
      if (!minStr && minStr !== '0') {
        callback(new Error('请输入最小值'));
        return;
      }

      if (!maxStr && maxStr !== '0') {
        callback(new Error('请输入最大值'));
        return;
      }

      // 转换为数值
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);

      // 检查是否为有效数值
      if (isNaN(min)) {
        callback(new Error('最小值必须为数字'));
        return;
      }

      if (isNaN(max)) {
        callback(new Error('最大值必须为数字'));
        return;
      }

      // 检查最大值是否大于最小值
      if (min >= max) {
        callback(new Error('最大值必须大于最小值'));
        return;
      }

      // 根据数据类型进行特定验证
      if (dataType === 'int32') {
        // 整数型验证
        if (!Number.isInteger(min)) {
          callback(new Error('整数型的最小值必须为整数'));
          return;
        }

        if (!Number.isInteger(max)) {
          callback(new Error('整数型的最大值必须为整数'));
          return;
        }

        // 检查整数范围
        if (min < -2147483648 || max > 2147483647) {
          callback(new Error('int32的取值范围为-2147483648~2147483647'));
          return;
        }
      } else if (dataType === 'float') {
        // 单精度浮点数验证
        // 检查是否超过7位有效数字
        const checkFloat = (value) => {
          const str = value.toString();
          // 去除负号和小数点
          const digits = str.replace(/[-\.]/g, '');
          // 去除前导零
          const significantDigits = digits.replace(/^0+/, '');
          return significantDigits.length <= 7;
        };

        if (!checkFloat(min)) {
          callback(new Error('单精度浮点数最小值不能超过7位有效数字'));
          return;
        }

        if (!checkFloat(max)) {
          callback(new Error('单精度浮点数最大值不能超过7位有效数字'));
          return;
        }
      } else if (dataType === 'double') {
        // 双精度浮点数验证
        // 检查是否超过16位有效数字
        const checkDouble = (value) => {
          const str = value.toString();
          // 去除负号和小数点
          const digits = str.replace(/[-\.]/g, '');
          // 去除前导零
          const significantDigits = digits.replace(/^0+/, '');
          return significantDigits.length <= 16;
        };

        if (!checkDouble(min)) {
          callback(new Error('双精度浮点数最小值不能超过16位有效数字'));
          return;
        }

        if (!checkDouble(max)) {
          callback(new Error('双精度浮点数最大值不能超过16位有效数字'));
          return;
        }
      }

      // 验证通过
      callback();
    },
    validateEnum(callback) {
      // 检查是否有枚举值
      if (!this.customFuncForm.enumValues || this.customFuncForm.enumValues.length === 0) {
        callback(new Error('请至少添加一个枚举项'));
        return;
      }

      // 用于存储已使用的枚举值和描述，检查是否重复
      const usedValues = new Set();
      const usedDescriptions = new Set();

      // 检查每个枚举项
      for (let i = 0; i < this.customFuncForm.enumValues.length; i++) {
        const enumItem = this.customFuncForm.enumValues[i];

        // 检查参数值
        if (!enumItem.value && enumItem.value !== '0') {
          callback(new Error(`第${i + 1}项的参数值不能为空`));
          return;
        }

        // 检查参数值是否为整数
        const value = parseInt(enumItem.value, 10);
        if (isNaN(value) || value.toString() !== enumItem.value) {
          callback(new Error(`第${i + 1}项的参数值必须为整数`));
          return;
        }

        // 检查参数值范围
        if (value < -2147483648 || value > 2147483647) {
          callback(new Error(`第${i + 1}项的参数值超出范围(-2147483648~2147483647)`));
          return;
        }

        // 检查参数值是否重复
        if (usedValues.has(value)) {
          callback(new Error(`第${i + 1}项的参数值与其他项重复`));
          return;
        }
        usedValues.add(value);

        // 检查参数描述
        if (!enumItem.description) {
          callback(new Error(`第${i + 1}项的枚举描述不能为空`));
          return;
        }

        // 检查参数描述格式
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9_\-]{0,19}$/.test(enumItem.description)) {
          callback(new Error(`第${i + 1}项的枚举描述格式不正确，必须以中文、英文或数字开头，支持中文、英文大小写、数字、下划线和短划线`));
          return;
        }

        // 检查参数描述长度
        if (enumItem.description.length > 20) {
          callback(new Error(`第${i + 1}项的枚举描述不能超过20个字符`));
          return;
        }

        // 检查参数描述是否重复
        if (usedDescriptions.has(enumItem.description)) {
          callback(new Error(`第${i + 1}项的枚举描述与其他项重复`));
          return;
        }
        usedDescriptions.add(enumItem.description);
      }

      // 验证通过
      callback();
    },
    validateBool(callback) {
      // 检查布尔值选项是否已设置
      if (!this.customFuncForm.boolOptions) {
        callback(new Error('布尔值选项未设置'));
        return;
      }

      // 检查"0"对应的值是否已填写
      if (!this.customFuncForm.boolOptions['0']) {
        callback(new Error('请填写"0"对应的描述'));
        return;
      }

      // 检查"1"对应的值是否已填写
      if (!this.customFuncForm.boolOptions['1']) {
        callback(new Error('请填写"1"对应的描述'));
        return;
      }

      // 检查两个描述是否相同
      if (this.customFuncForm.boolOptions['0'] === this.customFuncForm.boolOptions['1']) {
        callback(new Error('两个布尔值的描述不能相同'));
        return;
      }

      // 先检查描述长度
      if (this.customFuncForm.boolOptions['0'].length > 20) {
        callback(new Error('"0"的描述不能超过20个字符'));
        return;
      }

      if (this.customFuncForm.boolOptions['1'].length > 20) {
        callback(new Error('"1"的描述不能超过20个字符'));
        return;
      }

      // 再检查描述格式
      const validateFormat = (value, label) => {
        // 修改正则表达式，不再限制长度，因为长度已经在前面检查过了
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9][\u4e00-\u9fa5a-zA-Z0-9_\-]*$/.test(value)) {
          callback(new Error(`${label}的描述格式不正确，必须以中文、英文或数字开头，支持中文、英文大小写、数字、下划线和短划线`));
          return false;
        }
        return true;
      };

      // 验证"0"的描述格式
      if (!validateFormat(this.customFuncForm.boolOptions['0'], '"0"')) {
        return;
      }

      // 验证"1"的描述格式
      if (!validateFormat(this.customFuncForm.boolOptions['1'], '"1"')) {
        return;
      }

      // 验证通过
      callback();
    },
    // 修改表单项中input的blur事件处理
    handleBoolInputBlur() {
      this.$refs.customFuncForm.validateField('boolItem');
    },
    handleEnumInputBlur() {
      this.$refs.customFuncForm.validateField('enumItem');
    },
    // 修改表单项中input的blur事件处理
    handleRangeInputBlur() {
      // 触发rangeItem的验证
      this.$refs.customFuncForm.validateField('rangeItem');
    },

    // 添加枚举值方法
    addEnumValue() {
      this.customFuncForm.enumValues.push({ value: '', description: '' });
    },
    // 删除枚举值方法
    removeEnumValue(index) {
      this.customFuncForm.enumValues.splice(index, 1);
      // 删除后重新触发验证
      this.$nextTick(() => {
        this.$refs.customFuncForm.validateField('enumItem');
      });
    },

    addNewParam() {
      this.paramDialogTitle = '新增参数';
      this.openAdvancedConfig()
    },
    handleSearch(params) {
      this.$emit('search', params)
    },
    handleReset() {
      this.$emit('reset')
    },
    handleEdit(row) {
      this.$emit('edit', row)
    },
    handleDelete(row) {
      this.$emit('delete', row)
    },
    // 打开高级配置弹框
    openAdvancedConfig() {
      this.advancedDialogVisible = true
    },

    // 提交高级配置
    handleAdvancedSubmit() {
      const data = this.$refs.advancedForm.getFormData()
      console.log(data)
      this.$refs.advancedForm.validate(async (valid) => {
        if (valid) {
          const data = this.$refs.advancedForm.getFormData()
          console.log(data)
          // this.advancedDialogVisible = false
        }
      })
    },
    handleParamButtonClick(item) {
      if (item.type === 'input-button') {
        this.openAdvancedConfig()
      }
    },
    handleSubmit() { }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  flex: 1;
}

.enum-container {
  width: 100%;

  .enum-header {
    display: flex;
    margin-bottom: 8px;

    .enum-title {
      &:first-child {
        width: 120px;
        margin-right: 20px;
      }
    }
  }

  .enum-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .enum-input {
      width: 120px;
      flex-shrink: 0;
    }

    .enum-separator {
      margin: 0 10px;
      color: #909399;
    }

    .enum-desc-input {
      flex: 1;
    }

    .delete-btn {
      margin-left: 5px;
      padding: 2px;
    }
  }

  .enum-add {
    margin-top: 5px;

    .add-link {
      color: #409EFF;
      cursor: pointer;
      font-size: 13px;

      &:hover {
        color: #66b1ff;
      }
    }
  }
}

.bool-options-container {
  width: 100%;

  .bool-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bool-row {
    display: flex;
    align-items: center;

    .bool-value {
      width: 30px;
      font-size: 14px;
      color: #606266;
    }

    .bool-label-input {
      width: 200px;
    }
  }
}

.range-container {
  display: flex;
  align-items: center;
  width: 100%;

  .range-input {
    width: 100%;
  }

  .range-separator {
    margin: 0 10px;
    color: #909399;
  }
}

.params-container {
  width: 100%;

  .params-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 10px;

    .params-header {
      display: flex;
      justify-content: space-between;
      background-color: #f5f7fa;
      padding: 8px 12px;
      font-weight: bold;

      .param-name {
        flex: 1;
      }

      .param-operations {
        width: 120px;
        text-align: center;
      }
    }

    .param-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      border-top: 1px solid #ebeef5;

      .param-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .param-operations {
        width: 120px;
        text-align: right;

        .el-button {
          padding: 0 5px;
        }
      }
    }
  }

  .add-param {
    margin-top: 10px;
  }
}
</style>