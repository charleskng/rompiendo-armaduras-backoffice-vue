<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>FORO</el-breadcrumb-item>
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
                                :sortable="item.key != 'actions' ? true : false"
                            >
                                <template #default="scope" v-if="item.key == 'order'">
                                    <span v-if="scope.row.order">
                                        {{ scope.row.order }}
                                    </span>
                                    <span v-else>
                                        N/A
                                    </span>
                                </template>
                                <template #default="scope" v-if="item.key == 'event_date'">
                                    {{ scope.row.event_date ? dateShort({ date: scope.row.event_date, with_time: true }) : '---' }}
                                </template>
                                <template #default="scope" v-if="item.key == 'start_date'">
                                    {{ scope.row.start_date ? dateShort({ date: scope.row.start_date, with_time: true }) : '---' }}
                                </template>
                                <template #default="scope" v-if="item.key == 'end_date'">
                                    {{ scope.row.end_date ? dateShort({ date: scope.row.end_date, with_time: true }) : '---' }}
                                </template>
                                <template #default="scope" v-if="item.key == 'actions'">
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='edit' color='#760000' @click="edit(scope.row.id)"></box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='trash' color='#760000' @click="deleteItem(scope.row.id, scope.row.title)"></box-icon>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                
                <el-row style="margin-top:20px;">
                    <el-col :span="24" class="text-center">
                        <el-button type="primary" @click="editOrder()">
                            Ediar Orden
                        </el-button>
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
                    key: 'title',
                    label: 'Titulo'
                }, 
                {
                    key: 'order',
                    label: 'Orden',
                    width: 100,
                }, 
                {
                    key: 'event_date',
                    label: 'Fecha Evento',
                    width: 160,
                }, 
                {
                    key: 'start_date',
                    label: 'Fecha Inicial',
                    width: 160,
                }, 
                {
                    key: 'end_date',
                    label: 'Fecha Final',
                    width: 160,
                }
            ])

            // actions
            const add = async() => {
                router.push({
                    name: 'AddForo'
                })
            }

            const edit = (id) => {
                 // redirect to view
                router.push({
                    name: 'EditForo',
                    params: {
                        id: id
                    }
                })
            }

            const deleteItem = (id, title) => {
                ElMessageBox.confirm(`¿Quieres eliminar la foro "${title}" con id ${id}?`)
                .then(() => {
                    requestDelete(id)
                })
                .catch(() => {
                    log.debug('Delete food cancelled')
                })
            }

            const requestForum = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/forum',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
    
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el listado de foro, intente nuevamente por favor')
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

            const requestDelete = async(id) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'DELETE',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/forum/${id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado eliminar esta noticia, intenta nuevamente por favor')
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
                requestForum()
            }

            const editOrder = async() => {
                router.push({
                    name: 'OrderForo'
                })
            }

            // request food group
            onMounted(() => {
                requestForum()
            })

            // return component
            return {
                // state
                list, 
                table_columns, 
                // actions
                add, 
                edit, 
                deleteItem, 
                editOrder, 
                dateShort: common.dateShort, 
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

        .table {
            margin-top: 20px;

            .table-icon {
                float: left;
                margin-right: 10px;
            }
        }

        .title {
            color: $primary-color;
            font-family: Bold;
            text-align: center;
            margin-bottom: 20px;
        }
    }
</style>
