import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
    state: () => ({
        withGateWay: true, // 是否使用网关
        baseUrlWithGateWay: 'http://localhost:8020',
        baseUrlWithoutGateWay: [
            {
                title: 'auth',
                url: 'http://localhost:8021'
            },
            {
                title: 'gateway',
                url: 'https://gateway.example.com'
            },
            {
                title: 'order',
                url: 'http://localhost:8023'
            },
            {
                title: 'product',
                url: 'http://localhost:8026'
            },
            {
                title: 'ai',
                url: 'https://ai.example.com'
            },
            {
                title: 'coin',
                url: 'https://coin.example.com'
            }
        ],
        payUrl: 'http://124.221.142.75:50010'
    }),
    actions: {
        setWithGateWay(value) {
            this.withGateWay = value;
            this.setInlocalStorage();
        },
        setBaseUrlWithGateWay(url) {
            this.baseUrlWithGateWay = url;
            this.setInlocalStorage();
        },
        setBaseUrlWithoutGateWay(title, url) {
            const index = this.baseUrlWithoutGateWay.findIndex(item => item.title === title);
            if (index !== -1) {
                this.baseUrlWithoutGateWay[index].url = url;
            }
            this.setInlocalStorage();
        },
        setInlocalStorage() {
            localStorage.setItem('api', JSON.stringify(this.$state));
        },
        setPayUrl(url) {
            this.payUrl = url;
            this.setInlocalStorage();
        }
    }
});
