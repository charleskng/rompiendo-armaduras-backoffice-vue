<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/membresia' }">MEMBRESIA</el-breadcrumb-item>
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
                    <el-form-item label="Nombre de la membresía">
                        <el-input v-model="form.name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Estatus">
                        <el-select
                            v-model="form.active"
                            style="width: 100%;"
                        >
                            <el-option label="Activo" value="Activo" />
                            <el-option label="Inactivo" value="Inactivo" />
                        </el-select>
                    </el-form-item>
                </el-form> 
                
                <el-row>
                    <el-col :span="24" class="title">
                        Beneficios
                    </el-col>

                    <el-col :span="24" class="text-right" style="margin-bottom: 20px;">
                        <el-button type="primary" @click="addBenefit()">
                            Agregar Beneficio
                        </el-button>
                    </el-col>
                </el-row>
                
                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-row 
                        v-for="(benefit, index) of form.benefits"
                        :key="`benefit_${index}`"
                    >
                        <el-col :span="20">
                            <el-form-item :label="`Beneficio ${Number(index) + 1}`">
                                <el-input v-model="benefit.desc" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" :offset="1">
                            <el-button type="primary" @click="deleteBenefit(index)">
                                Eliminar
                            </el-button>
                        </el-col>
                    </el-row>
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
    import { ref, reactive, inject, onMounted } from 'vue'
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
                name: '', 
                active: 'Activo', 
                benefits: [{
                    desc: ''
                }]
            })

            // actions
            const addBenefit = () => {
                form.benefits.push({
                    desc: ''
                })
            }

            const deleteBenefit = (index) => {
                if(form.benefits.length > 1) {
                    const new_benefits = [...form.benefits]
                    new_benefits.splice(index, 1)

                    form.benefits.length = 0
                    form.benefits.push(...new_benefits)
                }
            }
            
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
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/membership/${route.params.id}`,
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

                if(response.data.benefits == null) {
                    response.data.benefits = [{
                        desc: ''
                    }]
                }

                response.data.active = response.data.active ? 'Activo' : 'Inactivo'

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

                if(form.name.trim() == '') {
                    error = 'Ingrese un nombre para la membresía'
                }

                if(error === null) {
                    let accepted_benefits = []

                    for(let benefit of form.benefits) {
                        if(benefit.desc.trim() !== '') {
                            accepted_benefits.push({
                                desc: benefit.desc.trim()
                            })
                        }
                    }

                    // request selector data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_SYSTEM_URL}/membership/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: {
                            name: form.name, 
                            active: form.active == 'Activo', 
                            benefits: accepted_benefits
                        }
                    })

                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado agregar la membresía, intente nuevamente por favor')
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
                    
                    ElMessage.success('Se ha actualizado con éxito la información de la membresía')
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
                addBenefit, 
                deleteBenefit, 
                requestEdit
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
