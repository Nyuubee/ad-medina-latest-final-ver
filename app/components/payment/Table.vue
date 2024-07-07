<template>
    <table class="table">
        <!-- head -->
        <thead>
            <tr>
                <!-- <th></th> -->
                <th>Reference #</th>
                <th>Method</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Voided</th>
                <th class="print:hidden">Actions</th>
            </tr>
        </thead>
        <tbody class="table-auto">
            <PaymentEntry class="w-full" v-for="payment in payments" :payment :selected="selectedItem?.id == payment.id"
                @select="selectedItem = payment" @deselect="selectedItem = undefined" />
            <!-- create dummy trs based on remaining -->
            <tr v-for="i in remaining" :key="i">
                <td class="h-full p-3 block" colspan="6">&nbsp;</td>
            </tr>
        </tbody>
    </table>
</template>
<script setup lang="ts">
import { type payment } from "~/server/database/schema"
const props = defineProps<{
    payments: typeof payment.$inferSelect[],
    limit: number
}>()
const selectedItem = ref<typeof payment.$inferSelect>()
// remaining
const remaining = computed(() => {
    return props.limit - props.payments.length
})
</script>
