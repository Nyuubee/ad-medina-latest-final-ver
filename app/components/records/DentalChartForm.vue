<template>
    <ClientOnly>
        <FormKit type="form" :id="formId" :name="formId"  :value="initialValue" :useLocalStorage="useLocalStorage"
            @submit="(data, node) => $emit('submit', data, node)" v-slot="vSlot"
            form-class="w-max-4/5 text-sm flex flex-col self-center gap-y-2" :actions="false">
            <div class="divider divider-secondary print:hidden">Patient Information Record
            </div>
            <div class="print-header">
                Patient Information Record
            </div>
            <records-patient-info-form />
            <div class="break-inside-avoid">
                <div>
                    <div class="divider divider-secondary print:hidden">Dental History</div>
                    <div class="print-header">
                        Dental History
                    </div>
                    <FormKitSchema :schema="dentalRecordSchema">
                    </FormKitSchema>
                </div>
            </div>
            <div class="m divider divider-secondary print:hidden">Medical History</div>
            <div class="print-header">
                Medical History
            </div>
            <FormKitSchema :schema="medicalHistorySchema">
            </FormKitSchema>
            <slot v-bind="vSlot">

            </slot>
        </FormKit>
    </ClientOnly>
</template>
<script setup lang="ts">
import type { FormRequest, PartialFormRequest } from '~/utils/records';
import { useMedicalHistorySchema, useDentalHistorySchema } from '~/utils/records/medicalHistory';
import { type FormKitNode } from "@formkit/core"
const props = defineProps<{
    // initialValue: FormRequest,
    formId: string,
    useLocalStorage: boolean,
    initialValue?: PartialFormRequest,
}>()

defineEmits<{
    submit: [value: FormRequest, node: FormKitNode]
}>()


const { schema: medicalHistorySchema } = useMedicalHistorySchema()
const { schema: dentalRecordSchema } = useDentalHistorySchema()

</script>
<style scoped>
:deep(div[data-type=radio] .formkit-fieldset) {
    @apply flex flex-row gap-x-2;
}

:deep(div[data-type=radio] .formkit-options) {
    @apply ml-4 flex flex-row gap-x-2;
}

:deep(.formkit-option .formkit-label) {
    @apply pr-2;
}
:deep(.checkbox) {
    @apply print:scale-75;
}

.print-header {
    @apply hidden print:block text-lg font-bold;
}
</style>
