<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/intervencion_multidisciplinaria' }">INTERVENCIÓN MULTIDISCIPLINARIA</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>
            
            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Intervención Multidisciplinaria
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Servicio">
                        <el-input v-model="form.name" placeholder="Requerido" />
                    </el-form-item>
                    
                    <el-form-item label="Dirección">
                        <el-input v-model="form.address" placeholder="Requerido" type="textarea" />
                    </el-form-item>

                    <el-form-item label="Datos Generales">
                        <el-input v-model="form.general_data" placeholder="Requerido" type="textarea" />
                    </el-form-item>
                </el-form>
                
                <el-divider />

                <el-row>
                    <el-col :span="24" class="title">
                        Imagén del Servicio
                    </el-col>
                </el-row>

                <el-row justify="center">
                    <div style="margin-bottom: 20px;">
                        <img v-if="image" :src="image" width="600" onerror="this.src='/sistema/images/multidisciplinary_intervention/default.png';" />
                        <img v-else src="/sistema/images/multidisciplinary_intervention/default.png" width="600" />
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
                        Editar Servicio
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
                name: '', 
                address: '', 
                general_data: ''
            })
            
            let image = ref(null)
            let image_files = reactive([])
            let upload_endpoint = ref(`${import.meta.env.VITE_API_SYSTEM_URL}/multidisciplinary_intervention/image/${route.params.id}`)
            let upload_headers = reactive({
                'session': appStore.session
            })
            
            // actions   
            const requestNews = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/multidisciplinary_intervention/${route.params.id}`,
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
                form.name = response.data.name
                form.address = response.data.address
                form.general_data = response.data.general_data

                let timestamp = (new Date()).getTime()
                image.value = `${response.data.image}?t=${timestamp}`

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

                if(form.name.trim() == '') {
                    error = 'Ingrese un nombre para este servicio'
                }
                else if(form.address.trim() == '') {
                    error = 'Ingrese un domicilio para este servicio'
                }
                else if(form.general_data.trim() == '') {
                    error = 'Ingrese los datos generales para este servicio'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/multidisciplinary_intervention/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: form
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado actualizar el servicio, intente nuevamente por favor')
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
                    ElMessage.success('Se ha actualizado el servicio exitosamente')

                    requestNews()
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
                        image.value = `${response.data.image_url}?t=${timestamp}`

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
                requestNews()
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
    
</style>
