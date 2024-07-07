<template>
 <div class="flex items-center md:items-baseline gap-2 justify-evenly [&_>_.card]:bg-base-200">
        <div class="card card-compact md:card-normal items-center w-max">
            <div class="card-body">
                <div class="card-title">
                    {{ $props.label_daily }}
                </div>
                <div class="flex items-center">
                    {{prefix}} {{ $props.daily }}{{ $props.suffix }}
                    <div class="radial-progress" :style="`--value:${percent_daily};`" role="progressbar">
                        {{percent_daily}}%</div>
                </div>
            </div>
        </div>
        <div class="card card-compact md:card-normal items-center w-max">
            <div class="card-body">
                <div class="card-title">
                    {{ $props.label_weekly }}
                </div>
                <div class="flex items-center">
                    {{prefix}} {{ $props.weekly }}{{ $props.suffix }}
                    <div class="radial-progress" :style="`--value:${percent_weekly};`" role="progressbar">{{percent_weekly}}%</div>
                </div>
            </div>
        </div>
        <div class="card card-compact md:card-normal items-center w-max">
            <div class="card-body">
                <div class="card-title">
                    {{ $props.label_monthly }}
                </div>
                <div class="flex items-center">
                    {{prefix}} {{ $props.monthly }}{{ $props.suffix }}
                    <div>&nbsp;</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
interface Stat {
    daily:number
    weekly:number
    monthly:number
    label_daily:string
    label_weekly:string
    label_monthly:string
    prefix?:string
    suffix?:string
}
const props = withDefaults(defineProps<Stat>(), {
    monthly:1,
})

const safe_monthly = computed(() => {
    return props.monthly == 0 ? 1:props.monthly
})
const percent_weekly = computed(() => {
    return ((props.weekly / safe_monthly.value) * 100).toFixed(2)
})
const percent_daily = computed(() => {
    return ((props.daily / safe_monthly.value) * 100).toFixed(2)
})
</script>
