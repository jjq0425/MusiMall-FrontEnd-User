import request from './request'

const baseUrl = '/api/order/v1/trade'


export const getMyOrderList = (page, pageSize, orderStatus) => {
    if (orderStatus == null) {
        return request({
            url: `${baseUrl}/searchByPageCurrentUser`,
            method: 'post',
            data: {
                pageNo: page,
                pageSize: pageSize
            }
        })
    } else {
        return request({
            url: `${baseUrl}/searchByPageCurrentUser`,
            method: 'post',
            data: {
                pageNo: page,
                pageSize: pageSize,
                orderStatus: orderStatus
            }
        })
    }
}

// 实际上是调用分页接口查询
export const getOrderDetailById = (id) => {
    return request({
        url: `${baseUrl}/searchByPageCurrentUser`,
        method: 'post',
        data: {
            pageNo: 1,
            pageSize: 0,
            id: id
        }
    })
}
