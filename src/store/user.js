import { defineStore } from 'pinia';
import router from "@/router";
import { logout } from "@/api/auth";

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
            localStorage.removeItem('token');
            logout();
            router.push({ name: 'Login' });
        },
    },
});
