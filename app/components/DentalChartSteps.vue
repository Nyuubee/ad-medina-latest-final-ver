<template>
    <ul class="steps steps-vertical lg:steps-horizontal">
        <li class="step" :class="stepClass[i]" v-for="(step, i) in steps">
            {{ step }}
        </li>
    </ul>
</template>
<script setup lang="ts">
import {chartSteps as steps} from '#imports'
const {progress} = defineProps<{
    progress: number
}>()

const stepClass = computed(() => {
    return steps.map((step, i) => {
        return i < progress ? 'step-primary' : ''
    })
})
</script>
