<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/aporte_nutrimental' }">APORTE NUTRIMENTAL</el-breadcrumb-item>
                            <el-breadcrumb-item>EDITAR</el-breadcrumb-item>
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
                    <el-form-item label="Grupo Alimenticio">
                        <el-input v-model="form.group_name" disabled/>
                    </el-form-item>

                    <el-form-item label="Energía">
                        <el-input v-model="form.energy" type="number" />
                    </el-form-item>

                    <el-form-item label="Proteína">
                        <el-input v-model="form.protein" type="number" />
                    </el-form-item>

                    <el-form-item label="Lípidos">
                        <el-input v-model="form.lipids" type="number" />
                    </el-form-item>

                    <el-form-item label="Hídratos de Carbono">
                        <el-input v-model="form.carbohydrates" type="number" />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Editar
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
                group_name: '', 
                energy: 0, 
                protein: 0, 
                lipids: 0, 
                carbohydrates: 0
            })

            // actions
            const requestInit = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/food_average/${route.params.id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener la información requerida, intente nuevamente por favor')
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

                Object.assign(form, response.data)

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

                if(form.energy.trim() == '' || form.energy < 0 || isNaN(Number(form.energy))) {
                    error = 'Ingrese la energía promedio de este grupo alimenticio'
                }
                else if(form.protein.trim() == '' || form.protein < 0 || isNaN(Number(form.protein))) {
                    error = 'Ingrese la proteína promedio de este grupo alimenticio'
                }
                else if(form.lipids.trim() == '' || form.lipids < 0 || isNaN(Number(form.lipids))) {
                    error = 'Ingrese la cantidad de lípidos promedio de este grupo alimenticio'
                }
                else if(form.carbohydrates.trim() == '' || form.carbohydrates < 0 || isNaN(Number(form.carbohydrates))) {
                    error = 'Ingrese la cantidad de hidratos de carbono promedio de este grupo alimenticio'
                }

                if(error === null) {

                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/food_average/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: {
                            energy: Number(form.energy), 
                            protein: Number(form.protein), 
                            lipids: Number(form.lipids), 
                            carbohydrates: Number(form.carbohydrates)
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado actualizar el aporte nutrimental de este grupo alimenticio, intente nuevamente por favor')
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
                    
                    ElMessage.success('Se ha actualizado con éxito la información')
                    requestInit()
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            // mounted actions
            onMounted(() => {
                requestInit()
            })

            // return component
            return {
                // state
                form,
                // actions
                requestEdit, 
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
