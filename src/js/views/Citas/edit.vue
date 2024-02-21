<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/citas' }">CITAS</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ appointment_id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Cita
                    </el-col>
                </el-row>

                <el-form :model="form" label-width="200px" :label-position="'left'">
                    <el-form-item label="Consultante">
                        <el-select v-model="user_id" placeholder="Seleccione Consultante" style="width: 100%;" disabled>
                            <el-option :key="`user_null`" label="Nuevo Consultante" :value="0" />
                            <el-option v-for="user in users" :key="`user_${user.id}`"
                                :label="`${user.first_name} ${user.last_name}`" :value="user.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Fecha">
                        <el-date-picker v-model="form.date" type="date" placeholder="Requerido" size="default"
                            format="DD/MM/YYYY" style="width: 100%;" />
                    </el-form-item>

                    <el-form-item label="Hora">
                        <el-time-picker v-model="form.time" placeholder="Requerido" format="h:mm a" />
                    </el-form-item>

                    <el-form-item label="Notas">
                        <el-input v-model="form.note" placeholder="Requerido" type="textarea" />
                    </el-form-item>

                    <el-form-item label="Revisión">
                        <el-radio-group v-model="form.review">
                            <el-radio v-for="(option, index) of review_options" :key="`review_${index}`"
                                :label="option.value" :class="`review_${option.value}`" border>
                                {{ option.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>


                <el-row justify="center">
                    <el-button type="primary" @click="requestEdit()">
                        Editar Cita
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { reactive, ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'
import moment from 'moment'

export default {
    setup() {

        // router
        const route = useRoute()
        const router = useRouter()

        // store
        const appStore = useAppStore()

        // plugins
        const request = inject('request')

        // state
        let form = reactive({
            date: '',
            time: '',
            note: '',
            review: '',
        })

        let user_id = ref(0)
        let users = reactive([])

        let review_options = reactive([{
            label: 'Excelente',
            value: 'excellent'
        }, {
            label: 'Bien',
            value: 'good'
        }, {
            label: 'Regular',
            value: 'regular'
        }, {
            label: 'Desfavorable',
            value: 'bad'
        }, {
            label: 'Pendiente',
            value: 'pending'
        }])

        // actions
        const requestAppointment = async () => {
            // show loading
            const loading = ElLoading.service({
                lock: true,
                text: 'Actualizando información',
                background: 'rgba(23, 23, 23, 0.6)'
            })

            // request list data
            let response = await request.send({
                method: 'GET',
                url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${user_id.value}/appointment/${route.params.appointment_id}`,
                headers: {
                    'content-type': 'application/json',
                    'session': appStore.session
                }
            })

            // request error
            if (!response.success) {
                ElMessage.error('No se ha logrado obtener la recomendación del paciente, intente nuevamente por favor')
                loading.close()
                return
            }
            response = response.response

            // request failed
            if (!response.success) {
                log.error('API error => ', response.error)

                if (response.error == 'wrong_session') {
                    ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                    appStore.logout(request)
                }

                loading.close()
                return
            }

            // Update data and hide loading
            form.date = new Date(response.data.appointment.date)
            form.time = new Date(response.data.appointment.date)
            form.note = response.data.appointment.note
            form.review = response.data.appointment.review

            loading.close()
        }

        const requestEdit = async () => {
            // show loading
            const loading = ElLoading.service({
                lock: true,
                text: 'Guardando información',
                background: 'rgba(23, 23, 23, 0.6)'
            })

            // Validate form
            let error = null

            if (user_id.value == null) {
                error = 'Seleccione un consultante'
            }
            else if (form.date == '' || form.date == null) {
                error = 'Ingrese la fecha de la nueva cita'
            }
            else if (form.time == '' || form.time == null) {
                error = 'Ingrese la hora para la nueva cita'
            }

            if (error === null) {
                // request list data
                let response = await request.send({
                    method: 'PUT',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${user_id.value}/appointment/${route.params.appointment_id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    },
                    body: {
                        ...form,
                        date: `${moment(form.date).format('YYYY-MM-DD')} ${moment(form.time).format('HH:mm:00')}`
                    }
                })

                // request error
                if (!response.success) {
                    ElMessage.error('No se ha logrado guardar la cita del paciente, intente nuevamente por favor')
                    loading.close()
                    return

                }
                response = response.response

                // request failed
                if (!response.success) {
                    log.error('API error => ', response.error)

                    if (response.error == 'wrong_session') {
                        ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                        appStore.logout(request)
                    }

                    loading.close()
                    return
                }

                // Redirect to edit view
                ElMessage.success('Cita guardada exitosamente')

                router.push({
                    name: 'Citas'
                })
                return
            }

            // request error
            if (error) {
                ElMessage.error(error)
            }

            // Update data and hide loading
            loading.close()
        }

        const requestConsultants = async () => {
            // show loading
            const loading = ElLoading.service({
                lock: true,
                text: 'Actualizando información',
                background: 'rgba(23, 23, 23, 0.6)'
            })

            // request list data
            let response = await request.send({
                method: 'GET',
                url: import.meta.env.VITE_API_CONSULTANT_URL + '/user',
                headers: {
                    'content-type': 'application/json',
                    'session': appStore.session
                }
            })

            // request error
            if (!response.success) {
                ElMessage.error('No se ha logrado obtener el listado de pacientes, intente nuevamente por favor')
                loading.close()
                return
            }
            response = response.response

            // request failed
            if (!response.success) {
                log.error('API error => ', response.error)

                if (response.error == 'wrong_session') {
                    ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                    logout()
                }

                loading.close()
                return
            }

            users.length = 0
            if (response.data.list !== null) {
                users.push(...response.data.list)

                for (let user of users) {
                    if (user.id == route.params.id) {
                        user_id.value = user.id
                    }
                }
            }

            // Update data and hide loading
            loading.close()

            // Request appointment
            requestAppointment()
        }

        // on mounted
        onMounted(() => {
            requestConsultants()
        })

        // return component
        return {
            // state 
            form,
            users,
            user_id,
            review_options,
            appointment_id: route.params.appointment_id,
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

.review_bad {
    background-color: $review-bad;
    color: $light-color !important;
}

.review_regular {
    background-color: $review-regular;
    color: $light-color !important;
}

.review_good {
    background-color: $review-good;
    color: $light-color;
}

.review_excellent {
    background-color: $review-excellent;
    color: $light-color;
}
</style>
