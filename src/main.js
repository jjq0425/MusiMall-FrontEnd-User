import { createApp } from 'vue'
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import pinia from './store'
import '@arco-design/web-vue/dist/arco.css'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import 'virtual:svg-icons-register'



const app = createApp(App)
Message._context = app._context;
app.use(ArcoVue)
app.use(ArcoVueIcon);
app.use(pinia)
app.use(router)
app.mount('#app')
