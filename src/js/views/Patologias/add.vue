<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/patologias' }">PATOLOGÍAS</el-breadcrumb-item>
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
                    <el-form-item label="Nombre de Patología">
                        <el-input v-model="form.name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Descripción">
                        <el-input v-model="form.desc" placeholder="Requerido" type="textarea" />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar
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
                name: '',
                desc: '',
            })

            // actions
            const requestAdd = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate form
                let error = null
                if(form.name.trim() == '') {
                    error = 'Ingrese el nombre del alimento'
                }
                else if(form.desc.trim() == '') {
                    error = 'Ingrese descripción'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'POST',
                        url: import.meta.env.VITE_API_SYSTEM_URL + '/pathology/add',
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: form
                    })

                    // request error
                    if(!response.success) {
                        error = 'No se ha logrado agregar el registro a la lista de patologías, por favor intente nuevamente'
                    }
                    else {
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
                        else {
                            ElMessage.success('Se ha agregado el registro al listado de patologías')

                            router.push({
                                name: 'EditPatologias',
                                params: {
                                    id: response.data.pathology_id
                                }
                            })
                        }
                    }
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

<style scoped>
    .container {
        padding: 20px;
    }

    .app-breadcrumb {
        height: 20px;
    }

</style>
