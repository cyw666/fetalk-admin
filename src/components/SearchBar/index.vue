<template>
  <el-form
    ref="form"
    :model="params"
    :inline="inline"
    label-position="right"
    class="search-form"
    :label-width="labelWidth"
  >
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :prop="form.modelValue"
      :label="form.label"
      :rules="form.rules || []"
      :label-width="form.labelWidth ? form.labelWidth : labelWidth"
      :style="form.style"
    >
      <el-input
        v-if="form.itemType === 'input' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        :readonly="form.readonly"
        :disabled="form.disabled"
        :placeholder="form.placeholder"
        :style="
          itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')
        "
      />
      <el-select
        v-else-if="form.itemType === 'select'"
        v-model="params[form.modelValue]"
        :remote="form.remote ? true : false"
        :remote-method="form.remoteMethod"
        :disabled="form.disabled"
        :placeholder="form.placeholder"
        filterable
        clearable
        :style="
          itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')
        "
        @on-change="form.onChange"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="
            typeof option === 'object'
              ? option[form.valueKey || 'value']
              : option
          "
          :label="
            typeof option === 'object'
              ? option[form.labelKey || 'label']
              : option
          "
        />
        <el-option
          v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
          :key="opIndex + '_remote'"
          :value="typeof op === 'object' ? op[form.valueKey || 'value'] : op"
          :label="typeof op === 'object' ? op[form.labelKey || 'label'] : op"
        />
      </el-select>
      <el-date-picker
        v-else-if="
          ['year', 'month', 'date', 'week', 'datetime', 'dates'].includes(
            form.itemType
          )
        "
        v-model="params[form.modelValue]"
        :type="form.itemType"
        :placeholder="form.placeholder"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :style="
          itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')
        "
        :picker-options="form.pickerOptions || {}"
      />
      <el-date-picker
        v-else-if="
          ['datetimerange', 'daterange', 'monthrange'].includes(form.itemType)
        "
        v-model="params[form.modelValue]"
        :type="form.itemType"
        :disabled="form.disabled"
        :readonly="form.readonly"
        :editable="form.editable"
        :placeholder="form.placeholder"
        :start-placeholder="form.startPlaceholder"
        :end-placeholder="form.startPlaceholder"
        :style="
          itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')
        "
        :picker-options="form.pickerOptions || {}"
        @change="date => changeDate(date, form.prop[0], form.prop[1])"
      />
    </el-form-item>
    <el-form-item label-width="8px">
      <el-button
        type="primary"
        class="submit-btn"
        :loading="submitLoading"
        @click="searchHandler"
        >{{ submitBtnText }}</el-button
      >
      <slot name="btn"></slot>
      <el-button
        v-if="showResetBtn"
        type="primary"
        ghost
        :plain="true"
        :loading="submitLoading"
        @click="resetForm"
        >{{ resetBtnText }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import _ from 'lodash'
const formProps = {
  showResetBtn: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: true,
  },
  fuzzy: {
    type: Boolean,
    default: false,
  },
  labelWidth: {
    type: String,
    default: '80px',
  },
  itemWidth: Number,
  submitHandler: Function,
  submitLoading: {
    type: Boolean,
    default: false,
  },
  submitBtnText: {
    type: String,
    default: '搜索',
  },
  resetBtnText: {
    type: String,
    default: '重置',
  },
  resetBtnCallback: Function,
  forms: {
    type: Array,
    required: true,
  },
}
const noop = () => {}

export default {
  name: 'SearchBar',
  props: formProps,
  data() {
    const { forms, fuzzy } = this.$props
    const datePrefix = 'daterange-prefix'
    const selectOptionPrefix = 'select-option-prefix'
    let dataObj = {
      selectOptions: {},
    }

    let params = {}
    let format = {}
    let fuzzyOps = {}

    forms.forEach((v, i) => {
      const propType = typeof v.prop
      if (propType === 'string') {
        v.modelValue = v.prop
        params[v.prop] = ''

        fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
        if (v.format) {
          format[v.prop] = v.format
        }
      } else if (
        propType === 'object' &&
        Object.prototype.toString.call(v.prop) === '[object Array]'
      ) {
        v.prop.forEach(vv => {
          params[vv] = ''
          if (v.format) {
            format[vv] = v.format
          }

          fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
        })
      }
      if (v.itemType === 'daterange') {
        params[datePrefix + i] = ''
        v.modelValue = datePrefix + i
      }
      if (v.itemType === 'select' && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i
        dataObj.selectOptions[dataKey] = []
        const { $axios } = this
        if (!v.selectMethod) {
          v.selectMethod = 'get'
        }
        this.getRemoteData({
          fetch: v.selectFetch
            ? v.selectFetch
            : () => {
                return $axios[v.selectMethod](
                  v.selectUrl,
                  v.selectMethod.toLowerCase() === 'get'
                    ? { params: v.selectParams }
                    : v.selectParams
                )
              },
          dataKey,
          resultField: v.selectResultField || 'result',
          resultHandler: v.selectResultHandler,
        })
      }

      if (!v.onChange) {
        v.onChange = noop
      }

      v.onChange = v.onChange.bind(this)
    })

    return {
      params,
      datePrefix,
      selectOptionPrefix,
      ...dataObj,
      format,
      fuzzyOps,
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    },
  },
  methods: {
    isArray(value) {
      return (
        typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Array]'
      )
    },
    searchHandler() {
      this.getParams((error, params) => {
        if (!error) {
          const { submitHandler } = this
          if (submitHandler) {
            submitHandler(params)
          } else {
            throw new Error('Need to set attribute: submitHandler !')
          }
        }
      })
    },
    getParamFuzzy() {
      return this.fuzzyOps
    },
    getParams(callback) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { params, datePrefix, format } = this
          let formattedForm = {}
          Object.keys(params).forEach(v => {
            if (v.indexOf(datePrefix) === -1) {
              formattedForm[v] = format[v] ? format[v](params[v], v) : params[v]
            }
          })
          if (callback) callback(null, formattedForm)
        } else {
          if (callback) callback(new Error())
        }
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
      const { resetBtnCallback } = this
      if (resetBtnCallback) resetBtnCallback()
    },
    changeDate(date, startDate, endDate) {
      let dates
      if (date === null) {
        this.params[startDate] = ''
        this.params[endDate] = ''
        return
      }
      if (typeof date === 'string') {
        dates = date.split(' - ')
      } else if (_.isArray(date) && date) {
        const firstDate = date[0]
        const secondDate = date[1]
        dates = [firstDate, secondDate]
      }

      this.params[startDate] = dates[0]
      this.params[endDate] = dates[1]
    },
    getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
      fetch().then(response => {
        let result = response
        if (typeof response === 'object' && !this.isArray(response)) {
          if (resultField.indexOf('.') !== -1) {
            resultField.split('.').forEach(vv => {
              result = result[vv]
            })
          } else {
            result = response[resultField]
          }
        }

        if (!result || !(result instanceof Array)) {
          console.warn(
            `The result of key:${resultField} is not Array. 接口返回的字段:${resultField} 不是一个数组`
          )
        }

        if (resultHandler) {
          this.selectOptions[dataKey] = result.map(resultHandler)
        } else {
          this.selectOptions[dataKey] = result
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-form {
  padding: 18px 0 0;
}
</style>
