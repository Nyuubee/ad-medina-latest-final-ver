<template>
    <div class="form-control w-full items-center text-2xl">
        <h2 class="font-bold">
            Preview
        </h2>
        <div class="h-max flex gap-x-1">
            <div v-for="id in checkedStates">
                {{ id }}
            </div>
        </div>
        <div class="text-4xl font-bold">
            {{ tooth.id }}
        </div>
        &nbsp; 
        <!-- need an nbsp, otherwise, scaled slots would overflow above  -->
        <slot>

        </slot>
    </div>
</template>
<script setup lang="ts">
import type { Tooth, ToothCategory } from '~/utils/peri/Tooth';
defineProps<{
    checkedStates: ToothCategory[],
    tooth: Tooth
}>()
</script>
