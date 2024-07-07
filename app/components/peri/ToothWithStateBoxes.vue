<template>
    <div 
        class="join join-vertical items-center w-max h-full" 
    >
        <span class="join join-vertical">
            <input type="text" class="legend-input" :class="textSize" readonly 
                :value="upperStatesStr"
            />
            <input type="text " class="legend-input" :class="textSize" readonly
                :value="lowerStatesStr"
            />
        </span>
        <span class="text-lg">{{ tooth.id }}</span>
        <ToothModel 
        :tooth-id="tooth.id"
        :region="tooth.region" 
        :height="toothHeight"
        :width="toothWidth"
        />
    </div>
</template>     
<script setup lang="ts">
import type { Tooth, ToothCategory } from '~/utils/peri/Tooth';
import ToothModel from './ToothModel.vue';
const {tooth} = defineProps<{
    tooth:Tooth
    toothHeight: number
    toothWidth: number
}>()

// All truthy states
const states = computed(() => {
    return Object
        .keys(tooth.states)
        .filter(key => tooth.states[key as ToothCategory])
}, {
    onTrigger(event) {
        // console.log(event)
    },
})
// get the 1st half of the states
const upperStatesStr = computed(() => 
    states.value
    .slice(0, states.value.length / 2)
    .join(''))

const lowerStatesStr = computed(() => 
    states.value
    .slice(states.value.length / 2)
    .join(''))

const textSize = computed(() => {
    return states.value.length <3 ? 'lg' : 'sm'
})
</script>
<style scoped>

.legend-input {
    @apply input h-8 input-ghost p-0 join-item input-bordered w-12 text-center;

    &.lg {
        @apply text-lg;
    }
    &.sm {
        @apply text-sm;
    }
}

</style>
