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
                            <el-breadcrumb-item :to="{ path: `/pacientes/mediciones/${ id }` }">MEDICIONES</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Mediciones
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="screen.width <= 576 ? 'top' : 'left'"
                >
                    <template 
                        v-for="(measurement, index) of measurement_keys"
                        :key="`form_item_${index}`"
                    >
                        <el-form-item 
                            :label="measurement.label"
                        >
                            <el-input 
                                v-model="form[measurement.key]" 
                                placeholder="Requerido"
                                type="number" 
                            />
                        </el-form-item>
                    </template>

                    <el-form-item label="Fecha">
                        <el-date-picker
                            v-model="form.date"
                            type="date"
                            placeholder="Requerido"
                            size="default"
                            format="DD/MM/YYYY"
                            style="width: 100%;"
                        />
                    </el-form-item>

                    <el-form-item label="Hora">
                        <el-time-picker
                            v-model="form.time"
                            placeholder="Requerido"
                            format="h:mm a"
                        />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar Mediciones
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
    import { useScreen } from 'vue-screen'
    import moment from 'moment'

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
            const screen = useScreen()

            let measurement_keys = reactive([
                {
                    key: 'weight_kg',
                    label: 'Peso Kg',
                }, 
                {
                    key: 'fat_percentage',
                    label: '% Grasa', 
                }, 
                {
                    key: 'fat_kg',
                    label: 'Kg Grasa', 
                }, 
                {
                    key: 'muscle_kg',
                    label: 'Kg Músculo', 
                }, 
                {
                    key: 'bone_mass',
                    label: 'Masa Ósea', 
                }, 
                {
                    key: 'bmi',
                    label: 'IMC', 
                }, 
                {
                    key: 'metabolic_age',
                    label: 'Edad Metabólica', 
                }, 
                {
                    key: 'water_percentage',
                    label: '% Agua', 
                }, 
                {
                    key: 'visceral_fat',
                    label: 'Grasa Viceral', 
                }, 
                {
                    key: 'waist_circumference',
                    label: 'Circunferencia de Cintura', 
                }, 
                {
                    key: 'abdomen_circumference',
                    label: 'Circunferencia de Abdomen', 
                }, 
                {
                    key: 'hip_circumference',
                    label: 'Circunferencia de Cadera', 
                }
            ])

            let form = reactive({
                weight_kg: '',
                fat_percentage: '',
                fat_kg: '',
                muscle_kg: '',
                bone_mass: '',
                bmi: '',
                metabolic_age: '',
                water_percentage: '',
                visceral_fat: '',
                waist_circumference: '',
                abdomen_circumference: '',
                hip_circumference: '',
                date: new Date(), 
                time: new Date(), 
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

                for(let measurement of measurement_keys) {
                    if(error == null && form[measurement.key].trim() == '') {
                        error = `Ingrese los datos faltantes: ${measurement.label}`
                    }
                }

                if(error == null) {
                    if(form.date == '' || form.date == null) {
                        error = 'Ingrese la fecha de la medición'
                    }
                    else if(form.time == '' || form.time == null) {
                        error = 'Ingrese la hora de la medición'
                    }
                }
                
                if(error === null) {
                    // request list data
                    let response = await request.send({
                        method: 'POST',
                        url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${route.params.id}/measurement/add`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: {
                            ...form, 
                            creation: `${moment(form.date).format('YYYY-MM-DD')} ${moment(form.time).format('HH:mm:00')}`
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado guardar las mediciones del paciente, intente nuevamente por favor')
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
                    ElMessage.success('Mediciones guardadas exitosamente')

                    router.push({
                        name: 'EditMeasurementPacientes',
                        params: {
                            id: route.params.id, 
                            measurement_id: response.data.measurement_id
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
                screen, 
                measurement_keys, 
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
