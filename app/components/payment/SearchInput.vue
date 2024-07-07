<template>
    <FormKit :value="data" :id=FORM_ID :name="FORM_ID" type="form" @submit="(data, node) => $emit('search', data)"
        formClass="flex flex-col md:flex-row gap-2 text-center items-start md:items-center w-max md:w-full" :actions=false>
        <!-- searchBy seelct: id, method, start date & end date -->
        <FormKit type="select" name="searchBy" id="searchBy"
            :options="{ 'id': 'Reference #', 'method': 'Payment Method', 'date': 'Date' }" v-model="searchBy" />
        <!-- id number -->
        <FormKit type="number" name="id" id="id" min="0" inputClass="w-24" placeholder="Reference #" v-if="searchBy == 'id'" />
        <!-- payment method -->
        <FormKit type="select" name="method" id="method" inputClass="select select-bordered" :options="anyPayment"
            v-if="searchBy == 'method'" />
        <!-- start date -->
        <div v-if="searchBy == 'date'" class="flex flex-wrap md:flex-nowrap items-center">
            <div class="tooltip tooltip-bottom" data-tip="Start date (inclusive)">
                <FormKit type="date" name="start" id="start" placeholder="Start Date" />
            </div>
            <!-- end date -->
            <span>-</span>
            <div class="tooltip tooltip-bottom" data-tip="End date (inclusive)">
                <FormKit type="date" name="end" id="end" placeholder="End Date" />
            </div>
        </div>
        <SearchSubmit>
            <FormKit type="button" id="reset" inputClass="btn btn-sm join-item" @click="$emit('search', {
                id: undefined,
                start: undefined,
                end: undefined,
                method: undefined
            }); form?.reset()">
                Clear
            </FormKit>
        </SearchSubmit>
        <slot></slot>
    </FormKit>
</template>
<script setup lang="ts">
import { useFormKitNodeById } from '~/utils/formkit';
import { PaymentMethodEnumValues, type PaymentMethodTypes } from '~/utils/payment';
const anyPayment = [{ label: 'any', value: '' }, ...PaymentMethodEnumValues,]
const FORM_ID = 'treatment-search'
const form = useFormKitNodeById(FORM_ID)
const searchBy = ref<'id' | 'method' | 'date'>('id')
interface Data {
    id?: number
    method?: PaymentMethodTypes
    start?: string
    end?: string
}
const data = ref({})
defineEmits<{
    search: [data: Data]
}>()

</script>
