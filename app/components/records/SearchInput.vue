<template>
    <FormKit :value="data" :id=FORM_ID :name="FORM_ID" type="form" @submit="(data, node) => $emit('search', data)"
        formClass="flex flex-col md:flex-row gap-2 text-center items-start md:items-center w-max md:w-full"
        :actions=false>
        <FormKit type="select" name="searchBy" id="searchBy" class="select select-bordered"
            :options="{ 'id': 'Patient ID', 'name': 'Name', 'date': 'Date' }" v-model="searchBy" />
        <!-- id number -->
        <FormKit type="number" name="id" id="id" min="0" placeholder="Patient ID" v-if="searchBy == 'id'" />
        <FormKit type="text" name="name" id="name" class="" placeholder="Patient name" v-if="searchBy == 'name'" />
        <!-- start date -->
        <div v-if="searchBy == 'date'" class="flex flex-wrap md:flex-nowrap items-center">
            <div class="tooltip tooltip-bottom items" data-tip="Start date">
                <FormKit type="date" name="start" id="start" class="grow" placeholder="Start Date (inclusive)" />
            </div>
            <!-- end date -->
            <span>-</span>
            <div class="tooltip tooltip-bottom" data-tip="End date">
                <FormKit type="date" name="end" id="end" class="grow" placeholder="End Date (inclusive)" />
            </div>
        </div>
        <!-- search icon -->
        <SearchSubmit>
            <FormKit type="button" id="reset" inputClass="btn btn-sm join-item" @click="$emit('search', {
                id: undefined,
                name: undefined,
                start: undefined,
                end: undefined
            }); form?.reset()">
                Clear
            </FormKit>
        </SearchSubmit>
        <slot></slot>
    </FormKit>
</template>
<script setup lang="ts">
import { useFormKitNodeById } from '~/utils/formkit';
import SearchSubmit from '../SearchSubmit.vue';

const FORM_ID = 'treatment-search'
const form = useFormKitNodeById(FORM_ID)
const searchBy = ref<'id' | 'name' | 'date'>('id')
interface Data {
    id?: number
    name?: string
    start?: string
    end?: string
}
const data = ref({
    name: ''
})
defineEmits<{
    search: [data: Data]
}>()
</script>
