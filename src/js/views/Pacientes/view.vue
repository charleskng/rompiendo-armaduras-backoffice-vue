<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: '/pacientes' }">PACIENTES</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ id }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Cuenta
                    </el-col>
                </el-row>

                <el-form
                    label-width="200px"
                    :label-position="screen.width <= 576 ? 'top' : 'left'"
                >
                    <el-form-item label="ID #">
                        <el-input v-model="id" disabled />
                    </el-form-item>

                    <el-form-item label="Acceso">
                        <el-input v-model="access_key" disabled />
                    </el-form-item>
                </el-form>

                <el-row justify="center">
                    <el-button type="primary" @click="nutritionalPlan()" class="profile-button">
                        Plan Nutricional
                    </el-button>

                    <el-button type="primary" @click="measurement()" class="profile-button">
                        Mediciones
                    </el-button>

                    <el-button type="primary" @click="recomendations()" class="profile-button">
                        Recomendaciones
                    </el-button>

                    <el-button type="primary" @click="goals()" class="profile-button">
                        Metas
                    </el-button>

                    <el-button type="primary" @click="appointment()" class="profile-button">
                        Citas
                    </el-button>
                </el-row>

                <el-row>
                    <el-col :span="24" class="title" style="margin-top: 20px;">
                        Datos Personales
                    </el-col>
                </el-row>

                <el-row justify="center">
                    <div class="image_container">
                        <div class="image_content"
                            :style="profile_image ? `background-image: url(${profile_image});` : ''"
                        >
                        </div>
                    </div>
                </el-row>

                <el-row justify="center">
                    <file-upload
                        ref="upload"
                        class="el-button el-button--primary"
                        style="margin-bottom: 20px;"
                        v-model="image_files"
                        name="image"
                        :post-action="upload_endpoint"
                        :headers="upload_headers"
                        @input-file="inputFile"
                        @input-filter="inputFilter"
                    >
                        Cambiar Imágen
                    </file-upload>
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

                    <el-form-item label="Estatus">
                        <el-select
                            v-model="form.active"
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
                    <el-button type="primary" @click="saveUser()">
                        Guardar Cambios
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, onMounted, computed } from 'vue'
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

            // Refs
            let upload = ref(null)

            // state
            const screen = useScreen()

            let id = ref(null)
            let access_key = ref('')

            let form = reactive({
                membership_id: null,
                pathologies: [],
                first_name: '',
                last_name: '',
                birthday: '',
                gender: '',
                job: '',
                main_ailment: '', 
                active: 'Activo', 
                questions: []
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

            let image_files = reactive([])
            let upload_endpoint = ref(`${import.meta.env.VITE_API_CONSULTANT_URL}/user/image/${route.params.id}`)
            let upload_headers = reactive({
                'session': appStore.session
            })

            const profileImageDefault = `${import.meta.env.VITE_STORAGE}/images/consultant/default.png`
            let profile_image = ref(profileImageDefault)

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

                requestUser()
            }

            const requestUser = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request list data
                let response = await request.send({
                    method: 'GET',
                    url: `${import.meta.env.VITE_API_CONSULTANT_URL}/user/${route.params.id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado obtener el perfil del paciente, intente nuevamente por favor')
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
                id.value = response.data.user.id
                access_key.value = response.data.user.access_key
                
                let timestamp = (new Date()).getTime()
                profile_image.value = (response.data.profile.image
                    ? `${import.meta.env.VITE_STORAGE}${response.data.profile.image}?t=${timestamp}`
                    : profileImageDefault)

                form.membership_id = response.data.user.membership_id
                form.pathologies = response.data.user.pathologies
                form.first_name = response.data.profile.first_name
                form.last_name = response.data.profile.last_name
                form.birthday = response.data.profile.birthday
                form.gender = response.data.profile.gender
                form.job = response.data.profile.job
                form.main_ailment = response.data.profile.main_ailment
                form.active = response.data.user.active ? 'Activo' : 'Inactivo'

                for(let item of form.questions) {
                    let found = false

                    for(let ans of response.data.answers) {
                        if(ans.question_id == item.id) {
                            item.answer = ans.answer
                            found = true
                            break
                        }
                    }

                    if(!found) {
                        item.answer = ''
                    }
                }

                loading.close()
            }

            const saveUser = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando información',
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
                else if(!form.birthday) {
                    error = 'Ingrese la fecha de nacimiento del paciente'
                }
                else if(form.gender.trim() == '') {
                    error = 'Ingrese el género del paciente'
                }

                if(error === null) {
                    // request list data
                    let response = await request.send({
                        method: 'PUT',
                        url: `${import.meta.env.VITE_API_CONSULTANT_URL}/user/${route.params.id}`,
                        headers: {
                            'content-type': 'application/json',
                            'session': appStore.session
                        },
                        body: {
                            ...form,
                            birthday: moment(form.birthday).format('YYYY-MM-DD 00:00:00'), 
                            active: form.active == 'Activo'
                        }
                    })
                    
                    // request error
                    if(!response.success) {
                        ElMessage.error('No se ha logrado actualizar el perfil del paciente, intente nuevamente por favor')
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

                    requestUser()
                    return
                }

                // request error
                if(error) {
                    ElMessage.error(error)
                }

                // Update data and hide loading
                loading.close()
            }

            let inputFilter = (newFile, oldFile, prevent) => {
                if(newFile && !oldFile) {
                    // Image Format
                    if(!/\.(jpeg|jpe|jpg|png)$/i.test(newFile.name)) {
                        ElMessage.error('Solo es posible subir imagenes JPG o PNG')
                        return prevent()
                    }

                    // Image Size
                    let image_size = newFile.file.size/1024/1024
                    let maxSize = 5
                    if(image_size > maxSize) {
                        ElMessage.error('La imágen no debe pesar más de 5 Mb')
                        return prevent()
                    }
                }
                
                // Create a blob field
                newFile.blob = ''
                let URL = (window.URL || window.webkitURL)
                if(URL) {
                    newFile.blob = URL.createObjectURL(newFile.file)
                }
                
                // Thumbnails
                newFile.thumb = ''
                if(newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                    newFile.thumb = newFile.blob
                }
            }

            const inputFile = (newFile, oldFile) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Actualizando imágen de perfil',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                if (newFile && oldFile) {
                    // update
                    if(newFile.active && !oldFile.active) {
                        // beforeSend

                        // Image Format
                        if(!/\.(jpeg|jpe|jpg|png)$/i.test(newFile.name)) {
                            ElMessage.error('Solo es posible subir imagenes JPG o PNG')
                            loading.close()
                            return
                        }

                        // Image Size
                        let image_size = newFile.file.size/1024/1024
                        let maxSize = 5
                        if(image_size > maxSize) {
                            ElMessage.error('La imágen no debe pesar más de 5 Mb')
                            return prevent()
                        }
                    }

                    if(newFile.error && !oldFile.error) {
                        ElMessage.error('No fue posible cargar la imágen, intente nuevamente por favor')
                        loading.close()
                        return
                    }

                    if(newFile.success && !oldFile.success) {
                        let response = JSON.parse(newFile.xhr.response)
                        log.debug(response)
                        
                        // request failed
                        if(!response.success) {
                            log.error('API error => ', response.error)

                            if(response.error == 'wrong_session') {
                                ElMessage.error('Su sesión ha expirado, ingrese nuevamente')
                                appStore.logout(request)
                            }
                            else {
                                ElMessage.error('No fue posible cargar la imágen, intente nuevamente por favor')
                            }

                            loading.close()
                            return
                        }
                        
                        let timestamp = (new Date()).getTime()
                        profile_image.value = `${import.meta.env.VITE_STORAGE}${response.data.image_url}?t=${timestamp}`

                        ElMessage.success('Imagén cargada con exito')
                        loading.close()
                        return
                    }
                }
                
                // Automatically activate upload
                if(!upload.value.active) {
                    upload.value.active = true
                }
            }

            const nutritionalPlan = () => {
                router.push({
                    name: 'NutritionalPlanPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            const measurement = () => {
                router.push({
                    name: 'MeasurementPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }
            
            const recomendations = () => {
                router.push({
                    name: 'RecommendationPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            const goals = () => {
                router.push({
                    name: 'GoalPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            const appointment = () => {
                router.push({
                    name: 'AppointmentPacientes', 
                    params: {
                        id: route.params.id
                    }
                })
            }

            // on mounted
            onMounted(() => {
                requestQuestions()
            })

            // return component
            return {
                // state
                id,
                access_key,
                form,
                memberships,
                pathologies,
                genders,
                image_files, 
                upload_endpoint, 
                upload_headers, 
                upload, 
                profile_image, 
                screen, 
                // computed
                age, 
                // actions
                saveUser, 
                inputFile, 
                inputFilter, 
                nutritionalPlan, 
                measurement, 
                recomendations, 
                goals, 
                appointment, 
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

        .image_container {
            margin-bottom: 20px;

            .image_content {
                @include coverImage();
                
                width: 200px;
                height: 200px;
                border-radius: 100px;

                background-color: rgba(23,23,23,0.2);
            }
        }

        .profile-button {
            margin-bottom: 10px;
        }
    }
</style>
