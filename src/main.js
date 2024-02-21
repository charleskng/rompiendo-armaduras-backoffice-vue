// init vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

// create app
import App from '@/App'
const app = createApp(App)

// element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

// box icons
import 'boxicons'

// upload component
import VueUploadComponent from 'vue-upload-component'
app.component('file-upload', VueUploadComponent)

// router
import router from '@/router'
app.use(router)

// store
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)

// request plugin
import log from '@/plugins/log'
app.use(log, {
    show: import.meta.env.VITE_DEBUG,
})

import request from '@/plugins/request'
app.use(request)

// common plugin
import common from '@/plugins/common'
app.use(common)

// import styles
import '~/fonts/font.css'
import '~/theme.scss'

// Mount App
app.mount('#app')
