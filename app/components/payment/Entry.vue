<template>
    <tr class="hover:bg-base-200" :class="selectedClass" @click="selected ? $emit('deselect') : $emit('select', payment)">
        <!-- <td class="">
            <label>
                <input type="checkbox" class="checkbox" :checked="selected" />
            </label>
        </td> -->
        <td>
            <div class="h-full">
                {{ payment.id }}
            </div>
        </td>
        <td>{{ payment.method }}</td>
        <td>{{ paymentTime }}</td>
        <td>Php {{ paidPesos }}</td>
        <td v-if="payment.voidedAt">Voided</td>
        <td v-else>No</td>
        <td class="print:hidden">
            <NuxtLink :to="`/payments/${payment.treatmentId}`" class="btn btn-sm">
                View payment
            </NuxtLink>
        </td>
    </tr>
</template>
<script setup lang="ts">
import { type payment } from "~/server/database/schema"
const props = defineProps<{
    payment: typeof payment.$inferSelect,
    selected: boolean
}>()
const dayjs = useDayjs()
// Example: "January 1, 2022 12:00 AM"
const TIME_FORMAT = "MMMM D, YYYY h:mm A"
const paymentTime = computed(() => dayjs(props.payment.createdAt).format(TIME_FORMAT))
const paidPesos = computed(() => (props.payment.amountPaidCentavos / 100).toFixed(2))
defineEmits<{
    select: [payment: typeof payment.$inferSelect]
    deselect: []
}>()
const selectedClass = computed(() => props.selected ? 'bg-base-200' : '')
</script>
