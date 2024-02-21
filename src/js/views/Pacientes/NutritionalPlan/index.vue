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
                            <el-breadcrumb-item>PLAN NUTRICIONAL</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="text-right">
                        <el-button type="primary" @click="add()">
                            Agregar
                        </el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-table
                            class="table"
                            :max-height="600"
                            :data="list"
                            style="width: 100%"
                            border
                            stripe
                        >
                            <el-table-column
                                v-for="(item, index) of table_columns"
                                :key="`column_${index}`"
                                :prop="item.key"
                                :label="item.label"
                                :fixed="item.fixed"
                                :width="item.width"
                                :min-width="item.min_width"
                                :sortable="item.key != 'actions' ? true : false"
                            >
                                <template #default="scope" v-if="item.key == 'actions'">
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='edit' color='#760000' @click="edit(scope.row.id)"></box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='trash' color='#760000' @click="deleteItem(scope.row.id)"></box-icon>
                                    </div>
                                </template>
                                <template #default="scope" v-if="item.key == 'creation'">
                                    {{ dateShort({ date: scope.row.creation, with_time: true }) }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
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
            const common = inject('common')

            // state
            let list = reactive([])
            let table_columns = reactive([
                {
                    key: 'id',
                    label: '#',
                    width: 60
                },
                {
                    key: 'actions',
                    label: 'Acciones',
                    width: 120
                },
                {
                    key: 'calories',
                    label: 'Calorías', 
                    min_width: 120
                }, 
                {
                    key: 'creation',
                    label: 'Creación', 
                    width: 160
                }
            ])

            // actions
            const requestPlanes = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/nutritional_plan`,
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

                // set state and hide loading
                list.length = 0
                if(response.data.list !== null) {
                    list.push(...response.data.list)
                }

                loading.close()
            }

            const add = () => {
                 // redirect to view
                router.push({
                    name: 'AddNutritionalPlanPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            const edit = (plan_id) => {
                log.debug({
                    id: route.params.id, 
                    plan_id: plan_id
                })

                 // redirect to view
                router.push({
                    name: 'EditNutritionalPlanPacientes',
                    params: {
                        id: route.params.id, 
                        plan_id: plan_id
                    }
                })
            }

            const deleteItem = (plan_id) => {
                ElMessageBox.confirm(`¿Quieres eliminar el plan con id ${plan_id}?`)
                .then(() => {
                    requestDelete(plan_id)
                })
                .catch(() => {
                    log.debug('Delete food cancelled')
                })
            }

            const requestDelete = async(plan_id) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'DELETE',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/nutritional_plan/${plan_id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado eliminar el plan nutricional, intenta nuevamente por favor')
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
                
                // Update data and hide loading
                requestPlanes()
            }

            // request food group
            onMounted(() => {
                requestPlanes()
            })

            // return component
            return {
                // state
                list, 
                table_columns, 
                id: route.params.id, 
                // actions
                add, 
                edit, 
                deleteItem, 
                dateShort: common.dateShort
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding: 20px;

        .app-breadcrumb {
            height: 20px;
        }
        
        .table {
            margin-top: 20px;

            .table-icon {
                float: left;
                margin-right: 10px;
            }
        }
    }
</style>
