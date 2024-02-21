<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/foro' }">FORO</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
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
                    <el-form-item label="Titulo">
                        <el-input v-model="form.title" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Descripción">
                        <el-input v-model="form.desc" placeholder="Requerido" type="textarea" />
                    </el-form-item>
                    
                    <el-form-item label="Fecha Evento">
                        <el-date-picker
                            v-model="form.event_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Evento">
                        <el-time-picker
                            v-model="form.event_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="URL">
                        <el-input v-model="form.action" />
                    </el-form-item>

                    <el-form-item label="Fecha Inicial">
                        <el-date-picker
                            v-model="form.start_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Inicial">
                        <el-time-picker
                            v-model="form.start_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Fecha Final">
                        <el-date-picker
                            v-model="form.end_date"
                            type="date"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                            clearable
                        />
                    </el-form-item>

                    <el-form-item label="Hora Final">
                        <el-time-picker
                            v-model="form.end_hour"
                            format="h:mm a"
                            clearable
                        />
                    </el-form-item>

                    <p class="note">
                        * La fecha y hora inicial/final determinan cuando se va a mostrar este evento en la app del cliente.
                    </p>
                </el-form> 

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar Evento
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import moment from 'moment'

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
            let form = reactive({
                title: '', 
                desc: '', 
                event_date: '', 
                event_hour: '', 
                start_date: '', 
                start_hour: '', 
                end_date: '', 
                end_hour: '', 
                action: ''
            })

            // actions            
            const requestAdd = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })
                
                // validate data
                let error = null

                if(form.title.trim() == '') {
                    error = 'Ingrese un titulo para el evento'
                }
                else if(form.desc.trim() == '') {
                    error = 'Ingrese una descripción para el evento'
                }

                if(error === null) {
                    // request selector data
                    let response = await request.send({
                        method: 'POST',
                        url: import.meta.env.VITE_API_SYSTEM_URL + '/forum/add',
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        }, 
                        body: {
                            title: form.title, 
                            desc: form.desc, 
                            event_date: (form.event_date && form.event_hour) ? `${moment(form.event_date).format('YYYY-MM-DD')} ${moment(form.event_hour).format('HH:mm:00')}` : null, 
                            start_date: (form.start_date && form.start_hour) ? `${moment(form.start_date).format('YYYY-MM-DD')} ${moment(form.start_hour).format('HH:mm:00')}` : null, 
                            end_date: (form.end_date && form.end_hour) ? `${moment(form.end_date).format('YYYY-MM-DD')} ${moment(form.end_hour).format('HH:mm:00')}` : null, 
                            action: form.action
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado agregar el evento, intente nuevamente por favor')
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

                    // show success message
                    ElMessage.success('Se ha agregado el evento exitosamente')

                    // redirect to view
                    router.push({
                        name: 'EditForo',
                        params: {
                            id: response.data.forum_id
                        }
                    })
                    return
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                loading.close()
            }

            // return component
            return {
                // state
                form,
                // actions
                requestAdd
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

    .note {
        color: $primary-color;
        font-family: BoldItalic;
        font-size: 12px;
        margin-bottom: 20px;
    }

</style>
