import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        token: '',
        tokenExpiry: null,
    }),
    actions: {
        setUserInfo({ username, token, expiresIn }) {
            this.username = username;
            this.token = token;
            this.tokenExpiry = expiresIn;
            localStorage.setItem('token', token);
        },
        clearUserInfo() {
            this.username = '';
            this.token = '';
            this.tokenExpiry = null;
        },
    },
});
