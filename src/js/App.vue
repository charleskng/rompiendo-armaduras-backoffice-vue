<template>
    <div class="app-page">
        <el-container v-if="!appStore.hasSession">
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </el-container>
        <el-container v-else class="page-container">
            <div class="page-header">
                <el-row justify="center" class="h-100">
                    <el-col :span="6" class="col-left">
                        <box-icon
                            name='menu'
                            color="white"
                            class="cursor-pointer"
                            @click="appStore.toggleMenu()"
                        ></box-icon>
                    </el-col>

                    <el-col :span="12" class="col-center">
                        <div class="cursor-pointer" @click="navigate('Home')">
                            <img src="/sistema/images/brand/logo_white.png" alt="logo_white" class="logo">
                        </div>
                    </el-col>

                    <el-col :span="6" class="col-right">
                        <box-icon
                            name='user-circle'
                            color="white"
                            class="cursor-pointer"
                            @click="navigate('Perfil')"
                        ></box-icon>
                    </el-col>
                </el-row>
            </div>

            <el-container class="page-content">
                <el-aside class="page-menu" :class="appStore.menu_open ? 'open' : null">
                    <el-scrollbar>
                        <el-menu
                            default-active="1"
                            :collapse="!appStore.menu_open"
                            :router="true"
                            :collapse-transition="false"
                        >
                            <el-menu-item v-for="(item, index) of menu"
                                :key="`menu-item-${index}`"
                                :index="item.path"
                                :class="route.path == item.path ? 'is-active' : 'is-inactive'"
                            >
                                <el-icon>
                                    <img v-if="route.path == item.path"
                                        :src="item.image_active" class="menu-icon"
                                    />
                                    <img v-else
                                        :src="item.image" class="menu-icon"
                                    />
                                </el-icon>
                                <template #title>
                                    {{ item.name }}
                                </template>
                            </el-menu-item>
                            
                            <el-menu-item class="is-inactive"
                                @click="logout()"
                            >
                                <el-icon>
                                    <box-icon name='power-off'></box-icon>
                                </el-icon>
                                <template #title>
                                    Cerrar Sesión
                                </template>
                            </el-menu-item>
                        </el-menu>
                    </el-scrollbar>
                </el-aside>

                <el-main class="page-main" :class="appStore.menu_open ? 'menu-open' : null">
                    <router-view v-slot="{ Component }">
                        <transition name="fade">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </el-main>

                <div v-if="appStore.menu_open" class="block-main" @click="appStore.closeMenu()"></div>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import { reactive, inject } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAppStore } from '@/stores/app'
    
    export default {
        setup() {
            // router
            const router = useRouter()
            const route = useRoute()

            // plugins
            const request = inject('request')
            
            // store
            const appStore = useAppStore()

            // state
            let menu = reactive([
                {
                    path: '/',
                    name: 'Inicio', 
                    image: '/sistema/svg/icons_white/home.svg', 
                    image_active: '/sistema/svg/icons/home.svg', 
                },
                {
                    path: '/pacientes',
                    name: 'Mis Pacientes', 
                    image: '/sistema/svg/icons_white/pacientes.svg', 
                    image_active: '/sistema/svg/icons/pacientes.svg', 
                },
                {
                    path: '/citas',
                    name: 'Mis Citas', 
                    image: '/sistema/svg/icons_white/citas.svg', 
                    image_active: '/sistema/svg/icons/citas.svg', 
                },
                {
                    path: '/recetas',
                    name: 'Mis Recetas', 
                    image: '/sistema/svg/icons_white/recetas.svg', 
                    image_active: '/sistema/svg/icons/recetas.svg', 
                },
                {
                    path: '/alimentos',
                    name: 'Alimentos', 
                    image: '/sistema/svg/icons_white/alimentos.svg', 
                    image_active: '/sistema/svg/icons/alimentos.svg', 
                },
                {
                    path: '/perfil_medico',
                    name: 'Perfil Médico', 
                    image: '/sistema/svg/icons_white/perfil_medico.svg', 
                    image_active: '/sistema/svg/icons/perfil_medico.svg', 
                },
                {
                    path: '/plan_nutricional',
                    name: 'Planes Nutricionales', 
                    image: '/sistema/svg/icons_white/plan_alimenticio.svg', 
                    image_active: '/sistema/svg/icons/plan_alimenticio.svg', 
                },
                {
                    path: '/aporte_nutrimental',
                    name: 'Aporte Nutrimental', 
                    image: '/sistema/svg/icons_white/aporte_nutrimental.svg', 
                    image_active: '/sistema/svg/icons/aporte_nutrimental.svg', 
                },
                {
                    path: '/membresia',
                    name: 'Membresía', 
                    image: '/sistema/svg/icons_white/membresia.svg', 
                    image_active: '/sistema/svg/icons/membresia.svg', 
                },
                {
                    path: '/noticias',
                    name: 'Noticias', 
                    image: '/sistema/svg/icons_white/noticias.svg', 
                    image_active: '/sistema/svg/icons/noticias.svg', 
                },
                {
                    path: '/foro',
                    name: 'Foro', 
                    image: '/sistema/svg/icons_white/foro.svg', 
                    image_active: '/sistema/svg/icons/foro.svg', 
                },
                {
                    path: '/intervencion_multidisciplinaria',
                    name: 'Intervención Multi-disciplinaria', 
                    image: '/sistema/svg/icons_white/intervencion.svg', 
                    image_active: '/sistema/svg/icons/intervencion.svg', 
                },
                {
                    path: '/documentos',
                    name: 'Documentos', 
                    image: '/sistema/svg/icons_white/documentos.svg', 
                    image_active: '/sistema/svg/icons/documentos.svg', 
                }, 
                {
                path: '/patologias',
                name: 'Patologías',
                image: '/sistema/svg/icons_white/patologias.svg',
                image_active: '/sistema/svg/icons/patologias.svg', 
            },
            ])
            
            // actions
            const navigate = (name) => {
                router.push({
                    name
                })
            }

            const logout = () => {
                appStore.logout(request)
            }

            // return component
            return {
                // store
                appStore,
                // Router
                route,
                // state
                menu,
                // actions
                navigate,
                logout
            }
        }
    }
