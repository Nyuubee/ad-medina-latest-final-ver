<template>
   <div class="mouth" v-if=mouth>
        <template v-if="visiblePart == 'all'">
            <!-- Show all -->
            <!-- Temporary Upper Left -->
            <div class="temp-u-l left-row">
                <div class="position-labels text-end">
                    <div>STATUS</div>
                    <div class="pt-4">RIGHT</div>
                    <div class="text-center pt-4">
                        <div>TEMPORARY</div>
                        <div>TEETH</div>
                    </div>
                </div>
                <ToothWithStateBoxes
                v-for="tooth in mouth.temporary.upperLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                :tooth
                />
            </div>
            <!-- Temporary Upper Right -->
            <div class="temp-u-r right-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.upperRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
                <div class="position-labels">
                    <div>&nbsp;</div>
                    &nbsp;
                    <div>Left</div>
                </div>
            </div>
            <!-- Permanent Upper Left -->
            <div class="p-u-l left-row justify-end lower-row">
                <div class="permanent-label">
                    PERMANENT 
                    <br />
                    TEETH
                </div>
                    <!-- Tooth 18 to 11 -->
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.upperLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Permanent Upper Right -->
            <div class="p-u-r right-row lower-row">
                <!-- Teeth 21 to 28 -->
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.upperRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Permanent Lower Left -->
            <!-- Teeth 48 to 41 -->
            <div class="p-l-l left-row upper-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.lowerLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
                <!-- Permanent Lower Right -->
            <!-- Teeth 31 to 38 -->
            <div class="p-l-r right-row upper-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.lowerRight" 
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Temporary Lower Left -->
            <!-- Teeth 85 to 81 -->
            <div class="t-l-l left-row justify-end">
                <div class="position-labels text-end">
                    <div class="text-center">
                        <div>TEMPORARY</div>
                        <div>TEETH</div>
                    </div>
                    <div>&nbsp;</div>
                    <div>STATUS</div>
                    <div class="pt-2">RIGHT</div>
                </div>
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.lowerLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Temporary Lower Right -->
            <div class="t-l-r right-row">
                <!-- Teeth 71 to 75 -->
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.lowerRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
                <div class="position-labels">
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>Left</div>
                </div>
            </div>
        </template>
        <template v-else-if="visiblePart == 'temporary'">
            <!-- Show only temporary -->
            <div class="temp-u-l left-row lower-row">
                <div class="position-labels text-end">
                    <div>STATUS</div>
                    <div class="pt-4">RIGHT</div>
                    <div class="text-center pt-4">
                        <div>TEMPORARY</div>
                        <div>TEETH</div>
                    </div>
                </div>
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.upperLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
             <!-- Temporary Upper Right -->
             <div class="temp-u-r right-row lower-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.upperRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
                <div class="position-labels">
                    <div>&nbsp;</div>
                    &nbsp;
                    <div>Left</div>
                </div>
            </div>
              <!-- Temporary Lower Left -->
            <!-- Teeth 85 to 81 -->
            <div class="t-l-l left-row justify-end upper-row ">
                <div class="position-labels text-end">
                    <div class="text-center">
                        <div>TEMPORARY</div>
                        <div>TEETH</div>
                    </div>
                    <div>&nbsp;</div>
                    <div>STATUS</div>
                    <div class="pt-2">RIGHT</div>
                </div>
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.lowerLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Temporary Lower Right -->
            <div class="t-l-r right-row upper-row">
                <!-- Teeth 71 to 75 -->
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.temporary.lowerRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
                <div class="position-labels">
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>Left</div>
                </div>
            </div>
        </template>
        <template v-else-if="visiblePart == 'permanent'">
            <!-- Show only permanent -->
            <!-- Permanent Upper Left -->
            <div class="p-u-l left-row justify-end lower-row">
                <div class="permanent-label">
                    PERMANENT 
                    <br />
                    TEETH
                </div>
                    <!-- Tooth 18 to 11 -->
                    <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.upperLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Permanent Upper Right -->
            <div class="p-u-r right-row lower-row">
                <!-- Teeth 21 to 28 -->
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.upperRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Permanent Lower Left -->
            <!-- Teeth 48 to 41 -->
            <div class="p-l-l left-row upper-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.lowerLeft"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
            <!-- Permanent Lower Right -->
            <!-- Teeth 31 to 38 -->
            <div class="p-l-r right-row upper-row">
                <ToothWithStateBoxes
                :tooth-height="toothHeight"
                :tooth-width="toothWidth"
                v-for="tooth in mouth.permanent.lowerRight"  
                @click="emit('toothClick', tooth.id)"
                :tooth
                />
            </div>
        </template>
   </div>
</template>
<script setup lang="ts">
import type {TeethPartVisibility} from '~/utils/peri';
import ToothWithStateBoxes from './ToothWithStateBoxes.vue';
import type { Mouth } from '~/utils/peri/Mouth';
defineProps<{
    visiblePart: TeethPartVisibility
    mouth: Mouth
    toothHeight: number
    toothWidth: number
}>() 
const emit =defineEmits<{
    toothClick: [toothId: number]
}>()

</script>
<style scoped>
.mouth {
    @apply grid grid-cols-2 justify-center;
}
.left-row {
    @apply flex justify-end border-r-2 border-base-content gap-x-[0.2rem];
}
.right-row {
    @apply flex justify-start border-l-2 border-base-content gap-x-[0.2rem];
}

.upper-row {
    @apply border-t-2 border-base-content p-1 h-full;
}

.lower-row {
    @apply border-b-2 border-base-content p-1 h-full;
}
.teeth-row {
    @apply flex flex-row justify-center;
}
.position-labels {
    @apply flex flex-col pr-2 pl-2 bg-base-100;
}

.permanent-label {
    @apply position-labels h-max rotate-[270deg] text-center justify-center relative top-[83%] left-[3%];
}
</style>
../utils
