<template>
    <div class="text-2xl print:self-start">
        Revenue (₱):
    </div>
    <div class="flex flex-col w-full items-center">
        <div class="w-64 md:w-max">
            <Doughnut id="revenue-chart" :data="chartData" :options style="height:inherit; width:inherit">
            </Doughnut>
        </div>
        <!-- <input type="date" v-model="_date" class="m-auto" /> -->
    </div>
    <div class="self-start text-start hidden print:block">
        <!-- label: today -->
        <p>
            Today: ₱ {{ revenue.daily }}
        </p>
        <!-- week -->
        <p>
            This Week: ₱ {{ revenue.weekly }}
        </p>
        <!-- month -->
        <p>
            This Month: ₱ {{ revenue.monthly }}
        </p>
    </div>

</template>
<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { useToday } from '~/utils/payment';
const {  dayjs } = useToday()
const _date = ref()
const target = computed(() => {
    return dayjs(_date.value)
})
const date = computed(() => {
    return {
        // day
        start: target.value.startOf('day').toISOString(),
        // week
        startOfWeek: target.value.startOf('week').toISOString(),
        // month
        month: target.value.startOf('month').toISOString(),
    }
})
const dailyQuery = computed(() => {
    return {
        start: date.value.start,
        length: 1,
        interval: 'day'
    }
})
const { data: daily } = useFetch('/api/payments/stats', {
    query: dailyQuery,
})

const weeklyQuery = computed(() => {
    return {
        start: date.value.startOfWeek,
        length: 1,
        interval: 'week'
    }
})
// weekly
const { data: weekly } = useFetch('/api/payments/stats', {
    query: weeklyQuery,
})

// monthly
const month = dayjs().startOf('month').toISOString()
const monthlyQuery = computed(() => {
    return {
        start: month,
        length: 1,
        interval: 'month'
    }
})
const { data: monthly } = useFetch('/api/payments/stats', {
    query: monthlyQuery,
})

function toPesos(centavos: number = 0) {
    return parseInt((centavos / 100).toFixed(2))
}
const revenue = computed(() => {
    return {
        daily: toPesos(daily.value?.totalPaidCentavos),
        weekly: toPesos(weekly.value?.totalPaidCentavos),
        monthly: toPesos(monthly.value?.totalPaidCentavos),
    }
})

const chartData = computed(() => {
    return {
        labels: ['Today', 'This Week', 'This Month'],
        datasets: [{
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [revenue.value.daily, revenue.value.weekly, revenue.value.monthly],
            labels: ['Today', 'This Week', 'This Month'],
        }],
    }
})
const plugin = {
    id: 'emptyDoughnut',
    afterDraw(chart: { data?: any; chartArea?: any; ctx?: any; }, args: any, options: { color: any; width: any; radiusDecrease: any; }) {
        const { datasets } = chart.data;
        const { color, width, radiusDecrease } = options;
        let hasData = false;

        for (let i = 0; i < datasets.length; i += 1) {
            const dataset = datasets[i];
            hasData |= dataset.data.length > 0;
        }

        if (!hasData) {
            const { chartArea: { left, top, right, bottom }, ctx } = chart;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const r = Math.min(right - left, bottom - top) / 2;

            ctx.beginPath();
            ctx.lineWidth = width || 2;
            ctx.strokeStyle = color || 'rgba(255, 128, 0, 0.5)';
            ctx.arc(centerX, centerY, (r - radiusDecrease || 0), 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
};
const options = {
    responsive: true,
    plugins: {
        emptyDoughnut: {
            color: 'rgba(255, 128, 0, 0.5)',
            width: 2,
            radiusDecrease: 20
        },
        tooltip: {
            enabled: true,
        },
        legend: {
            display: true,
        },
    }
    //   maintainAspectRatio: false
}

</script>
