// Import Modules
import { createWebHistory, createRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

// Views
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')

// Alimentos
const Alimentos = () => import('@/views/Alimentos')
const AddAlimentos = () => import('@/views/Alimentos/add')
const EditAlimentos = () => import('@/views/Alimentos/edit')

// Citas
const Citas = () => import('@/views/Citas')
const AddCitas = () => import('@/views/Citas/add')
const EditCitas = () => import('@/views/Citas/edit')

// Membresía
const Membresia = () => import('@/views/Membresia')
const AddMembresia = () => import('@/views/Membresia/add')
const EditMembresia = () => import('@/views/Membresia/edit')

// Noticias
const Noticias = () => import('@/views/Noticias')
const AddNoticias = () => import('@/views/Noticias/add')
const EditNoticias = () => import('@/views/Noticias/edit')
const OrderNoticias = () => import('@/views/Noticias/order')

// Perfil Médico
const PerfilMedico = () => import('@/views/PerfilMedico')

// Aporte Nutrimental
const AporteNutrimental = () => import('@/views/AporteNutrimental')
const ViewAporteNutrimental = () => import('@/views/AporteNutrimental/view')

// Plan Nutrimental
const PlanNutricional = () => import('@/views/PlanNutricional')
const AddPlanNutricional = () => import('@/views/PlanNutricional/add')
const EditPlanNutricional = () => import('@/views/PlanNutricional/edit')

// Intervencion Multidisciplinaria
const IntervencionMultidisciplinaria = () => import('@/views/IntervencionMultidisciplinaria')
const AddIntervencionMultidisciplinaria = () => import('@/views/IntervencionMultidisciplinaria/add')
const EditIntervencionMultidisciplinaria = () => import('@/views/IntervencionMultidisciplinaria/edit')

// Foro
const Foro = () => import('@/views/Foro')
const AddForo = () => import('@/views/Foro/add')
const EditForo = () => import('@/views/Foro/edit')
const OrderForo = () => import('@/views/Foro/order')

// Documentos
const Documentos = () => import('@/views/Documentos')
const AddDocumentos = () => import('@/views/Documentos/add')
const EditDocumentos = () => import('@/views/Documentos/edit')
const OrderDocumentos = () => import('@/views/Documentos/order')

// Patologías
const Patologias = () => import('@/views/Patologias')
const AddPatologias = () => import('@/views/Patologias/add')
const EditPatologias = () => import('@/views/Patologias/edit')

// Pacientes
const Pacientes = () => import('@/views/Pacientes')
const AddPacientes = () => import('@/views/Pacientes/add')
const ViewPacientes = () => import('@/views/Pacientes/view')

const MeasurementPacientes = () => import('@/views/Pacientes/Measurement')
const AddMeasurementPacientes = () => import('@/views/Pacientes/Measurement/add')
const EditMeasurementPacientes = () => import('@/views/Pacientes/Measurement/edit')

const NutritionalPlanPacientes = () => import('@/views/Pacientes/NutritionalPlan')
const AddNutritionalPlanPacientes = () => import('@/views/Pacientes/NutritionalPlan/add')
const EditNutritionalPlanPacientes = () => import('@/views/Pacientes/NutritionalPlan/edit')

const RecommendationPacientes = () => import('@/views/Pacientes/Recommendation')
const AddRecommendationPacientes = () => import('@/views/Pacientes/Recommendation/add')
const EditRecommendationPacientes = () => import('@/views/Pacientes/Recommendation/edit')

const GoalPacientes = () => import('@/views/Pacientes/Goal')
const AddGoalPacientes = () => import('@/views/Pacientes/Goal/add')
const EditGoalPacientes = () => import('@/views/Pacientes/Goal/edit')

const AppointmentPacientes = () => import('@/views/Pacientes/Appointment')
const AddAppointmentPacientes = () => import('@/views/Pacientes/Appointment/add')
const EditAppointmentPacientes = () => import('@/views/Pacientes/Appointment/edit')

// Router
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: Home,
    },
    {
        path: '/pacientes',
        name: 'Pacientes',
        component: Pacientes,
    },
    {
        path: '/pacientes/agregar',
        name: 'AddPacientes',
        component: AddPacientes,
    },
    {
        path: '/pacientes/ver/:id',
        name: 'ViewPacientes',
        component: ViewPacientes,
    },
    {
        path: '/pacientes/metas/:id',
        name: 'GoalPacientes',
        component: GoalPacientes,
    },
    {
        path: '/pacientes/metas/:id/agregar',
        name: 'AddGoalPacientes',
        component: AddGoalPacientes,
    },
    {
        path: '/pacientes/metas/:id/ver/:goal_id',
        name: 'EditGoalPacientes',
        component: EditGoalPacientes,
    },
    {
        path: '/pacientes/citas/:id',
        name: 'AppointmentPacientes',
        component: AppointmentPacientes,
    },
    {
        path: '/pacientes/citas/:id/agregar',
        name: 'AddAppointmentPacientes',
        component: AddAppointmentPacientes,
    },
    {
        path: '/pacientes/citas/:id/ver/:appointment_id',
        name: 'EditAppointmentPacientes',
        component: EditAppointmentPacientes,
    },
    {
        path: '/pacientes/mediciones/:id',
        name: 'MeasurementPacientes',
        component: MeasurementPacientes,
    },
    {
        path: '/pacientes/mediciones/:id/agregar',
        name: 'AddMeasurementPacientes',
        component: AddMeasurementPacientes,
    },
    {
        path: '/pacientes/mediciones/:id/ver/:measurement_id',
        name: 'EditMeasurementPacientes',
        component: EditMeasurementPacientes,
    },
    {
        path: '/pacientes/plan_nutricional/:id',
        name: 'NutritionalPlanPacientes',
        component: NutritionalPlanPacientes,
    },
    {
        path: '/pacientes/plan_nutricional/:id/agregar',
        name: 'AddNutritionalPlanPacientes',
        component: AddNutritionalPlanPacientes,
    },
    {
        path: '/pacientes/plan_nutricional/:id/ver/:plan_id',
        name: 'EditNutritionalPlanPacientes',
        component: EditNutritionalPlanPacientes,
    },
    {
        path: '/pacientes/recomendaciones/:id',
        name: 'RecommendationPacientes',
        component: RecommendationPacientes,
    },
    {
        path: '/pacientes/recomendaciones/:id/agregar',
        name: 'AddRecommendationPacientes',
        component: AddRecommendationPacientes,
    },
    {
        path: '/pacientes/recomendaciones/:id/ver/:recommendation_id',
        name: 'EditRecommendationPacientes',
        component: EditRecommendationPacientes,
    },
    {
        path: '/citas',
        name: 'Citas',
        component: Citas,
    },
    {
        path: '/citas/agregar',
        name: 'AddCitas',
        component: AddCitas,
    },
    {
        path: '/citas/ver/:id/:appointment_id',
        name: 'EditCitas',
        component: EditCitas,
    },
    {
        path: '/recetas',
        name: 'Recetas',
        component: Home,
    },
    {
        path: '/alimentos',
        name: 'Alimentos',
        component: Alimentos,
    },
    {
        path: '/alimentos/agregar',
        name: 'AddAlimentos',
        component: AddAlimentos,
    },
    {
        path: '/alimentos/editar/:id',
        name: 'EditAlimentos',
        component: EditAlimentos,
    },
    {
        path: '/aporte_nutrimental',
        name: 'AporteNutrimental',
        component: AporteNutrimental,
    },
    {
        path: '/aporte_nutrimental/ver/:id',
        name: 'ViewAporteNutrimental',
        component: ViewAporteNutrimental,
    },
    {
        path: '/membresia',
        name: 'Membresia',
        component: Membresia,
    },
    {
        path: '/membresia/agregar',
        name: 'AddMembresia',
        component: AddMembresia,
    },
    {
        path: '/membresia/editar/:id',
        name: 'EditMembresia',
        component: EditMembresia,
    },
    {
        path: '/perfil_medico',
        name: 'PerfilMédico',
        component: PerfilMedico,
    },
    {
        path: '/plan_nutricional',
        name: 'PlanNutricional',
        component: PlanNutricional,
    },
    {
        path: '/plan_nutricional/agregar',
        name: 'AddPlanNutricional',
        component: AddPlanNutricional,
    },
    {
        path: '/plan_nutricional/editar/:id',
        name: 'EditPlanNutricional',
        component: EditPlanNutricional,
    },
    {
        path: '/noticias',
        name: 'Noticias',
        component: Noticias,
    },
    {
        path: '/noticias/agregar',
        name: 'AddNoticias',
        component: AddNoticias,
    },
    {
        path: '/noticias/ver/:id',
        name: 'EditNoticias',
        component: EditNoticias,
    },
    {
        path: '/noticias/orden',
        name: 'OrderNoticias',
        component: OrderNoticias,
    },
    {
        path: '/foro',
        name: 'Foro',
        component: Foro,
    },
    {
        path: '/foro/agregar',
        name: 'AddForo',
        component: AddForo,
    },
    {
        path: '/foro/ver/:id',
        name: 'EditForo',
        component: EditForo,
    },
    {
        path: '/foro/orden',
        name: 'OrderForo',
        component: OrderForo,
    },
    {
        path: '/intervencion_multidisciplinaria',
        name: 'IntervencionMultidisciplinaria',
        component: IntervencionMultidisciplinaria,
    }, 
    {
        path: '/intervencion_multidisciplinaria/agregar',
        name: 'AddIntervencionMultidisciplinaria',
        component: AddIntervencionMultidisciplinaria,
    },
    {
        path: '/intervencion_multidisciplinaria/ver/:id',
        name: 'EditIntervencionMultidisciplinaria',
        component: EditIntervencionMultidisciplinaria,
    },
    {
        path: '/documentos',
        name: 'Documentos',
        component: Documentos,
    },
    {
        path: '/documentos/agregar',
        name: 'AddDocumentos',
        component: AddDocumentos,
    },
    {
        path: '/documentos/ver/:id',
        name: 'EditDocumentos',
        component: EditDocumentos,
    },
    {
        path: '/documentos/orden',
        name: 'OrderDocumentos',
        component: OrderDocumentos,
    },
    {
        path: '/patologias',
        name: 'Patologias',
        component: Patologias,
    },
    {
        path: '/patologias/agregar',
        name: 'AddPatologias',
        component: AddPatologias,
    },
    {
        path: '/patologias/ver/:id',
        name: 'EditPatologias',
        component: EditPatologias,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// router validations
router.beforeEach((to, from) => {
    // store
    const appStore = useAppStore()
    
    // close menu
    appStore.closeMenu()

    // check session
    const publicRoutes = ['Login']

    // require session => redirect to login
    if(!publicRoutes.includes(to.name) && !appStore.hasSession) {
        if (import.meta.env.VITE_DEBUG) {
            console.log(`${to.name} require session`)
        }
        return { name: 'Login' }
    }
    else if(to.name == 'Login' && appStore.hasSession) {
        if (import.meta.env.VITE_DEBUG) {
            console.log('Prevent re-login')
        }
        return { name: 'Home' }
    }
    
    return true
})

// Export Router
export default router
