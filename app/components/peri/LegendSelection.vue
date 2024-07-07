<template>
    <div class="legend-selection">
        <div class="form-control border-r-4">
            <h2 class="font-bold">
                Tooth Condition
            </h2>
            <LegendCheckBox 
                    v-for="label, state in Category.condition" 
                    :id="state"
                    :key="state"
                    :value="tooth.states[state]"
                    @update:model-value="tooth.states[state] = $event"
                >{{ label }}
            </LegendCheckBox>
        </div>
        <div class="form-control row-span-2">
            <h2 class="font-bold">
                Tooth Restoration and Prosthetics
            </h2>
            <LegendCheckBox 
                    v-for="label, state in Category.restorationAndProsthetics" 
                    :id="state"
                    :key="state"
                    :value="tooth.states[state]"
                    @update:model-value="tooth.states[state] = $event"
                >{{ label }}
            </LegendCheckBox>
        </div>
        <div class="form-control border-r-4">
            <h2 class="font-bold">
                Tooth Surgery
            </h2>
            <LegendCheckBox 
                    v-for="label,state in Category.surgery" 
                    :id="state"
                    :key="state"
                    :value="tooth.states[state]"
                    @update:model-value="tooth.states[state] = $event"
                >{{ label }}
            </LegendCheckBox>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Category, Tooth } from '~/utils/peri/Tooth';
import LegendCheckBox from './LegendCheckBox.vue';
const tooth = defineModel<Tooth>('tooth', {required:true});

</script>
<style scoped>
.legend-selection {
    @apply grid grid-cols-2 md:gap-x-4;
}
</style>
