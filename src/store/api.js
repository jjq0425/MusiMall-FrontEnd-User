import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
    state: () => ({
        withGateWay: true, // 是否使用网关
        baseUrlWithGateWay: 'https://api.example.com',
        baseUrlWithoutGateWay: [
            {
                title: 'auth',
                url: 'https://auth.example.com'
            },
            {
                title: 'gateway',
                url: 'https://gateway.example.com'
            },
            {
                title: 'order',
                url: 'https://order.example.com'
            },
            {
                title: 'product',
                url: 'https://product.example.com'
            },
            {
                title: 'ai',
                url: 'https://ai.example.com'
            },
            {
                title: 'coin',
                url: 'https://coin.example.com'
            }
        ]
    }),
    actions: {
        setWithGateWay(value) {
            this.withGateWay = value;
        },
        setBaseUrlWithGateWay(url) {
            this.baseUrlWithGateWay = url;
        },
        setBaseUrlWithoutGateWay(title, url) {
            const index = this.baseUrlWithoutGateWay.findIndex(item => item.title === title);
            if (index !== -1) {
                this.baseUrlWithoutGateWay[index].url = url;
            }
        }
    }
});
