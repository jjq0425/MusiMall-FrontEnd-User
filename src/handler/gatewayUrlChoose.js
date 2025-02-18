export const gatewayUrlChoose = (url) => {
    // 根据url选择对应的网关
    let apiSet = JSON.parse(localStorage.getItem('api'));
    if (apiSet.withGateWay) {
        return apiSet.baseUrlWithGateWay + url;
    }
    else {
        // url都是以/api/product/v1 /api/order/v1开头的,所以需要找到api后面,v1前面的模块名
        let moduleName = extractModuleName(url);
        if (moduleName) {
            let baseurl = apiSet.baseUrlWithoutGateWay.find(item => item.title === moduleName).url;
            baseurl = baseurl + baseurl.endsWith('/') ? baseurl : baseurl + '/';
            // 把url中/api/moduleName/v1替换成空
            return url.replace(`/api/${moduleName}/`, baseurl);
        }
    }
}

function extractModuleName(url) {
    // 正则表达式匹配 /api/ 后面和 /v1 前面的部分
    const regex = /\/api\/(.*?)\/v1/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1]; // 返回匹配的模块名
    } else {
        return null; // 如果没有匹配到，返回null
    }
}

// 如果使用网关，需要剥离外层的response
export const NeedOuterResponsePrase = (url) => {

    let apiSet = JSON.parse(localStorage.getItem('api'));
    if (apiSet.withGateWay) {
        return true;
    } else {
        return false;
    }
}
