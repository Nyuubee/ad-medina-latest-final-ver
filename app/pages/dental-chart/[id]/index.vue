<template>
    <NuxtLayout name="default">
        <template #navbar-start>
            <!-- Save button -->
            <button class="btn btn-sm btn-primary" @click="formNode?.submit()">
                <icon name="material-symbols:save" class="text text-lg"></icon>
                Save changes
            </button>
        </template>
        <template #navbar-center>
            <!-- TODO -->
        </template>
        <template #navbar-end>
            <!-- Print button -->
            <PrintButton />
        </template>
        <template #dental-record>
            <li>
                <RecordsDentalChartLink />
            </li>
            <li>
                <RecordsExamLink :intraoralExamID="intraOralExamId" />
            </li>
            <li>
                <RecordsTreatmentLink />
            </li>
        </template>
        <main class="flex flex-col gap-2">
            <PrintHeader />
            <!-- TODO: patch request -->
            <RecordsDentalChartForm v-if="initialValue" :initial-value :form-id=FORM_ID @submit="onSubmit"
                :useLocalStorage=false>
            </RecordsDentalChartForm>

            <div v-if="status == 'pending'">
                Fetching patient...
            </div>
            <template v-if="status == 'error'">
                <div v-if="error?.statusCode == 404" class="card w-96 bg-base-200 shadow-xl self-center">
                    <div class="card-body">
                        <h2 class="card-title">Dental chart not found</h2>
                        <p>There's no dental chart with id: {{ route.params.id }}</p>
                        <!-- Return to overview -->
                         <div class="card-actions flex justify-center">
                            <NuxtLink to="/dental-chart/overview" class="btn btn-primary">Return to overview</NuxtLink>
                         </div>
                    </div>
                </div>
                <pre v-else>
                    {{ error }}
                </pre>
            </template>
              <PrintFooter reportPrefix="dc" />
        </main>
    </NuxtLayout>
</template>
<script setup lang="ts">
import type { FormRequest } from '~/utils/records';
import { type FormKitNode } from "@formkit/core"
import { reset as resetDentalChart, useFormKitNodeById } from "@formkit/vue"
import PrintFooter from "~/components/PrintFooter.vue";

definePageMeta({
    layout: false,
})
const FORM_ID = 'dental-chart-edit'
const formNode = useFormKitNodeById(FORM_ID)
const route = useRoute("dental-chart-id")
function resetForm() {
    resetDentalChart(FORM_ID, initialValue.value)
}

const { data: initialValue, status, error } = useFetch(`/api/dental-charts/${route.params.id as any as number}`)
watch(initialValue, initialValue => {
    console.log(initialValue)
})
const intraOralExamId = computed(() => {
    return initialValue.value?.intraoralExam?.id
})
watch(initialValue, (value) => {
    if (value) {
        formNode.value?.reset(value)
    }
})

async function onSubmit(data: FormRequest, node: FormKitNode) {
    console.log("trying to patch")
    console.log(data)
    const response = await $fetch(`/api/dental-charts/${route.params.id as any as number}`, {
        method: "patch",
        body: {
            ...data,
            id: parseInt(route.params.id),
        }
    })
    console.log("PATCHED")
    const router = useRouter()
    addNotif({
      id: 'patient-updated',
      message: 'Patient info updated',
      type: 'success',
      icon: 'material-symbols:check-circle',
      timeoutMS: 5000,
    })
    router.push(`/dental-chart/${route.params.id}?updated=true`)
}
const updated = computed(() => route.query.updated == 'true')
</script>
