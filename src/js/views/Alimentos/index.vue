<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>ALIMENTOS</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24">
                        <el-select
                            v-model="select_columns"
                            multiple
                            placeholder="Selección Columnas"
                            style="width: 600px; padding-right: 20px;"
                        >
                            <el-option
                                v-for="(item, index) of food_columns"
                                :key="`column_selector_${index}`"
                                :label="item.label"
                                :value="item.key"
                            />
                        </el-select>

                        <el-select
                            v-model="group_id"
                            class="select-group"
                            placeholder="Grupo Alimenticio"
                            size="large"
                            @change="requestList()"
                        >
                            <el-option
                                v-for="group in food_group"
                                :key="`group_${group.id}`"
                                :label="group.name"
                                :value="group.id"
                            />
                        </el-select>
                    </el-col>

                    <el-col :span="24" style="margin-top: 20px;">
                        <el-button type="primary" @click="addFood()">
                            Agregar
                        </el-button>
                    </el-col>

                    <el-col :span="24">
                        <el-table
                            class="table"
                            :max-height="600"
                            :data="food_list"
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
                                        <box-icon name='edit' color='#760000' @click="editFood(scope.row.id)"></box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='trash' color='#760000' @click="deleteFood(scope.row.id, scope.row.name)"></box-icon>
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
    import { ref, reactive, inject, onMounted } from 'vue'
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

            // state
            let group_id = ref(null)
            let food_group = reactive([])
            let food_list = reactive([])
            let table_columns = reactive([])

            let select_columns = ref([
                'quantity',
                'unity',
                'gross_weight',
                'net_weight',
                'energy',
                'protein',
                'lipids',
                'carbohydrates'
            ])

            let food_columns = ref([
                {
                    key: 'quantity',
                    label: 'Cantidad',
                    width: 150
                }, {
                    key: 'unity',
                    label: 'Unidad',
                    width: 150
                }, {
                    key: 'gross_weight',
                    label: 'Peso Bruto (g)',
                    width: 150
                }, {
                    key: 'net_weight',
                    label: 'Peso Neto (g)',
                    width: 150
                }, {
                    key: 'energy',
                    label: 'Energía (kcal)',
                    width: 150
                }, {
                    key: 'protein',
                    label: 'Proteína (g)',
                    width: 150
                }, {
                    key: 'lipids',
                    label: 'Lipidos (g)',
                    width: 150
                },
                {
                    key: 'carbohydrates',
                    label: 'Hidratos de carbono (g)',
                    width: 150
                },
                {
                    key: 'sodium',
                    label: 'Sodio (mg)',
                    width: 150
                },
                {
                    key: 'sugar_equivalents',
                    label: 'Azúcar por equivalente',
                    width: 100
                },
                {
                    key: 'glycermic_index',
                    label: 'Índice glicérmico',
                    width: 150
                },
                {
                    key: 'glycermic_load',
                    label: 'Carga glicérmica',
                    width: 150
                },
                {
                    key: 'saturated_fatty_acids',
                    label: 'AG Saturados (g)',
                    width: 150
                },
                {
                    key: 'monounsaturated_fatty_acids',
                    label: 'AG Monoinsatudos (g)',
                    width: 150
                },
                {
                    key: 'polyunsaturated_fatty_acids',
                    label: 'AG Poliinsaturadas (g)',
                    width: 150
                },
                {
                    key: 'cholesterol',
                    label: 'Colesterol (mg)',
                    width: 150
                },
                {
                    key: 'vitamin_a',
                    label: 'Vitamína A (ug RE)',
                    width: 150
                },
                {
                    key: 'calcium',
                    label: 'Calcio (mg)',
                    width: 150
                },
                {
                    key: 'non_heme_iron',
                    label: 'Hierro NO HEM (mg)',
                    width: 150
                },
                {
                    key: 'heme_iron',
                    label: 'Hierro HEM (mg)',
                    width: 150
                },
                {
                    key: 'selenium',
                    label: 'Selenio (mg)',
                    width: 150
                },
                {
                    key: 'phosphorous',
                    label: 'Fósforo (mg)',
                    width: 150
                },
                {
                    key: 'potassium',
                    label: 'Potasio (mg)',
                    width: 150
                },
                {
                    key: 'fibers',
                    label: 'Fibras (g)',
                    width: 150
                },
                {
                    key: 'ascorbic_acid',
                    label: 'Ácido Ascórbico (mg)',
                    width: 150
                },
                {
                    key: 'folic_acid',
                    label: 'Ácido Fólico (ug)',
                    width: 150
                }
            ])

            // actions
            const requestSelect = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/food/select',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de alimentos, intente nuevamente por favor')
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
                food_group.length = 0
                food_group.push(...response.data.select)
                group_id.value = null
                loading.close()
            }

            const requestList = async() => {
                if(group_id == null) {
                    return
                }

                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request food list
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/food/list/${group_id._value}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de alimentos, intente nuevamente por favor')
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

                // Update list
                food_list.length = 0
                food_list.push(...response.data.list)

                // Update columns
                let columns_active = [{
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
                    key: 'name',
                    label: 'Nombre',
                    width: 200,
                    fixed: true,
                }]

                for(let col of food_columns._value) {
                    if(select_columns._value.includes(col.key)) {
                        columns_active.push(col)
                    }
                }

                table_columns.length = 0
                table_columns.push(...columns_active)

                // Hide Loading
                loading.close()
            }

            const editFood = async(id) => {
                router.push({
                    name: 'EditAlimentos',
                    params: {
                        id: id
                    }
                })
            }

            const deleteFood = async(id, name) => {
                log.debug('Delete food => ', id, name)
                
                ElMessageBox.confirm(`Se va a eliminar de la lista "${name}" con id ${id}, ¿Deseas continuar?`)
                .then(() => {
                    requestDelete(id)
                })
                .catch(() => {
                    log.debug('Delete food cancelled')
                })
            }

            const requestDelete = async(id) => {
                log.debug('requestDelete => ', id)

                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request food list
                let response = await request.send({
                    method: 'DELETE',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/food/${id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado eliminar el registro del listado de alimentos, intente nuevamente por favor')
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
                else {
                    ElMessage.success('Se ha eliminado el registro del listado de alimentos')
                    requestList()
                }

                // Hide Loading
                loading.close()
            }

            const addFood = async() => {
                router.push({
                    name: 'AddAlimentos'
                })
            }

            // request food group
            onMounted(() => {
                requestSelect()
            })

            // return component
            return {
                // state
                group_id,
                food_group,
                food_list,
                select_columns,
                food_columns,
                table_columns,
                // actions
                requestSelect,
                requestList,
                editFood,
                deleteFood,
                addFood
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
