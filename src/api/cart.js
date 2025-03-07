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

export const removeCartItem = (cartItemId) => {
    return request({
        url: `${baseUrl}/deleteProduct/${cartItemId}`,
        method: 'put',

    })
}

export const removeCartItems = (cartItemIds) => {
    return request({
        url: `${baseUrl}/deleteProducts`,
        method: 'put',
        data: cartItemIds
    })
}

export const clearCart = () => {
    return request({
        url: `${baseUrl}/clearCart`,
        method: 'put',
    })
}


export const updateCartItemQuantity = (cartItemId, quantity) => {
    return request({
        url: `${baseUrl}/updateShoppingCart`,
        method: 'put',
        data: {
            id: cartItemId,
            quantity: quantity
        }
    })
}