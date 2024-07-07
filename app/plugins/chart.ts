import { Chart as ChartJS, Title, Tooltip, Legend,ArcElement,DoughnutController } from 'chart.js'

/**
 * Plugin for Chart.js to work, currently just sets up Doughnut chart
 */
export default defineNuxtPlugin((nuxtApp) => {
    ChartJS.register(ArcElement, DoughnutController, Title, Tooltip, Legend, )
})
