import request from './request'

const baseUrl = '/api/shoppingCart/v1/shoppingCart'

export const getCartList = (pageNo, pageSize) => {
    return request({
        url: `${baseUrl}/getShoppingCart`,
        method: 'post',
        data: {
            pageNo: pageNo,
            pageSize: pageSize
        }
    })
}


export const addCart = (productId, quantity) => {
    return request({
        url: `${baseUrl}/insertOrUpdate`,
        method: 'post',
        data: {
            productId: productId,
            quantity: quantity
        }
    })
}