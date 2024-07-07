<template>
    <div class="text-lg">
        <div>
            Name: <span class="underline">{{ fullName }}</span>
        </div>
        <span>
            Age: <span class="underline">{{ age }}</span> Sex: <span class="underline">{{ sex }}</span>
            Date: <span class="underline">{{ today }}</span>
        </span>
    </div>
</template>
<script setup lang="ts">
import { calcAge } from '~/server/utils/dayjs';
import { toFullName } from '~/utils/records/usePatientFullName';
import { type FullName } from '~/utils/records/usePatientFullName';
const props = defineProps<FullName & {
    birthDate: string | null,
    sex: 'male'|'female',
}>()
const fullName = computed(() => toFullName(props));

const dayjs = useDayjs()
const age = computed(() => {
    return  props.birthDate ? calcAge(props.birthDate): undefined
})
// format: Month, day, year
const today = ref(dayjs().format('MMMM DD, YYYY'))
</script>
