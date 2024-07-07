<template>
  <NuxtLayout name="default">

    <Head>
      <Title>Intraoral Exam</Title>
    </Head>
    <template #navbar-start>
      <span class="text-lg">INTRAORAL EXAM<span class="hidden lg:inline">INATION</span>
      </span>
    </template>
    <template #navbar-center>
      <PeriTeethVisibilityDropdown v-model="visiblePart" />
    </template>
    <template #navbar-end>
      <!-- loading -->
      <button class="btn btn-sm" v-if="examSubmissionStatus == 'pending'">
        <icon name="material-symbols:hourglass" class="text text-lg"></icon>
        Submitting
      </button>
      <button class="btn btn-sm
       btn-primary" @click="form?.submit()" v-else>
        <icon name="material-symbols:save" class="text text-lg"></icon>
        Save Changes
      </button>
      <!-- pending -->
      <!-- save changes -->
    </template>
    <dialog id="toothEditor" class="modal" ref="toothEditor">
      <ToothDialogContent @close="closeModal" @save="closeModal">
        <ToothEditor v-if="selectedTooth" :tooth="selectedTooth" />
      </ToothDialogContent>
    </dialog>
    <main class="flex flex-col gap-2 gap-y-8">
      <PrintHeader />
      <PeriPatientInfo v-if="dentalChart?.patientInfo" v-bind="dentalChart.patientInfo" />
      <peri-mouth-model class="print:scale-[0.88]" :mouth :visible-part :tooth-height="40" :tooth-width="40"
        @tooth-click="router.push({
          query: {
            toothId: $event,
          }
        }); clear()" />
      <div>
        <!-- center the form and dont occupy full width -->
        <FormKit type="form" name="intraoralExam" :id="FORM_ID"
          formClass="w-max overflow-y-scroll m-auto print:scale-90" @submit="onSubmit" :actions="false" useLocalStorage>
          <FormKitSchema :schema="intraoralExamSchema">

          </FormKitSchema>
        </FormKit>
        <LegendList class="w-max m-auto" />
        {{ examId }}
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
import { mouth } from '~/utils/peri';
import { TMD_OPTIONS, PERIODENTAL_SCREENING_OPTIONS, useIntraoralExamSchema, type IntraoralExam, APPLIANCES_OPTIONS } from '~/utils/records/intraoralExam';
import { type FormKitNode } from "@formkit/core"
import { listToBoolRecordWithBasis } from '~/utils/BoolRecord';
import { useFormKitNodeById } from "@formkit/vue"
import ToothEditor from '~/components/peri/ToothEditor.vue';
import ToothDialogContent from '~/components/peri/ToothDialogContent.vue';
const visiblePart = useLocalStorage<TeethPartVisibility>("intraoral-exam-visibility", 'all');

const router = useRouter()
const { schema: intraoralExamSchema } = useIntraoralExamSchema()

// Override layout to add the dental chart progression
definePageMeta({
  layout: false,
})
const FORM_ID = 'intraoralExam'
const form = useFormKitNodeById('intraoralExam')
const route = useRoute("dental-chart-id-intraoral-exam")
const { closeModal, selectedTooth, toothEditor } = useToothFromUrl("dental-chart-id-intraoral-exam")
const body = ref()
const { data, status: examSubmissionStatus, clear } = useFetch("/api/intraoral-exams", {
  method: "POST",
  body,
  watch: [body],
  immediate: false,
})
const { data: dentalChart } = useFetch(`/api/dental-charts/${route.params.id as any as number}`, {
  watch: [examSubmissionStatus],
})
async function onSubmit(data: IntraoralExam, node: FormKitNode) {
  if (dentalChart.value == undefined || dentalChart.value == null) {
    throw Error('Dental chart not found')
  }

  console.log(data)
  console.log(mouth.value.byId)
  body.value = {
    dentalChart: {
      id: dentalChart.value.id,
    },
    toothConditions: mouth.value.simplify(),
    ...data,
    TMD: listToBoolRecordWithBasis(TMD_OPTIONS, data.TMD),
    periodentalScreening: listToBoolRecordWithBasis(PERIODENTAL_SCREENING_OPTIONS, data.periodentalScreening),
    appliances: listToBoolRecordWithBasis(APPLIANCES_OPTIONS, data.appliances),
    otherAppliances: data.otherAppliances
  }
}

const examId = computed(() => dentalChart.value?.intraoralExam?.id)

onMounted(() => {
  if (typeof examId.value == 'number') {
    navigateTo({
      path: `/dental-chart/${route.params.id}/intraoral-exam/${examId.value}`,
    })
  }
})
watch(examId, () => {
  if (examId.value) {
    addNotif({
      id: 'intraoral-exam-submitted',
      message: 'Intraoral exam submitted',
      type: 'success',
      icon: 'material-symbols:check-circle',
      timeoutMS: 5000,
    })
    navigateTo({
      path: `/dental-chart/${route.params.id as unknown as number}/intraoral-exam/${examId.value as unknown as number}`,
    })
  }
})

</script>
