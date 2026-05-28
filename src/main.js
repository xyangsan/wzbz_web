import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import('@vant/touch-emulator')

import { Picker, Swipe, SwipeItem } from 'vant'
import 'vant/lib/index.css'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@vant/touch-emulator'

const app = createApp(App)
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key])
})
app.use(ElementPlus, { size: 'medium' })
app.use(Picker).use(store).use(router).mount('#app')
app.use(Swipe)
app.use(SwipeItem)

export default app

// const vconsole = require('vconsole')
// app.config.globalProperties.$vconsole = new vconsole() // 使用vconsole