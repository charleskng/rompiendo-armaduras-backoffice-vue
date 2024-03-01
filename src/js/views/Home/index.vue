<template>
    <div>
        <el-container class="container">
            <el-header class="app-breadcrumb">
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item>INICIO</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
            </el-header>

            <el-main>
                <el-row>
                    <el-col v-for="(item, index) of menu" :key="`route_${index}`" :md="6" :sm="8" :xs="12"
                        class="menu-container">
                        <div class="menu-item" @click="navigate(item.path)">
                            <div>
                                <div class="menu-icon">
                                    <img :src="item.image" height="50" />
                                </div>

                                <div class="menu-text">
                                    <span>
                                        {{ item.name }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

export default {
    setup() {
        // router
        const router = useRouter()
        const route = useRoute()

        // store
        const appStore = useAppStore()

        // state
        let menu = reactive([
            {
                path: '/pacientes',
                name: 'Mis Pacientes',
                image: '/sistema/svg/icons_white/pacientes.svg',
            },
            {
                path: '/citas',
                name: 'Mis Citas',
                image: '/sistema/svg/icons_white/citas.svg',
            },
            {
                path: '/recetas',
                name: 'Mis Recetas',
                image: '/sistema/svg/icons_white/recetas.svg',
            },
            {
                path: '/alimentos',
                name: 'Alimentos',
                image: '/sistema/svg/icons_white/alimentos.svg',
            },
            {
                path: '/perfil_medico',
                name: 'Perfil Médico',
                image: '/sistema/svg/icons_white/perfil_medico.svg',
            },
            {
                path: '/plan_nutricional',
                name: 'Planes Nutricionales',
                image: '/sistema/svg/icons_white/plan_alimenticio.svg',
            },
            {
                path: '/aporte_nutrimental',
                name: 'Aporte Nutrimental',
                image: '/sistema/svg/icons_white/aporte_nutrimental.svg',
            },
            {
                path: '/membresia',
                name: 'Membresía',
                image: '/sistema/svg/icons_white/membresia.svg',
            },
            {
                path: '/noticias',
                name: 'Noticias',
                image: '/sistema/svg/icons_white/noticias.svg',
            },
            {
                path: '/foro',
                name: 'Foro',
                image: '/sistema/svg/icons_white/foro.svg',
            },
            {
                path: '/intervencion_multidisciplinaria',
                name: 'Intervención Multi-disciplinaria',
                image: '/sistema/svg/icons_white/intervencion.svg',
            },
            {
                path: '/documentos',
                name: 'Documentos',
                image: '/sistema/svg/icons_white/documentos.svg',
            },
            {
                path: '/patologias',
                name: 'Patologías',
                image: '/sistema/svg/icons_white/patologias.svg',
            },
        ])

        // actions
        const navigate = (path) => {
            router.push({
                path
            })
        }

        const logout = () => {
            appStore.setSession(null, null, null)
            router.push({
                name: 'Login'
            })
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

<style scoped lang="scss">
// Globals SCSS
@import '~/app.scss';

.container {
    padding: 20px;

    .menu-container {
        @include gridPosition(center);
        margin-bottom: 20px;
    }

    .menu-item {
        @include gridPosition(center);

        width: 100px;
        height: 100px;
        padding: 20px;

        background-color: $primary-color;
        border-radius: 16px;

        cursor: pointer;
    }

    .menu-text {
        color: $light-color;
        font-family: Bold;
        text-align: center;
    }

    .menu-icon {
        text-align: center;
    }
}
</style>