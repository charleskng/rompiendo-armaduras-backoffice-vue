<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>INTERVENCIÓN MULTIDISCIPLINARIA</el-breadcrumb-item>
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
                                <template #default="scope" v-if="item.key == 'actions'">
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='edit' color='#760000' @click="edit(scope.row.id)"></box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='trash' color='#760000' @click="deleteItem(scope.row.id, scope.row.name)"></box-icon>
                                    </div>
                                </template>
                                <template #default="scope" v-if="item.key == 'image'">
                                    <img v-if="scope.row.image" :src="scope.row.image" width="100" />
                                    <img v-else :src="imageDefault" width="100" />
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
    import { reactive, ref, inject, onMounted } from 'vue'
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

            // state
            let imageDefault = ref(`${import.meta.env.VITE_STORAGE}/images/multidisciplinary_intervention/default.png`)
            let list = reactive([])
            let table_columns = reactive([
                {
                    key: 'id',
                    label: '#',
                    width: 60,
                },
                {
                    key: 'actions',
                    label: 'Acciones',
                    width: 120,
                },
                {
                    key: 'name',
                    label: 'Servicio', 
                }, 
                {
                    key: 'address',
                    label: 'Dirección',
                }, 
                {
                    key: 'general_data',
                    label: 'Datos Generales',
                }, 
                {
                    key: 'image',
                    label: 'Imágen',
                }
            ])

            // actions
            const add = async() => {
                router.push({
                    name: 'AddIntervencionMultidisciplinaria'
                })
            }
            
            const edit = (id) => {
                 // redirect to view
                router.push({
                    name: 'EditIntervencionMultidisciplinaria',
                    params: {
                        id: id
                    }
                })
            }

            const deleteItem = (id, name) => {
                ElMessageBox.confirm(`¿Quieres eliminar el servicio "${name}" con id ${id}?`)
                .then(() => {
                    requestDelete(id)
                })
                .catch(() => {
                    log.debug('Delete food cancelled')
                })
            }

            const requestMultidisciplinaryIntervention = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/multidisciplinary_intervention',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
    
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el listado de servicios, intente nuevamente por favor')
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
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/multidisciplinary_intervention/${id}`,
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
                requestMultidisciplinaryIntervention()
            }

            // request food group
            onMounted(() => {
                requestMultidisciplinaryIntervention()
            })

            // return component
            return {
                // state
                imageDefault,
                list, 
                table_columns, 
                // actions
                add, 
                edit, 
                deleteItem, 
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
