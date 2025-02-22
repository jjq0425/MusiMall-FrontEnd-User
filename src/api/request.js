import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from '@arco-design/web-vue'
import { NeedOuterResponsePrase, gatewayUrlChoose } from '../handler/gatewayUrlChoose'

import jsonBig from 'json-bigint'

const request = axios.create({
    timeout: 25000,
    // 解决传回来的ID过大问题：https://blog.csdn.net/qq_68155756/article/details/138720242
    transformResponse: [function (data) {//transformResponse这个配置项可以拦截接口返回的内容进行处理
        try {
            // 如果大数字类型转换成功则返回转换的数据结果
            return jsonBig.parse(data);
        } catch (err) {
            // 如果转换失败，代表没有长数字可转，正常解析并返回

            try {
                return JSON.parse(data)
            } catch (err) {
                // 如果是流式数据，直接返回
                return data
            }

        }
    }]

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
        // 如果是流式数据。直接返回
        if (response.headers['content-type'] === 'text/event-stream') {
            return response
        }
        // 如果不需要剥离外层的response（统一响应），直接返回
        if (!NeedOuterResponsePrase()) {
            return response.data
        }
        // 经过网关，需要剥离外层的response，并判断是否成功
        if (response?.data?.code !== 200) {
            if (response?.data?.message !== null && response?.data?.message !== "") {
                Message.warning(response?.data?.message)
                if (response?.data?.message == "请先登录") {
                    localStorage.removeItem('token')
                    router.push({ name: 'Login' })
                }
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