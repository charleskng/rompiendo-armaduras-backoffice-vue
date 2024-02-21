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
                            <el-breadcrumb-item>MEDICIONES</el-breadcrumb-item>
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

                <template 
                    v-for="(item, index) of table_columns"
                    :key="`chart_${index}`"
                >
                    <template v-if="!['id', 'actions', 'creation'].includes(item.key)">
                        <el-divider />

                        <el-row>
                            <el-col :span="24" class="title">
                                <span>
                                    {{ item.label }}
                                </span>
                            </el-col>
                        </el-row>

                        <LineChart 
                            :chartData="buildChartData(item.key)" 
                            :options="chartOptions"
                        />
                    </template>
                </template>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, ref, inject, onMounted, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import { Chart, registerables } from 'chart.js'
    import { LineChart } from 'vue-chart-3'
    import moment from 'moment'

    export default {
        components: {
            LineChart,
        },
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

            // chart
            const chartOptions = ref({
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }, 
                    title: {
                        display: false
                    }
                }
            })

            Chart.register(...registerables)

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
                    key: 'creation',
                    label: 'Fecha', 
                    width: 180, 
                }, 
                {
                    key: 'weight_kg',
                    label: 'Peso Kg', 
                    min_width: 100, 
                }, 
                {
                    key: 'fat_percentage',
                    label: '% Grasa', 
                    min_width: 100, 
                }, 
                {
                    key: 'fat_kg',
                    label: 'Kg Grasa', 
                    min_width: 140, 
                }, 
                {
                    key: 'muscle_kg',
                    label: 'Kg Músculo', 
                    min_width: 160, 
                }, 
                {
                    key: 'bone_mass',
                    label: 'Masa Ósea', 
                    min_width: 140, 
                }, 
                {
                    key: 'bmi',
                    label: 'IMC', 
                    min_width: 160, 
                }, 
                {
                    key: 'metabolic_age',
                    label: 'Edad Metabólica', 
                    min_width: 100, 
                }, 
                {
                    key: 'water_percentage',
                    label: '% Agua', 
                    min_width: 100, 
                }, 
                {
                    key: 'visceral_fat',
                    label: 'Grasa Viceral', 
                    min_width: 100, 
                }, 
                {
                    key: 'waist_circumference',
                    label: 'Circunferencia de Cintura', 
                    min_width: 220, 
                }, 
                {
                    key: 'abdomen_circumference',
                    label: 'Circunferencia de Abdomen', 
                    min_width: 240, 
                }, 
                {
                    key: 'hip_circumference',
                    label: 'Circunferencia de Cadera', 
                    min_width: 220, 
                }
            ])

            // actions
            const requestMeasurements = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request selector data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/measurement`,
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
                    name: 'AddMeasurementPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            const edit = (measurement_id) => {
                 // redirect to view
                router.push({
                    name: 'EditMeasurementPacientes',
                    params: {
                        id: route.params.id, 
                        measurement_id: measurement_id
                    }
                })
            }

            const deleteItem = (measurement_id) => {
                ElMessageBox.confirm(`¿Quieres eliminar las mediciones con id ${measurement_id}?`)
                .then(() => {
                    requestDelete(measurement_id)
                })
                .catch(() => {
                    log.debug('Delete measurement cancelled')
                })
            }

            const requestDelete = async(measurement_id) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'DELETE',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/measurement/${measurement_id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se han logrado eliminar las mediciones del paciente, intenta nuevamente por favor')
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
                requestMeasurements()
            }

            const buildChartData = (key) => {
                const labels = []
                const values = []
                const backgroundColors = []

                for(let measurement of list) {
                    let creation = common.dateShort({
                        date: measurement.creation
                    })

                    labels.unshift(creation)
                    values.unshift(measurement[key])
                    backgroundColors.unshift('#760000')
                }
                
                return {
                    labels,
                    datasets: [{
                        data: values, 
                        backgroundColor: backgroundColors
                    }]
                }
            }

            // request food group
            onMounted(() => {
                requestMeasurements()
            })

            // return component
            return {
                // state
                list, 
                table_columns, 
                id: route.params.id, 
                chartOptions, 
                // actions
                add, 
                edit, 
                deleteItem, 
                buildChartData, 
                dateShort: common.dateShort
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
            margin-top: 10px;
        }
    }
</style>
