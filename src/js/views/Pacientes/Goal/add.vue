<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/pacientes' }">PACIENTES</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: `/pacientes/ver/${ id }` }">{{ id }}</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: `/pacientes/metas/${ id }` }">METAS</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Meta
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Descripción">
                        <el-input v-model="form.desc" type="textarea" />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar Meta
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'

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

            // state
            let form = reactive({
                desc: ''
            })
            
            // actions
            const requestAdd = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Guardando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // Validate form
                let error = null

                if(form.desc.trim() == '') {
                    error = 'Ingrese la descripción de la meta'
                }
                
                if(error === null) {
                    // request list data
                    let response = await request.send({
                        method: 'POST',
                        url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/goal/add`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: form
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado guardar esta meta, intente nuevamente por favor')
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

                    // Redirect to edit view
                    ElMessage.success('Meta guardada exitosamente')
                    
                    router.push({
                        name: 'EditGoalPacientes',
                        params: {
                            id: route.params.id, 
                            goal_id: response.data.goal_id
                        }
                    })
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                // Update data and hide loading
                loading.close()
            }

            // on mounted
            onMounted(() => {
            })
            
            // return component
            return {
                // state 
                form, 
                id: route.params.id, 
                // actions
                requestAdd, 
            }
        }
    }
</script>

<style scoped lang="scss">
    // Globals SCSS
    @import '~/app.scss';
    
    .container {
        padding: 20px;

        .app-breadcrumb {
            height: 20px;
        }
    }

    .app-breadcrumb {
        height: 20px;
    }

    .title {
        color: $primary-color;
        font-family: Bold;
        text-align: center;
        margin-bottom: 20px;
        margin-top: 10px;
    }
</style>
