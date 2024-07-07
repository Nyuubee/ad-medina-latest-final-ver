<template>
    <NuxtLayout name="default">
        <Head>
            <Title>Intraoral Exam:{{ route.params.exam_id }}</Title>
        </Head>
        <template #navbar-start>
            <span class="text-lg">INTRAORAL EXAM<span class="hidden lg:inline">INATION</span>
            </span>
        </template>
        <template #navbar-center>
            <PeriTeethVisibilityDropdown v-model="visiblePart" />
        </template>
        <template #navbar-end>
            <!-- save changes -->
            <div class="join">
                <button class="join-item btn btn-sm
       btn-primary" @click="form?.submit()">
                    <icon name="material-symbols:save" class="text text-lg"></icon>
                    Save Changes
                </button>
                <PrintButton class="join-item" />
            </div>
        </template>
        <template #dental-record>
            <li>
                <RecordsDentalChartLink />
            </li>
            <li>
                <!-- @vue-ignore -->
                <RecordsExamLink :intraoralExamID="$route.params.exam_id" />
            </li>
            <li>
                <RecordsTreatmentLink />
            </li>
        </template>
        <dialog id="toothEditor" class="modal" ref="toothEditor">
            <ToothDialogContent @close="closeModal" @save="closeModal">
                <ToothEditor v-if="selectedTooth" :tooth="selectedTooth" />
            </ToothDialogContent>
        </dialog>
        <main class="flex flex-col gap-2 gap-y-8">
            <PrintHeader />
            <PeriPatientInfo v-if="data" v-bind="data.dentalChart.patient" />
            <peri-mouth-model class="print:scale-[0.88]" :tooth-height="40" :tooth-width="40" v-if="mouth" :mouth
                :visible-part @tooth-click="router.push({
                    query: {
                        toothId: $event,
                    }
                })" />
            <div>
                <!-- center the form and dont occupy full width -->
                <FormKit v-if="data" type="form" name="intraoralExam"
                    formClass=" w-max overflow-y-scroll m-auto print:scale-90" :id=FORM_ID @submit="onSubmit"
                    :actions="false" :value="data">
                    <FormKitSchema :schema="intraoralExamSchema">

                    </FormKitSchema>
                </FormKit>
                <LegendList class="w-max m-auto" />
            </div>
            <ClientOnly>
            <PrintFooter reportPrefix="int" />
            </ClientOnly>
        </main>
    </NuxtLayout>
</template>
<script setup lang="ts">
import PeriPatientInfo from '~/components/records/PeriPatientInfo.vue';
import LegendList from '~/components/peri/LegendList.vue';
import type { TeethPartVisibility } from '~/utils/peri';
import { PERIODENTAL_SCREENING_OPTIONS, TMD_OPTIONS, APPLIANCES_OPTIONS, useIntraoralExamSchema, type IntraoralExam, OCCLUSION_OPTIONS } from '~/utils/records/intraoralExam';
import ToothEditor from '~/components/peri/ToothEditor.vue';
import { type FormKitNode } from "@formkit/core"
import { useFormKitNodeById } from "@formkit/vue"
import { Mouth } from '~/utils/peri/Mouth';
import { mouth } from '~/utils/peri';
import ToothDialogContent from '~/components/peri/ToothDialogContent.vue';
import type { SimplifiedTooth } from '~/utils/peri/Tooth';

const visiblePart = useLocalStorage<TeethPartVisibility>("intraoral-exam-visibility", 'all');

const router = useRouter()
const { schema: intraoralExamSchema } = useIntraoralExamSchema()
// Override layout to add the dental chart progression
definePageMeta({
    layout: false,
})

const FORM_ID = 'intraoralExam'
const form = useFormKitNodeById(FORM_ID)
const route = useRoute('dental-chart-id-intraoral-exam-exam_id')
const { closeModal, selectedTooth, toothEditor } = useToothFromUrl("dental-chart-id-intraoral-exam")

const { data } = useAsyncData(async () => {
    return await $fetch(`/api/intraoral-exams/${route.params.exam_id}`)
}, {
    watch: [() => route.params.exam_id],
})
onMounted(() => {
    if (data.value) {
        mouth.value = Mouth.fromSimplified(data.value.toothConditions)
        form.value?.reset(data.value)
    }
})
watch(data, data => {
    if (data) {
        mouth.value = Mouth.fromSimplified(data.toothConditions)
        form.value?.reset(data)
    }
})

const headers = useRequestHeaders(['cookie']) as HeadersInit

function prepRestoreExtraFields<T extends SimplifiedTooth>(basis: T[]) {
    console.log(basis)
    return (tooth: SimplifiedTooth): T | undefined => {
        console.log("target", tooth)
        const remoteVer = basis.find(remoteVer => {
            return remoteVer.toothId == tooth.toothId
        })
        console.log(remoteVer)
        if (remoteVer) {
            return {
                ...remoteVer, // copy all the extra fields
                ...tooth, // then overwrite with the new values
            }
        }
    }
}

const body = ref()
const { data: examPatchResponse, status: examSubmissionStatus } = useFetch(`/api/intraoral-exams/${route.params.exam_id}`, {
    method: 'PATCH',
    body,
    watch: [body],
    immediate: false,
})

async function onSubmit(exam: IntraoralExam, node: FormKitNode) {
    console.log(data.value)
    if (data.value == null) {
        throw Error('Data is not loaded')
    }
    if (mouth.value == null) {
        throw Error('Mouth is not loaded')
    }
    const restoreExtraFields = prepRestoreExtraFields(data.value.toothConditions)
    const toothConditions = mouth.value.simplify().map(t => {
        const restored = restoreExtraFields(t)
        if (restored) {
            return restored
        }
        return t // keep the new ones
    });
    console.log(data.value.toothConditions, toothConditions)
    console.log("orig TMD", data.value.TMD)
    body.value = {
        ...exam,
        toothConditions,
        TMD: {
            ...listToBoolRecordWithBasis(TMD_OPTIONS, exam.TMD),
            id: data.value.ids.TMD,
        },
        periodentalScreening: {
            ...data.value.periodentalScreening,
            ...listToBoolRecordWithBasis(PERIODENTAL_SCREENING_OPTIONS, exam.periodentalScreening),
            id: data.value.ids.periodentalScreening,
        },
        appliances: {
            ...data.value.appliances,
            ...listToBoolRecordWithBasis(APPLIANCES_OPTIONS, exam.appliances),
            others: exam.otherAppliances,
            id: data.value.ids.appliances,
        },
        xrayTaken: {
            ...data.value.xrayTaken,
            ...exam.xrayTaken,
        },
        occlusion: {
            ...data.value.occlusion,
            ...listToBoolRecordWithBasis(OCCLUSION_OPTIONS, exam.occlusion.occlusion),
        },
    }
}
watch(examSubmissionStatus, status => {
    if (status === 'success') {
        addNotif({
            id: 'intraoral-exam-updated',
            message: 'Intraoral exam updated',
            type: 'success',
            icon: 'material-symbols:check-circle',
            timeoutMS: 5000,
        })
    }
})
</script>
