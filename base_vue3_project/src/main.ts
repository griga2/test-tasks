import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";    
import App from './App.vue'
import router from './router'
import 'vuestic-ui/styles/essential.css';
import 'vuestic-ui/styles/typography.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVuestic())

app.mount('#app')
