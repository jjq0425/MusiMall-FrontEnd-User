import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from '@arco-design/web-vue'
import { NeedOuterResponsePrase, gatewayUrlChoose } from '../handler/gatewayUrlChoose'


const request = axios.create({
    timeout: 25000
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Basic@${token}`
        }
        // 在服务器测试时候不带baseUrl，在NetworkSetting已经带了
        if (config.NetworkSetting == null || !config.NetworkSetting) {
            config.url = gatewayUrlChoose(config.url)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {

        // 如果不需要剥离外层的response（统一响应），直接返回
        if (!NeedOuterResponsePrase()) {
            return response.data
        }
        // 经过网关，需要剥离外层的response，并判断是否成功
        if (response?.data?.code !== 200) {
            if (response?.data?.message !== null && response?.data?.message !== "") {
                Message.warning(response?.data?.message)
            }
            return Promise.reject(response)
        } else {
            if (response?.data?.message !== null && response?.data?.message !== "") {
                Message.success(response?.data?.message)
            }
        }
        return response.data.data


    },
    error => {

        if (error.response?.status === 500) {

            if (error.response?.data?.message !== null) {
                Message.warning(error.response?.data?.message)
            }
        }
        return Promise.reject(error)
    }
)



export default request