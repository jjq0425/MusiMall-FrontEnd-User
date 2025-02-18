import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        token: '',
        tokenExpiry: null,
    }),
    actions: {
        setUserInfo({ username, token, tokenExpiry }) {
            this.username = username;
            this.token = token;
            this.tokenExpiry = tokenExpiry;
        },
        clearUserInfo() {
            this.username = '';
            this.token = '';
            this.tokenExpiry = null;
        },
    },
});
