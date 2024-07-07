<template>
    <FormKit type="form" :id :name="id" formClass="flex flex-col gap-2 justify-center w-full" :actions=false
        @submit="(data) => $emit('submit', data)" :value="supplier">
        <!-- Supplier name -->
        <FormKit type="text" id="name" name="name" placeholder="Supplier name" label="Supplier name"
            validation="required" />
        <!-- Supplier address -->
        <FormKit type="text" id="address" name="address" placeholder="Supplier address" label="Address"
            validation="required" />
            <slot></slot>
    </FormKit>
</template>
<script setup lang="ts">
import type { suppliers } from '~/server/database/schema';
import { useFormKitNodeById } from '~/utils/formkit';

defineEmits<{
    submit: [value: typeof suppliers.$inferInsert]
}>()

const props = defineProps<{
    id: string
    supplier?: typeof suppliers.$inferSelect
}>()

const form = computed(() => {
    const f = useFormKitNodeById(props.id)
    return f.value
})
watch(() => props.supplier, (value) => {
    if (value) {
        form.value?.reset(value)
    }
})

</script>
