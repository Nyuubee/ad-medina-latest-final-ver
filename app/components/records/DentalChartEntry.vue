<template>
    <tr @click="selected ? $emit('deselect') : $emit('select')">
        <th>
            <label>
                <input type="checkbox" class="checkbox" :checked="selected" />
            </label>
        </th>
        <td>{{ patientId }}</td>
        <td>{{ fullName }}</td>
        <template v-if="treatment.length > 1">
            <td>
                <div v-for="t of treatment">
                    {{ t.createdAt }}
                </div>
            </td>
            <td>
                <div v-for="t of treatment">
                    {{ t.procedure == '' ? "None" : t.procedure }}
                </div>
            </td>
        </template>
        <template v-else>
            <td>
                {{ date }}
            </td>
            <td>
                None
            </td>
        </template>
    </tr>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{
    patientId: number
    fullName: string
    date: string
    treatment: {
        procedure: string
        createdAt: string
    }[]
    selected: boolean
}>(), {
    treatment: () => ([])
})

defineEmits<{
    select: []
    deselect: []
}>()
</script>
