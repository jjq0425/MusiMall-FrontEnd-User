import request from './request'
import jsonBig from 'json-bigint'

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


export const preCreateTradeId = () => {
    return request({
        url: `${baseUrl}/preCreateTradeId`,
        method: 'get',
    })
}

export const createOrderDirectOrCart = (type, id, deliveryAddressId, cartProducts, remark) => {
    if (type == "direct") {
        return request({
            url: `${baseUrl}/createByDirect`,
            method: 'post',
            data: {
                id: id,
                deliveryAddressId: deliveryAddressId,
                cartProducts: cartProducts,
                remark: remark
            }
        })
    } else if (type == "cartAll") {
        return request({
            url: `${baseUrl}/create`,
            method: 'post',
            data: {
                deliveryAddressId: deliveryAddressId,
                id: id,
                remark: remark
            }
        })
    }
}


export const cancelOrder = (id) => {

    return request({
        url: `${baseUrl}/cancelOrder`,
        method: 'post',
        params: {
            id: id
        }
    })
}

export const checkOrderPayFinish = (id) => {

    return request({
        url: `${baseUrl}/checkOrderPayFinish`,
        method: 'get',
        params: {
            id: id
        }
    })
}

