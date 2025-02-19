import request from './request'

const baseUrl = '/api/order/v1/trade'


export const getMyOrderList = (page, pageSize) => {
    return request({
        url: `${baseUrl}/searchByPageCurrentUser`,
        method: 'post',
        data: {
            pageNo: page,
            pageSize: pageSize
        }
    })
}