<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>APORTE NUTRIMENTAL</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
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
                                :sortable="item.key != 'actions' ? true : false"
                            >
                                <template #default="scope" v-if="item.key == 'actions'">
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='edit' color='#760000' @click="edit(scope.row.id)"></box-icon>
                                    </div>
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
            let list = reactive([])
            let table_columns = reactive([
                {
                    key: 'id',
                    label: '#',
                    width: 60,
                    fixed: true
                },
                {
                    key: 'actions',
                    label: 'Acciones',
                    width: 120,
                    fixed: true
                },
                {
                    key: 'group_name',
                    label: 'Grupo Alimenticio', 
                    width: 180,
                    fixed: true
                }, 
                {
                    key: 'energy',
                    label: 'Energía',
                }, 
                {
                    key: 'protein',
                    label: 'Proteína',
                }, 
                {
                    key: 'lipids',
                    label: 'Lípidos',
                }, 
                {
                    key: 'carbohydrates',
                    label: 'Hídratos de Carbono'
                }
            ])

            // actions
            const edit = (id) => {
                 // redirect to view
                router.push({
                    name: 'ViewAporteNutrimental',
                    params: {
                        id: id
                    }
                })
            }

            const requestAverage = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/food_average',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el listado de aporte nutrimental, intente nuevamente por favor')
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
                
                list.length = 0
                if(response.data.list !== null) {
                    list.push(...response.data.list)
                }
                
                // Update data and hide loading
                loading.close()
            }

            // request food group
            onMounted(() => {
                requestAverage()
            })

            // return component
            return {
                // state
                list, 
                table_columns, 
                // actions
                edit,  
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
