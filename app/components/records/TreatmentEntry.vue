<template>
    <tr @click="selected ? $emit('deselect') : $emit('select', treatment)">
        <td>
            <input class="checkbox" type="checkbox" :checked="selected" />
        </td>
        <td>
            {{ treatment.createdAt.date }}
            <br>
            {{ treatment.createdAt.time }}
        </td>
        <td>
            {{ treatment.toothNumbers }}
        </td>
        <td>
            {{ treatment.procedure }}
        </td>
        <td>
            {{ treatment.dentist }}
        </td>
        <td>
            {{ treatment.amountChargedPesos }}
        </td>
        <td>
            <div class="tooltip" data-tip="Click to pay">
                <NuxtLink :to="`/payments/${treatment.id}`" class="link" tooltip="Click to pay">
                    {{ treatment.totalPaidPesos }}
                </NuxtLink>
            </div>
        </td>
        <td>
            <!-- TODO: Quick link to payment page -->
            {{ treatment.balancePesos }}
        </td>
        <!-- <td>
            {{ treatment.nextAppointment }}
        </td> -->
    </tr>
</template>
<script setup lang="ts">
const props = defineProps<{
    treatment: {
        id: number
        createdAt: {
            date: string
            time: string
        }
        toothNumbers: string
        amountChargedPesos: number
        dentist: string
        totalPaidPesos: number
        balancePesos: number
        procedure: string
        nextAppointment?: string
    }
    selected: boolean
}>()

defineEmits<{
    select: [treatment: typeof props.treatment]
    deselect: []
}>()
</script>