</script>

<style lang="scss">
    // Globals SCSS
    @import '~/app.scss';
    
    // Font
    * {
        font-family: Regular;
    }

    // Page
    html, body {
        width: 100%;
        height: 100%;

        min-width: 380px;

        padding: 0;
        margin: 0;

        overflow-x: hidden;
    }

    #app {
        width: 100%;
        min-height: 100vh;

        .app-page {
            min-height: 100vh;

            .page-container {
                min-height: 100vh;
            }

            .page-content {
                padding-top: 60px;
            }

            .page-header {
                position: fixed;
                width: 100%;
                height: 60px;

                background-color: $primary-color;
                color: $light-color !important;

                z-index: 100;

                .col-left {
                    @include gridPosition(center start);
                    padding-left: 20px;
                }

                .col-center {
                    @include gridPosition(center);
                }

                .col-right {
                    @include gridPosition(center end);
                    padding-right: 20px;
                }

                .logo {
                    height: 48px;
                }
            }

            .page-menu {
                position: fixed;
                width: 64px;
                height: 100%;
                height: -webkit-calc(100% - 60px);
                height: -moz-calc(100% - 60px);
                height: calc(100% - 60px);

                background-color: $primary-color;
                z-index: 99;
                margin-left: -64px;

                &.open {
                    width: 300px;
                    margin-left: 0px;
                }

                .el-menu-item {
                    &.is-active {
                        background-color: $light-color;
                        color: $primary-color;
                    }

                    &.is-inactive {
                        background-color: $primary-color;
                        color: $light-color;
                    }
                }

                .menu-icon {
                    height: 30px;
                }
            }

            .page-main {
                padding: 0px;
                padding-left: 0px;
            }

            .block-main {
                position: absolute;
                width: 100vw;
                height: 100vh;
                background-color: rgba(23,23,23,0.6);
            }
        }

        @media (min-width: 576px) {
            .app-page {
                .page-menu {
                    margin-left: 0px;
                }
                    
                .page-main {
                    padding-left: 64px;
                }
            }
        }
    }
</style>
