<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/' }">INICIO</el-breadcrumb-item>
                            <el-breadcrumb-item>PERFIL MÉDICO</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col :span="24" class="title">
                        Preguntas/Datos Requeridos
                    </el-col>
                </el-row>

                <draggable
                    v-model="questions"
                    @end="endDraggable"
                    item-key="order"
                >
                    <template #item="{ element }">
                        <el-row class="question-box">
                            <el-col :span="20" class="text-center">
                                <el-input v-model="element.question" />
                            </el-col>

                            <el-col :span="2" class="text-center" style="padding-left: 8px;">
                                <el-switch v-model="element.active" />
                            </el-col>

                            <el-col :span="2" class="text-center" style="padding-left: 8px;">
                                <box-icon name='trash' color='#760000' @click="deleteQuestion(element.id, element.question)"></box-icon>
                            </el-col>
                        </el-row>
                    </template>
                </draggable>

                <el-row style="margin-top: 20px; margin-bottom: 20px;">
                    <el-col :span="24">
                        <center>
                            <el-button type="primary" @click="saveQuestions()">
                                Guardar
                            </el-button>
                        </center>
                    </el-col>
                </el-row>

                <el-form
                    :model="form"
                    label-width="200px"
                    :label-position="'left'"
                >
                    <el-form-item label="Nueva Pregunta">
                        <el-input v-model="form.question" placeholder="Requerido" />
                    </el-form-item>

                    <center>
                        <el-button type="primary" @click="addQuestion()">
                            Agregar
                        </el-button>
                    </center>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import { ref, reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
    import { useAppStore } from '@/stores/app'
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
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

            // state
            let form = reactive({
                question: ''
            })
            let questions = reactive([])
            let table_columns = ref([{
                key: 'id',
                label: '#',
                width: 60
            },
            {
                key: 'actions',
                label: 'Acciones',
                width: 180
            },
            {
                key: 'question',
                label: 'Pregunta/Dato requerido'
            },
            {
               key: 'order',
               label: 'Orden',
               width: 100
            },
            {
                key: 'active',
                label: 'Activa',
                width: 100
            }])

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
                questions.length = 0
                questions.push(...response.data.questions)
                loading.close()
            }

            const endDraggable = (evt) => {
                let old_item = questions[evt.oldIndex]
                let new_item = questions[evt.newIndex]

                let questions_arr = [...questions]
                questions_arr[evt.oldIndex] = new_item
                questions_arr[evt.newIndex] = old_item

                for(let index in questions_arr) {
                    questions_arr[index].order = Number(index) + 1
                }

                questions.length = 0
                questions.push(...questions_arr)
            }

            const saveQuestions = async() => {

                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Guardando...',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate form
                let error = null
                let questions_data = []

                for(let index in questions) {
                    let item = questions[index]
                    questions_data.push({
                        ...item,
                        order: Number(index) + 1
                    })

                    if(item.question.trim() == '') {
                        error = 'Por favor ingrese los datos o preguntas requeridas sin dejar ninguna vacía'
                        break
                    }
                }

                // show error
                if(error) {
                    ElMessage.error(error)
                    loading.close()
                    return
                }

                // request update questions
                let response = await request.send({
                    method: 'PUT',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/clinical_question',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    },
                    body: {
                        questions: questions_data
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado actualizar el catalogo de preguntas médicas, intente nuevamente por favor')
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

                // hide loading
                ElMessage.success('Se ha actualizado el cuestionario de perfil médico')
                loading.close()
            }

            const addQuestion = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Agregando datos...',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate form
                let error = null
                if(form.question.trim() == '') {
                    error = 'Por favor ingrese una pregunta o dato requerido para agregar al formulario'
                }

                // show error
                if(error) {
                    ElMessage.error(error)
                    loading.close()
                    return
                }

                // request add question
                let response = await request.send({
                    method: 'POST',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/clinical_question',
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    },
                    body: {
                        question: form.question,
                        order: Number(questions.length) + 1
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado actualizar el catalogo de preguntas médicas, intente nuevamente por favor')
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

                // update data and hide loading
                ElMessage.success('Se ha agregado la pregunta al cuestionario de perfil médico')
                loading.close()

                requestQuestions()
            }

            const deleteQuestion = (id, question) => {
                log.debug('Delete question => ', id, question)

                ElMessageBox.confirm(`Se va a eliminar del cuestionario "${question}" con id ${id}. Los datos relacionados a esta pregunta se van a eliminar ¿Deseas continuar?`)
                .then(() => {
                    requestDelete(id)
                })
                .catch((res) => {
                    log.debug('Delete question cancelled')
                })
            }

            const requestDelete = async(id) => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Agregando datos...',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // request delete question
                let response = await request.send({
                    method: 'DELETE',
                    url: `${import.meta.env.VITE_API_SYSTEM_URL}/clinical_question/${id}`,
                    headers: {
                        'content-type': 'application/json',
                        'session': appStore.session
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado eliminar la pregunta del cuestionario de perfil médico, intente nuevamente por favor')
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

                // update data and hide loading
                ElMessage.success('Se ha eliminado la pregunta del cuestionario de perfil médico')
                loading.close()

                requestQuestions()
            }

            // request food group
            onMounted(() => {
                requestQuestions()
            })

            // return component
            return {
                // state
                form,
                questions,
                table_columns,
                // actions
                endDraggable,
                saveQuestions,
                addQuestion,
                deleteQuestion
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

        .question-box {
            border: solid 1px rgba(23,23,23,0.2);
            padding: 10px;
        }
    }
</style>
