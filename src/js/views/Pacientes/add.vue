<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/pacientes' }">PACIENTES</el-breadcrumb-item>
                            <el-breadcrumb-item>AGREGAR</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Datos Personales
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="screen.width <= 576 ? 'top' : 'left'"
                >
                    <el-form-item label="Membersía">
                        <el-select
                            v-model="form.membership_id"
                            placeholder="Seleccione Membersía"
                            style="width: 100%;"
                        >
                            <el-option
                                v-for="membership in memberships"
                                :key="`membership_${membership.id}`"
                                :label="membership.name"
                                :value="membership.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Nombre">
                        <el-input v-model="form.first_name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Apellido">
                        <el-input v-model="form.last_name" placeholder="Requerido" />
                    </el-form-item>

                    <el-form-item label="Edad">
                        <el-input v-model="age" placeholder="Requerido" type="number" disabled />
                    </el-form-item>

                    <el-form-item label="Fecha de Nacimiento">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="Requerido"
                            size="default"
                            style="width: 100%;"
                            format="DD/MM/YYYY"
                        />
                    </el-form-item>

                    <el-form-item label="Género">
                        <el-select
                            v-model="form.gender"
                            placeholder="Seleccione Género"
                            style="width: 100%;"
                        >
                            <el-option
                                v-for="gender in genders"
                                :key="`gender_${gender.value}`"
                                :label="gender.label"
                                :value="gender.value"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Ocupación">
                        <el-input v-model="form.job" />
                    </el-form-item>
                    
                    <el-form-item label="Diagnostico Principal">
                        <el-input v-model="form.main_ailment" type="textarea" />
                    </el-form-item>

                    <el-form-item label="Patologías">
                        <el-select
                            v-model="form.pathologies"
                            multiple
                            placeholder="Seleccione Patologías"
                            style="width: 100%;"
                        >
                            <el-option
                                v-for="pathology in pathologies"
                                :key="`pathology_${pathology.id}`"
                                :label="pathology.name"
                                :value="pathology.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Mostrar Cantidades en Alimentos">
                        <el-select
                            v-model="form.show_food_quantity"
                            style="width: 100%;"
                        >
                            <el-option label="Activo" value="Activo" />
                            <el-option label="Inactivo" value="Inactivo" />
                        </el-select>
                    </el-form-item>
                </el-form>

                <el-row>
                    <el-col :span="24" class="title" style="margin-top: 20px;">
                        Perfil Médico
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="screen.width <= 576 ? 'top' : 'left'"
                >
                    <el-form-item
                        v-for="item of form.questions"
                        :key="`question_${item.id}`"
                        :label="item.question"
                    >
                        <el-input v-model="item.answer" />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="requestAdd()">
                        Agregar
                    </el-button>
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
    import { useScreen } from 'vue-screen'
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
            const screen = useScreen()
            
            let form = reactive({
                membership_id: null,
                pathologies: [],
                first_name: '',
                last_name: '',
                birthday: '',
                gender: '',
                job: '',
                main_ailment: '', 
                show_food_quantity: 'Inactivo',
                questions: [],
            })

            let memberships = reactive([])
            let pathologies = reactive([])
            let genders = ref([
                {
                    value: 'male',
                    label: 'Hombre'
                }, {
                    value: 'female',
                    label: 'Mujer'
                }
            ])

            // computed
            const age = computed(() => {
                if(form.birthday == '' || form.birthday == null) {
                    return 0
                }

                let today = moment(moment().format('YYYY-MM-DD 00:00:00'))
                let birthday = moment(moment(form.birthday).format('YYYY-MM-DD 00:00:00')) 

                return today.diff(birthday, 'years')
            })
            
            // actions
            const requestQuestions = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/clinical_question',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    },
                    query: {
                        active: true
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de preguntas médicas, intente nuevamente por favor')
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
                form.questions.length = 0
                for(let item of response.data.questions) {
                    form.questions.push({
                        id: item.id,
                        question: item.question,
                        answer: ''
                    })
                }

                loading.close()
                requestMemberships()
            }

            const requestMemberships = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/membership/select',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    },
                    query: {
                        active: true
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de preguntas médicas, intente nuevamente por favor')
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
                form.membership_id = null
                memberships.length = 0
                memberships.push(...response.data.select)

                loading.close()
                requestPathologies()
            }

            const requestPathologies = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/pathology/select',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })
                
                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el catalogo de preguntas médicas, intente nuevamente por favor')
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
                form.pathologies = []
                pathologies.length = 0

                if (response.data.select) {
                    pathologies.push(...response.data.select)
                }

                loading.close()
            }

            const requestAdd = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Guardando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // Validate form
                let error = null

                if(form.membership_id == null || form.membership_id <= 0) {
                    error = 'Seleccione un tipo de membersía'
                }
                else if(form.first_name.trim() == '') {
                    error = 'Ingrese el nombre del paciente'
                }
                else if(form.last_name.trim() == '') {
                    error = 'Ingrese el appelido del paciente'
                }
                else if(form.birthday == '' || form.birthday == null) {
                    error = 'Ingrese la fecha de nacimiento del paciente'
                }
                else if(form.gender.trim() == '') {
                    error = 'Ingrese el género del paciente'
                }

                if(error === null) {
                    // request list data
                    let response = await request.send({
                        method: 'POST',
                        url: import.meta.env.VITE_API_CONSULTANT_URL + '/user',
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: {
                            ...form, 
                            birthday: moment(form.birthday).format('YYYY-MM-DD 00:00:00'), 
                            birthday: moment(form.birthday).format('YYYY-MM-DD'),
                            show_food_quantity: form.show_food_quantity == 'Activo',
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado crear el perfil del paciente, intente nuevamente por favor')
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
                    router.push({
                        name: 'ViewPacientes',
                        params: {
                            id: response.data.user_id
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
                requestQuestions()
            })

            // return component
            return {
                // state
                form,
                memberships,
                pathologies,
                genders,
                screen, 
                // computed
                age, 
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

        .app-breadcrumb {
            height: 20px;
        }

        .title {
            color: $primary-color;
            font-family: Bold;
            text-align: center;
            margin-bottom: 20px;
        }
    }
</style>
