import request from './request'

const baseUrl = '/api/order/v1/deliveryAddress'


export const getAddressList = (page, pageSize) => {
    return request({
        url: `${baseUrl}/searchByPageCurrentUser`,
        method: 'post',
        data: {
            pageNo: page,
            pageSize: pageSize
        }
    })
}

export const addAddress = (data) => {
    return request({
        url: `${baseUrl}/add`,
        method: 'post',
        data
    })
}


export const updateAddress = (data) => {
    return request({
        url: `${baseUrl}/update`,
        method: 'post',
        data
    })
}

export const deleteAddress = (id) => {
    return request({
        url: `${baseUrl}/deleteByIds`,
        method: 'post',
        data: [id]
    })
}

export const setDefaultAddress = (id) => {
    return request({
        url: `${baseUrl}/setDefault`,
        method: 'post',
        params: {
            id: id
        }
    })
}

export const getDefaultAddress = () => {
    return request({
        url: `${baseUrl}/findDefault`,
        method: 'get'
    })
}

export const getAddressById = (id) => {
    return request({
        url: `${baseUrl}/findById`,
        method: 'get',
        params: {
            id: id
        }
    })
}