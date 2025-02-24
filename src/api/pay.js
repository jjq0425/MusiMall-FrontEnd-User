import request from './request'

const baseUrl = '/alipay'


// 仅提供URL，不提供请求方法
export const goToAlipay = (subject, traceNo, totalAmount) => {

    return JSON.parse(localStorage.getItem('api')).payUrl + `${baseUrl}/pay` + `?subject=${subject}&traceNo=${traceNo}&totalAmount=${totalAmount}`


}
