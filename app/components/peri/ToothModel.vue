<template>
    <svg :width :height viewBox="0 0 200 200" class="tooth-model">
        <g transform="translate(100,100)" stroke-width="2">
            <path d="M0 0-70 70A99 99 0 0 1-70-70Z" style="z-index:1" :class="state.left" @click="emit('regionClick', 'left')"/>
            <path d="M0 0-70-70A99 99 0 0 1 70-70Z" style="z-index:2" :class="state.up" @click="emit('regionClick', 'up')" />
            <path d="M0 0 70-70A99 99 0 0 1 70 70Z" style="z-index:3" :class="state.right" @click="emit('regionClick', 'right')"/>
            <path d="M0 0 70 70A99 99 0 0 1-70 70Z" style="z-index:4" :class="state.down" @click="emit('regionClick', 'down')"/>
        </g>
        <circle cx="0" cy="0" r="50" fill="black" transform="translate(100,100)"  style="z-index:5" :class="state.center" @click="emit('regionClick','center')"/>
    </svg>
</template>
<script setup lang="ts">
import { ToothRegionState, type Region , Tooth} from '~/utils/peri/Tooth';
import { stateClasses } from '~/utils/peri';
const emit = defineEmits<{
    regionClick: [region: keyof Tooth['region']]
}>()
const props = withDefaults(defineProps<{
    region: Region<ToothRegionState>
    toothId: number
    width?: number
    height?: number
}>(), {
    width: 50,
    height: 50
})

function asStateClass(region:Region<ToothRegionState>) {
    return {
        up: stateClasses[region.up],
        down: stateClasses[region.down],
        left: stateClasses[region.left],
        right: stateClasses[region.right],
        center: stateClasses[region.center]
    }
}
const state = computed<Region<string>>(
    () => asStateClass(props.region))
</script>
<style scoped>
.tooth-model {
    --stroke-color: black;
    --hover-fill-color: wheat;
    --fill-color: white;
    --stroke-width: 0.25em;
    --tooth-cavity-color: #D22B2B;
    --tooth-restored-color:  #0047AB;
}

path, circle {
    fill: white; /** NOTE: fill must not be NONE, otherwise hovering will be wonky */
    fill: var(--fill-color);
    position: absolute;   
    stroke: var(--stroke-color);
    stroke-width: var(--stroke-width);
}
/* disable hover on mobile */
@media (pointer: fine) {
    path:hover, circle:hover {
        fill: wheat;
        fill: var(--hover-fill-color);
    }
}
g {
    pointer-events: auto;
}

svg {
    float: left;
    display: inline;
}
.has-cavity {
    fill: var(--tooth-cavity-color);
}

.was-restored {
    fill: var(--tooth-restored-color);
}
</style>
