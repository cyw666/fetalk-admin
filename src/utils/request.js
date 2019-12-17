import axios from 'axios'
import _ from 'lodash'
import { Message } from 'element-ui'
// import store from '@/store'
import { getToken, removeToken } from '@/utils/token'
import router from '@/router'
import { deleteEmpty } from '@/utils'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const accessToken = getToken()
    let params = _.cloneDeep(config.params)
    let data = _.cloneDeep(config.data)
    config.params = deleteEmpty(params)
    config.data = deleteEmpty(data)
    if (accessToken) {
      // let each request carry token
      // ['Authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { data } = response
    return Promise.resolve(data)
  },
  err => {
    if (err.response) {
      // Error handler for 401.
      if (err.response.status === 401) {
        console.error('Status 401')
        removeToken()
        // Redirect to login page or somewhere.
        router.push('/auth/login')
      }

      err.response.data =
        typeof err.response.data === 'object' ? err.response.data : {}

      err.response.data.status = err.response.status

      if (!err.response.data.message) {
        err.response.data.message = err.response.statusText
      }
      Message({
        message: err.response.data.message,
        type: 'error',
      })
      return Promise.reject(err.response.data)
    } else {
      return Promise.reject(err)
    }
  }
)

export default service
