import request from './request'

const baseUrl = '/api/ai'


// 仅提供URL，不提供请求方法
export const aichat = (isTest = true) => {

    return JSON.parse(localStorage.getItem('api')).baseUrlWithGateWay + `${baseUrl}/chat` + (isTest ? '/test' : '')
    // return "http://localhost:9555" + `/chat` + (isTest ? '/test' : '')


}
