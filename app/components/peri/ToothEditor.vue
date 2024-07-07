<template>
  <div class="grid md:grid-cols-3 gap-x-2">
    <!-- On small screen width, put  preview at the top and make this grid a column layout -->
    <!-- Legends -->
    <LegendSelection v-model:tooth="tooth" class="md:col-span-2" />
    <!-- need to add padding-bottom cause teeth is being scaled -->
    <ToothPreview :checked-states :tooth class="row-start-1 pb-10 md:pb-0 md:row-start-auto">
      <ToothModel :tooth-id="tooth.id" :region="tooth.region" @region-click="region => tooth?.nextRegionState(region)"
        style="--stroke-width: 2; scale:2" />
    </ToothPreview>
  </div>
</template>
<script setup lang="ts">
import { Tooth } from '~/utils/peri/Tooth';
import LegendSelection from './LegendSelection.vue';
import ToothModel from './ToothModel.vue';
import ToothPreview from './ToothPreview.vue';

const tooth = defineModel<Tooth>('tooth', {required: true});

const checkedStates = computed(() => {
  return Object.entries(tooth.value?.states ?? {})
    .filter(([_, truthy]) => truthy)
    .map(([key]) => key as keyof Tooth['states']);
})

</script>
