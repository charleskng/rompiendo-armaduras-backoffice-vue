<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/foro' }">FORO</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>
            
            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Evento
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Titulo">
                        <el-input v-model="form.title" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Descripción">
                        <el-input v-model="form.desc" placeholder="Requerido" type="textarea" />
                    </el-form-item>

                    <el-form-item label="Fecha Evento">
                        <el-date-picker
                            v-model="form.event_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Evento">
                        <el-time-picker
                            v-model="form.event_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="URL">
                        <el-input v-model="form.action" />
                    </el-form-item>

                    <el-form-item label="Fecha Inicial">
                        <el-date-picker
                            v-model="form.start_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Inicial">
                        <el-time-picker
                            v-model="form.start_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Fecha Final">
                        <el-date-picker
                            v-model="form.end_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Final">
                        <el-time-picker
                            v-model="form.end_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>
                </el-form>

                <p class="note">
                    * La fecha y hora inicial/final determinan cuando se va a mostrar este evento en la app del cliente.
                </p>
                
                <el-divider />

                <el-row>
                    <el-col :span="24" class="title">
                        Imagén del Evento
                    </el-col>
                </el-row>

                <el-row justify="center">
                    <div style="margin-bottom: 20px;">
                        <img :src="image" width="600" />
                    </div>
                </el-row>

                <el-row justify="center">
                    <file-upload
                        ref="upload"
                        class="el-button el-button--primary"
                        style="margin-bottom: 20px;"
                        v-model="image_files"
                        name="image"
                        :post-action="upload_endpoint"
                        :headers="upload_headers"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                    >
                        Cambiar Imágen
                    </file-upload>
                </el-row>

                <el-divider />

                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Editar Evento
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import moment from 'moment'
    
    export default {
        setup() {

            // router
            const router = useRouter()
            const route = useRoute()

            // store
            const appStore = useAppStore()

            // plugins
            const log = inject('log')
            const request = inject('request')

            // Refs
            let upload = ref(null)

            // state
            let form = reactive({
                title: '', 
                desc: '', 
                event_date: '', 
                event_hour: '', 
                start_date: '', 
                start_hour: '', 
                end_date: '', 
                end_hour: '', 
                action: ''
            })
            
            let imageDefault = `${import.meta.env.VITE_STORAGE}/images/forum/default.png` 
            let image = ref(imageDefault)
            let image_files = reactive([])
            let upload_endpoint = ref(`${import.meta.env.VITE_API_SYSTEM_URL}/forum/image/${route.params.id}`)
            let upload_headers = reactive({
                'session': appStore.session
            })
            
            // actions   
            const requestForum = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/forum/${route.params.id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se han logrado obtener los datos necesarios, intente nuevamente por favor')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }
                
                // set data and hide loading
                form.title = response.data.title
                form.desc = response.data.desc
                form.event_date = response.data.event_date ? new Date(response.data.event_date) : null
                form.event_hour = response.data.event_date ? new Date(response.data.event_date) : null
                form.start_date = response.data.start_date ? new Date(response.data.start_date) : null
                form.start_hour = response.data.start_date ? new Date(response.data.start_date) : null
                form.end_date = response.data.end_date ? new Date(response.data.end_date) : null
                form.end_hour = response.data.end_date ? new Date(response.data.end_date) : null
                form.action = response.data.action

                let timestamp = (new Date()).getTime()
                image.value = response.data.image 
                    ? `${import.meta.env.VITE_STORAGE}${response.data.image}?t=${timestamp}`
                    : imageDefault

                loading.close()
            }
            
            const requestEdit = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // validate data
                let error = null

                if(form.title.trim() == '') {
                    error = 'Ingrese un titulo para el evento'
                }
                else if(form.desc.trim() == '') {
                    error = 'Ingrese una descripción para el evento'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/forum/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: {
                            title: form.title, 
                            desc: form.desc, 
                            event_date: (form.event_date && form.event_hour) ? `${moment(form.event_date).format('YYYY-MM-DD')} ${moment(form.event_hour).format('HH:mm:00')}` : null, 
                            start_date: (form.start_date && form.start_hour) ? `${moment(form.start_date).format('YYYY-MM-DD')} ${moment(form.start_hour).format('HH:mm:00')}` : null, 
                            end_date: (form.end_date && form.end_hour) ? `${moment(form.end_date).format('YYYY-MM-DD')} ${moment(form.end_hour).format('HH:mm:00')}` : null, 
                            action: form.action
                        }
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado actualizar el evento, intente nuevamente por favor')
                        loading.close()
                        return
                    }
                    response = response.response

                    // request failed
                    if(!response.success) {
                        log.error('API error => ', response.error)

                        if(response.error == 'wrong_session') {
                            ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                            appStore.logout(request)
                        }

                        loading.close()
                        return
                    }

                    // show success message
                    ElMessage.success('Se ha actualizado el evento exitosamente')

                    requestForum()
                    return
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            let inputFilter = (newFile, oldFile, prevent) => {
                if(newFile && !oldFile) {
                    // Image Format
                    if(!/\.(jpeg|jpe|jpg|png)$/i.test(newFile.name)) {
                        ElMessage.error('Solo es posible subir imagenes JPG o PNG')
                        return prevent()
                    }

                    // Image Size
                    let image_size = newFile.file.size/1024/1024
                    let maxSize = 5
                    if(image_size > maxSize) {
                        ElMessage.error('La imágen no debe pesar más de 5 Mb')
                        return prevent()
                    }
                }
                
                // Create a blob field
                newFile.blob = ''
                let URL = (window.URL || window.webkitURL)
                if(URL) {
                    newFile.blob = URL.createObjectURL(newFile.file)
                }
                
                // Thumbnails
                newFile.thumb = ''
                if(newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                    newFile.thumb = newFile.blob
                }
            }

            const inputFile = (newFile, oldFile) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando imágen',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                if (newFile && oldFile) {
                    // update
                    if(newFile.active && !oldFile.active) {
                        // beforeSend

                        // Image Format
                        if(!/\.(jpeg|jpe|jpg|png)$/i.test(newFile.name)) {
                            ElMessage.error('Solo es posible subir imagenes JPG o PNG')
                            loading.close()
                            return
                        }

                        // Image Size
                        let image_size = newFile.file.size/1024/1024
                        let maxSize = 5
                        if(image_size > maxSize) {
                            ElMessage.error('La imágen no debe pesar más de 5 Mb')
                            return prevent()
                        }
                    }

                    if(newFile.error && !oldFile.error) {
                        ElMessage.error('No fue posible cargar la imágen, intente nuevamente por favor')
                        loading.close()
                        return
                    }

                    if(newFile.success && !oldFile.success) {
                        let response = JSON.parse(newFile.xhr.response)
                        log.debug(response)
                        
                        // request failed
                        if(!response.success) {
                            log.error('API error => ', response.error)

                            if(response.error == 'wrong_session') {
                                ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                                appStore.logout(request)
                            }
                            else {
                                ElMessage.error('No fue posible cargar la imágen, intente nuevamente por favor')
                            }

                            loading.close()
                            return
                        }

                        let timestamp = (new Date()).getTime()
                        image.value = `${import.meta.env.VITE_STORAGE}${response.data.image_url}?t=${timestamp}`

                        ElMessage.success('Imagén cargada con exito')
                        loading.close()
                        return
                    }
                }
                
                // Automatically activate upload
                if(!upload.value.active) {
                    upload.value.active = true
                }
            }

            // on mounted
            onMounted(() => {
                requestForum()
            })

            // return component
            return {
                // state 
                form,
                image, 
                image_files, 
                upload_endpoint, 
                upload_headers, 
                upload, 
                id: route.params.id, 
                // actions
                requestEdit, 
                inputFilter, 
                inputFile
            }
        }
    }
</script>

<style scoped lang="scss">
    // Globals SCSS
    @import '~/app.scss';
    
    .container {
        padding: 20px;
    }

    .app-breadcrumb {
        height: 20px;
    }

    .title {
        color: $primary-color;
        font-family: Bold;
        text-align: center;
        margin-bottom: 20px;
    }

     .note {
        color: $primary-color;
        font-family: BoldItalic;
        font-size: 12px;
        margin-bottom: 20px;
    }

</style>
