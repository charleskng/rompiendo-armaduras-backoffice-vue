<template>
    <el-main class="app-container">
        <div class="app-content">
            <el-card class="app-form">
                <div class="header-form">
                    <el-row justify="center" class="header-form-content">
                        <el-col :span="24">
                            <img src="/images/brand/logo.png" alt="logo">
                        </el-col>
                    </el-row>
                </div>
                <div class="body-form">
                    <el-row justify="center" class="body-form-content">
                        <el-col :span="24" class="title">
                            ¡Bienvenido!
                        </el-col>

                        <el-col :span="24" class="form-row">
                            <label for="username" class="form-label">
                                Usuario
                            </label>
                            
                            <el-input v-model="form.username" id="username" placeholder="Usuario" class="form-input">
                                <template #prefix>
                                    <box-icon name='user'></box-icon>
                                </template>
                            </el-input>
                        </el-col>

                        <el-col :span="24">
                            <label for="password" class="form-label">
                                Contraseña
                            </label>

                            <el-input v-model="form.password" id="password" placeholder="Contraseña" class="form-input" :type="!form.show_password ? 'password' : 'text'">
                                <template #prefix>
                                    <box-icon name='lock-alt'></box-icon>
                                </template>
                                <template #suffix>
                                    <box-icon name='show' class="cursor-pointer" v-if="form.show_password" @click="toggleShowPassword()"></box-icon>
                                    <box-icon name='hide' class="cursor-pointer" v-if="!form.show_password" @click="toggleShowPassword()"></box-icon>
                                </template>
                            </el-input>
                        </el-col>

                        <el-col :span="24" class="w-100">
                            <el-button type="primary" class="form-button w-100" round @click="requestLogin()">Iniciar Sesión</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>
    </el-main>
</template>

<script>
    import { reactive, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { ElLoading, ElMessage } from 'element-plus'
    import { useAppStore } from '@/stores/app'

    export default {
        setup(props, context) {
            // router
            const router = useRouter()

            // store
            const appStore = useAppStore()
            
            // plugins
            const log = inject('log')
            const request = inject('request')

            // state
            let form = reactive({
                username: '',
                password: '',
                show_password: false
            })

            // actions
            const toggleShowPassword = () => {
                form.show_password = !form.show_password
            }

            const requestLogin = async() => {
                // show loading
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Validando información',
                    background: 'rgba(23, 23, 23, 0.6)'
                })

                // validate data
                let error = null
                if(form.username.trim() === '') {
                    error = 'Ingrese su usario'
                }
                else if(form.password.trim() === '') {
                    error = 'Ingrese su contraseña'
                }

                if(error !== null) {
                    ElMessage.error(error)
                    loading.close()
                    return
                }
                
                // send login request
                let response = await request.send({
                    method: 'POST',
                    url: import.meta.env.VITE_API_SYSTEM_URL + '/login',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: {
                        username: form.username,
                        password: form.password
                    },
                    query: {
                        timestamp: (new Date()).getTime(),
                        test: true
                    }
                })

                // request error
                if(!response.success) {
                    ElMessage.error('No se ha logrado ingresar a la cuenta, por favor intente nuevamente')
                    loading.close()
                    return
                }
                response = response.response

                // request failed
                if(!response.success) {
                    log.error('API error => ', response.error)

                    if(response.error == 'empty_username') {
                        ElMessage.error('Verifique su usuario e intente nuevamente')
                    }
                    else if(response.error == 'empty_password') {
                        ElMessage.error('Verifique su contraseña e intente nuevamente')
                    }
                    else if(response.error == 'user_not_found') {
                        ElMessage.error('El usuario no existe, verifique los datos ingresados e intente nuevamente')
                    }
                    else if(response.error == 'wrong_password') {
                        ElMessage.error('La contraseña es incorrecta, por favor verifique los datos ingresados')
                    }
                    else {
                        ElMessage.error('No se ha logrado ingresar a la cuenta, por favor intente nuevamente')
                    }

                    loading.close()
                    return
                }

                // request success: set session
                const { profile, user, session } = response.data
                appStore.setSession(user, profile, session)

                // close loading and redirect to home
                loading.close()
                router.push({
                    name: 'Home'
                })
            }
            
            // return component
            return {
                // state
                form,
                toggleShowPassword,
                // actions
                requestLogin
            }
        }
    }
</script>

<style scoped lang="scss">

    // Globals SCSS
    @import '~/app.scss';

    // Style Component
    .app-container {
        height: 100vh;
        padding: 0px;

        @include gridPosition(center);

        background-color: $light-color;

        &:before {
            content: "";

            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            @include coverImage("/images/login/background.jpg");
            filter: opacity(70%);
        }

        .app-content {
            position: relative;

            .app-form {
                width: 300px;
                min-height: 400px;
                border-radius: 16px;

                background-color: $bright-color;

                .header-form {
                    .header-form-content {
                        @include gridPosition(center);

                        img {
                            width: 100px;
                        }
                    }
                }

                .body-form {
                    .body-form-content {
                        @include gridPosition(center);
                        margin-top: 12px;

                        .title {
                            text-align: center;
                            font-family: Bold !important;
                            color: $primary-color;
                            margin-bottom: 20px;
                        }

                        .form-row {
                            margin-bottom: 12px;
                        }

                        .form-label {
                            font-family: Bold !important;
                            color: $primary-color;
                            padding-left: 4px;
                            padding-right: 4px;
                        }

                        .form-input {
                            margin-top: 8px;
                        }

                        .form-button {
                            margin-top: 16px;
                        }
                    }
                }
            }
        }
    }
</style>
