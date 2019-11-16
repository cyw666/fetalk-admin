import _ from 'lodash'
import dayjs from 'dayjs'

export default {
  methods: {
    dateFormat(date, format = 'YYYY-MM-DD') {
      if (!date) return
      return dayjs(date).format(format)
    },
    getConstName(val, list, key = 'value', getKey = 'label') {
      if (!list) return
      const item = _.find(list, v => v[key] === val)
      return item && item[getKey]
    },
  },
}
