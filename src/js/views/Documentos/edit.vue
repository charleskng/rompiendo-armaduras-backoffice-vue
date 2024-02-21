<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/documentos' }">DOCUMENTOS</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>
            
            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Documento
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
                </el-form>
                
                <el-divider />

                <el-row>
                    <el-col :span="24" class="title">
                        Documento
                    </el-col>
                </el-row>

                <el-row justify="center" style="margin-bottom: 20px;">
                    <el-button type="primary" @click="downloadFile()" :disabled="file === null">
                        Descargar PDF
                    </el-button>
                </el-row>

                <el-row justify="center">
                    <file-upload
                        ref="upload"
                        class="el-button el-button--primary"
                        style="margin-bottom: 20px;"
                        v-model="docs_files"
                        name="file"
                        :post-action="upload_endpoint"
                        :headers="upload_headers"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                    >
                        Subir PDF
                    </file-upload>
                </el-row>

                <el-divider />

                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Editar Documento
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
    
    export default {
        setup() {

            // router
            const route = useRoute()
            const router = useRouter()

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
            })
            
            let file = ref(null)
            let docs_files = reactive([])
            let upload_endpoint = ref(`${import.meta.env.VITE_API_SYSTEM_URL}/docs/upload/${route.params.id}`)
            let upload_headers = reactive({
                'session': appStore.session
            })
            
            // actions   
            const requestDocs = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/docs/${route.params.id}`,
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
                        appStore.logout(request, router)
                    }
                    
                    loading.close()
                    return
                }
                
                // set data and hide loading
                form.title = response.data.title
                form.desc = response.data.desc

                if(response.data.url) {
                    let timestamp = (new Date()).getTime()
                    file.value = `${response.data.url}?t=${timestamp}`
                }

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
                    error = 'Ingrese un titulo para el documento'
                }
                else if(form.desc.trim() == '') {
                    error = 'Ingrese una descripción para el documento'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/docs/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: {
                            title: form.title, 
                            desc: form.desc, 
                        }
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado actualizar el documento, intente nuevamente por favor')
                        loading.close()
                        return
                    }
                    response = response.response

                    // request failed
                    if(!response.success) {
                        log.error('API error => ', response.error)

                        if(response.error == 'wrong_session') {
                            ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                            appStore.logout(request, router)
                        }

                        loading.close()
                        return
                    }

                    // show success message
                    ElMessage.success('Se ha actualizado el documento exitosamente')

                    requestDocs()
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
                    // File Format
                    if(!/\.(pdf)$/i.test(newFile.name)) {
                        ElMessage.error('Solo es posible subir documentos PDF')
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
                if(newFile.blob) {
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

                        // File Format
                        if(!/\.(pdf)$/i.test(newFile.name)) {
                            ElMessage.error('Solo es posible subir documentos PDF')
                            loading.close()
                            return
                        }
                    }

                    if(newFile.error && !oldFile.error) {
                        ElMessage.error('No fue posible cargar el documento, intente nuevamente por favor')
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
                                appStore.logout(request, router)
                            }
                            else {
                                ElMessage.error('No fue posible cargar el documento, intente nuevamente por favor')
                            }

                            loading.close()
                            return
                        }

                        let timestamp = (new Date()).getTime()
                        file.value = `${response.data.file_url}?t=${timestamp}`

                        ElMessage.success('Documento cargado con exito')
                        loading.close()
                        return
                    }
                }
                
                // Automatically activate upload
                if(!upload.value.active) {
                    upload.value.active = true
                }
            }

            const downloadFile = () => {
                const link = document.createElement("a")
                const file_url = import.meta.env.VITE_STORAGE + file.value
                link.href = file_url
                link.target = '_blank'
                link.download = `${form.title}.pdf`
                link.click();
            }

            // on mounted
            onMounted(() => {
                requestDocs()
            })

            // return component
            return {
                // state 
                form,
                file, 
                docs_files, 
                upload_endpoint, 
                upload_headers, 
                upload, 
                id: route.params.id, 
                // actions
                requestEdit, 
                inputFilter, 
                inputFile, 
                downloadFile, 
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
