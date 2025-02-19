import request from './request'

const baseUrl = '/api/product/v1'

/**
 * 分页获取商品列表
 * @param {*} page  当前页码 
 * @param {*} pageSize  每页显示数量
 * @returns  Promise
 */
export const getProductList = (page, pageSize) => {
    return request.get(`${baseUrl}/product`, {
        params: {
            page: page,
            pageSize: pageSize,
            categoryName: null,
        }
    })
}

export const searchProduct = (keyword, page, pageSize) => {
    return request.get(`${baseUrl}/product/searchPage`, {
        params: {
            query: keyword,
            page: page,
            pageSize: pageSize
        }
    })
}