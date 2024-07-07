<template>
    <FormKit type="form" :id :name="id"
        @submit="(data) => $emit('submit', data)" :value="supply" form-class="flex flex-col gap-2 justify-center w-full" :actions=false>
        <!-- Dropdown of dental supplies categories -->
         <!-- id:hidden -->
        <FormKit type="hidden" name="id" id="id" :value="undefined" />
        <!-- Supply name -->
        <FormKit type="text" id="name" name="name" placeholder="Item name" label="Item name" />
        <!-- category:textbox -->
        <!-- <FormKit type="text" id="category" name="category" placeholder="Category" label="Category" validation="required|lowercase" /> -->
        <!-- category:dropdown -->
         <!-- options: restorative,  prosthodontics, surgery, orthodontic, miscallenous -->
        <FormKit type="select" id="category" name="category" placeholder="Category" label="Category" validation="required" :options="{
            restorative: 'Restorative',
            prosthodontics: 'Prosthodontics',
            surgery: 'Surgery',
            orthodontic: 'Orthodontic',
            generalMaterials: 'General Materials'
        }" />
        <!-- Description -->
        <FormKit type="textarea" id="description" name="description"  placeholder="Item description" label="Description" />
        <!-- Quantity -->
        <FormKit type="number" id="quantity" name="quantity" placeholder="Quantity" label="Quantity" validation="required|min:0" />
        <!-- Unit -->
        <FormKit type="text" id="unit" name="unit" placeholder="Unit of measurement" label="Unit" validation="required" />
        <!-- Critical level -->
        <FormKit type="number" id="criticalevel" name="criticalLevel" placeholder="Critical Level" label="Critical Level" validation="required|min:0" />
        <!-- Supplier:dropdown -->
        <FormKit type="select" id="supplier" name="supplier" placeholder="Supplier" label="Supplier" validation="required" :options />
        <slot></slot>
    </FormKit>
</template>

<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import {supplies as suppliesTable} from "~/server/database/schema/supplies"
import { useFormKitNodeById } from '~/utils/formkit';

const {data:suppliers} = useFetch("/api/supplies/suppliers")
const options = computed(() => {
    return suppliers.value?.map(s => s.name ) ?? []
})
const props = defineProps<{
    id:string
    supply?: typeof suppliesTable.$inferSelect
}>()

const form = computed(() => {
    const f =  useFormKitNodeById(props.id)
    return f.value
})
watch(() => props.supply, (value) => {
    if (value) {
        form.value?.reset(value)
    }
})

defineEmits<{
    submit: [value: typeof suppliesTable.$inferInsert]
}>()

</script>
