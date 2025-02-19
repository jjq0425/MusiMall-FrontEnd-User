import request from './request'

const baseUrl = '/api/auth/v1'

export const login = (data) => {
    return request({
        url: `${baseUrl}/web/user/login`,
        method: 'post',
        data
    })
}

export const getCaptcha = () => {
    return request({
        url: `${baseUrl}/web/user/code`,
        method: 'get',
    })
}

export const logout = () => {
    return request({
        url: `${baseUrl}/web/user/logout`,
        method: 'post',
    })
}