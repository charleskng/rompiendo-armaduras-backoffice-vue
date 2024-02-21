<script>
import moment from 'moment'

export default {
    install: (app) => {

        const dateShort = ({
            date,
            with_time = false,
        }) => {
            // init date
            date = moment(date, 'YYYY-MM-DD HH:mm:ss')
            
            // Month label
            let month_index = parseInt(date.format('M')) - 1
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', "Jul", 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const month = months[month_index]

            let date_short = `${date.format('DD')} ${month} ${date.format('YYYY')}`

            if (with_time) {
                date_short += ` ${date.format('hh:mm a')}`
            }

            return date_short
        }

        const timeFormat = ({
            date,
        }) => {
            // Prepare options
            date = moment(date, 'YYYY-MM-DD HH:mm:ss')

            // Date
            return date.format('hh:mm a')
        }

        // Define plugin
        const common = {
            dateShort,
            timeFormat,
        }

        // Register plugin
        app.config.globalProperties.$common = common
        app.provide('common', common)
    }
}
</script>
