<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/documentos' }">DOCUMENTOS</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Titulo">
                        <el-input v-model="form.title" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Descipción">
                        <el-input v-model="form.desc" placeholder="Requerido" type="textarea" />
                    </el-form-item>
                </el-form> 

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar Documento
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'

    export default {
        setup() {

            // router
            const router = useRouter()

            // store
            const appStore = useAppStore()

            // plugins
            const log = inject('log')
            const request = inject('request')

            // state
            let form = reactive({
                title: '', 
                desc: ''
            })

            // actions            
            const requestAdd = async() => {
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
                        method: 'POST',
                        url: import.meta.env.VITE_API_SYSTEM_URL + '/docs/add',
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
                        ElMessage.error('No se ha logrado agregar el documento, intente nuevamente por favor')
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
                    ElMessage.success('Se ha agregado el documento exitosamente')

                    // redirect to view
                    router.push({
                        name: 'EditDocumentos',
                        params: {
                            id: response.data.doc_id
                        }
                    })
                    return
                }
                
                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            // return component
            return {
                // state
                form,
                // actions
                requestAdd
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
