<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>MIS CITAS</el-breadcrumb-item>
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

                    <el-col :span="24" style="margin-top: 10px;">
                        <el-form :model="form" label-width="200px" :label-position="'left'">
                            <el-form-item label="Fecha">
                                <el-date-picker v-model="form.date" type="date" size="default" format="DD/MM/YYYY"
                                    style="width: 100%;" @change="requestAppointments" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-table class="table" :max-height="600" :data="list" style="width: 100%" border>
                            <el-table-column v-for="(item, index) of table_columns" :key="`column_${index}`"
                                :prop="item.key" :label="item.label" :fixed="item.fixed" :width="item.width"
                                :sortable="item.key != 'actions' ? true : false">
                                <template #default="scope" v-if="item.key == 'actions'">
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='user' type='solid' color='#760000'
                                            @click="profile(scope.row.user_id)">
                                        </box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='edit' color='#760000'
                                            @click="edit(scope.row.user_id, scope.row.id)"></box-icon>
                                    </div>
                                    <div class="table-icon cursor-pointer">
                                        <box-icon name='trash' color='#760000'
                                            @click="deleteItem(scope.row.user_id, scope.row.id)">
                                        </box-icon>
                                    </div>
                                </template>
                                <template #default="scope" v-if="item.key == 'image'">
                                    <div class="image_container">
                                        <div class="image_content"
                                            :style="scope.row.image ? `background-image: url(${scope.row.image});` : ''">
                                        </div>
                                    </div>
                                </template>
                                <template #default="scope" v-if="item.key == 'name'">
                                    <span v-if="scope.row.user_id == null">
                                        Nuevo Consultante
                                    </span>
                                    <span v-else>
                                        {{ scope.row.first_name }} {{ scope.row.last_name }}
                                    </span>
                                </template>
                                <template #default="scope" v-if="item.key == 'review'">
                                    <div v-if="scope.row.review == 'pending'" class="review-container">
                                        <box-icon name='calendar-check' color='#760000'></box-icon>&nbsp;&nbsp;
                                        <span>Pendiente</span>
                                    </div>
                                    <div v-if="scope.row.review == 'bad'" class="review-container">
                                        <box-icon name='calendar-check' color='#d32f2f'></box-icon>&nbsp;&nbsp;
                                        <span>Desfavorable</span>
                                    </div>
                                    <div v-if="scope.row.review == 'regular'" class="review-container">
                                        <box-icon name='calendar-check' color='#ffc107'></box-icon>&nbsp;&nbsp;
                                        <span>Regular</span>
                                    </div>
                                    <div v-if="scope.row.review == 'good'" class="review-container">
                                        <box-icon name='calendar-check' color='#00695c'></box-icon>&nbsp;&nbsp;
                                        <span>Bien</span>
                                    </div>
                                    <div v-if="scope.row.review == 'excellent'" class="review-container">
                                        <box-icon name='calendar-check' color='#2e7d32'></box-icon>&nbsp;&nbsp;
                                        <span>Excelente</span>
                                    </div>
                                </template>
                                <template #default="scope" v-if="item.key == 'date'">
                                    {{ timeFormat({ date: scope.row.date }) }}
                                </template>
                                <template #default="scope" v-if="item.key == 'id'">
                                    <span class="row_id">
                                        {{ scope.row.id }}
                                    </span>
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
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'
import moment from 'moment'

export default {
    setup() {

        // router
        const router = useRouter()

        // store
        const appStore = useAppStore()

        // plugins
        const request = inject('request')
        const common = inject('common')

        // state
        let form = reactive({
            date: new Date(),
        })
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
                width: 140,
                fixed: true
            },
            {
                key: 'image',
                width: 80,
                label: 'Foto'
            },
            {
                key: 'name',
                label: 'Nombre'
            },
            {
                key: 'review',
                label: 'Revisión',
                width: 140,
            },
            {
                key: 'note',
                label: 'Notas'
            },
            {
                key: 'date',
                label: 'Hora',
                width: 140,
            }
        ])

        // actions
        const requestAppointments = async () => {
            // show loading
            const loading = ElLoading.service({
                lock: true,
                text: 'Actualizando información',
                background: 'rgba(23, 23, 23, 0.6)'
            })

            // request list data
            let response = await request.send({
                method: 'GET',
                url: import.meta.env.VITE_API_SYSTEM_URL + '/appointment',
                headers: {
                    'content-type': 'application/json',
                    'session': appStore.session
                },
                query: {
                    date: `${moment(form.date).format('YYYY-MM-DD')}`
                }
            })

            // request error
            if (!response.success) {
                ElMessage.error('No se ha logrado obtener el listado de citas, intente nuevamente por favor')
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
            list.length = 0
            if (response.data.list !== null) {
                response.data.list.forEach((consultant) => {
                    consultant.image = `${import.meta.env.VITE_STORAGE}${
                        consultant.image || '/images/consultant/default.png'
                    }`
                })
                list.push(...response.data.list)
            }

            loading.close()
        }

        const profile = (user_id) => {
            if (user_id === null) {
                router.push({
                    name: 'AddPacientes',
                })
                return
            }

            router.push({
                name: 'ViewPacientes',
                params: {
                    id: user_id,
                }
            })
        }

        const edit = (user_id, appointment_id) => {
            router.push({
                name: 'EditCitas',
                params: {
                    appointment_id,
                    id: user_id !== null ? user_id : 0,
                }
            })
        }

        const deleteItem = (user_id, appointment_id) => {
            ElMessageBox.confirm(`¿Quieres eliminar la cita con id ${appointment_id}?`)
                .then(() => {
                    requestDelete(user_id, appointment_id)
                })
                .catch(() => {
                    log.debug('Delete appointment cancelled')
                })
        }

        const requestDelete = async (user_id, appointment_id) => {
            // show loading
            const loading = ElLoading.service({
                lock: true,
                text: 'Actualizando información',
                background: 'rgba(23, 23, 23, 0.6)'
            })

            // request list data
            let response = await request.send({
                method: 'DELETE',
                url: `${import.meta.env.VITE_API_CONSULTANT_URL}/${user_id !== null ? user_id : 0}/appointment/${appointment_id}`,
                headers: {
                    'content-type': 'application/json',
                    'session': appStore.session
                }
            })

            // request error
            if (!response.success) {
                ElMessage.error('No se han logrado eliminar esta cita, intenta nuevamente por favor')
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
            requestAppointments()
        }

        const add = () => {
            // redirect to view
            router.push({
                name: 'AddCitas'
            })
        }

        // on mounted
        onMounted(() => {
            requestAppointments()
        })

        // return component
        return {
            // state
            form,
            list,
            table_columns,
            // actions
            requestAppointments,
            profile,
            edit,
            deleteItem,
            add,
            timeFormat: common.timeFormat
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

        .image_container {
            .image_content {
                @include coverImage();

                width: 50px;
                height: 50px;
                border-radius: 25px;

                background-color: rgba(23, 23, 23, 0.2);
            }
        }
    }
}
</style>
