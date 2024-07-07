<template>
  <NuxtLayout name="default">
    <template #navbar-start>
      <!-- add -->
      <div class="join">
        <button class="join-item btn btn-sm btn-primary" onclick="treatmentForm.showModal()">
          <Icon name="material-symbols:add" class="h-6 w-6" />
          Add
        </button>
        <!-- Edit -->
        <!-- TODO -->
        <button class="join-item btn btn-sm btn-primary" :class="{ 'btn-disabled': !selected }"
          onclick="treatmentForm.showModal()" @click="form?.reset(selected)">
          <Icon name="material-symbols:edit" class="h-6 w-6" />
          Edit
        </button>
        <!-- view payments -->
        <NuxtLink class="join-item btn btn-sm" :to="`/payments/${selected?.id}`" :class="{ 'btn-disabled': !selected }">
          <Icon name="material-symbols:payments" class="h-6 w-6"></Icon>
          Pay
        </NuxtLink>
        <!-- Save -->
        <!-- Deselect -->
        <button class="join-item btn btn-sm btn-error" :class="{ 'btn-disabled': !selected }" @click="deselect()">
          <Icon name="material-symbols:cancel" class="h-6 w-6" />
          Deselect
        </button>
      </div>
    </template>
    <template #dental-record>
      <li>
        <RecordsDentalChartLink />
      </li>
      <li>
        <RecordsExamLink />
      </li>
      <li>
        <RecordsTreatmentLink />
      </li>
    </template>
    <dialog id="treatmentForm" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">New Treatment record</h3>
        <FormKit type="form" @submit="onSubmit" :id=FORM_ID :name="FORM_ID" :actions="false">
          <FormKit type="date" label="Treatment Date" name="createdAt" id="createdAt" :value="today"
            class="input input-bordered" placeholder="Date" />
          <FormKit type="text" label="Tooth numbers" name="toothNumbers" id="toothNumbers" class="input input-bordered"
            placeholder="Tooth Numbers" />
          <FormKit type="textarea" label="Procedure" name="procedure" id="procedure" class="input input-bordered"
            placeholder="Procedures" />
          <FormKit type="text" label="Amount Charged" name="amountChargedPesos" id="amountChargedPesos"
            class="input input-bordered" placeholder="Amount Charged" />
          <FormKit type="hidden" label="Next appointment" name="nextAppointment" id="nextAppointment"
            class="input input-bordered" placeholder="Next Appointment Date" />
        </FormKit>
        <p class="py-4">Press ESC key or click the button below to close</p>
        <div class="modal-action">
          <form method="dialog" class="flex w-full place-content-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
            <button class="btn btn-primary" @click="form?.submit()">
              <Icon name="material-symbols:save" class="h-6 w-6" />
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <main>
      <PrintHeader />
      <template v-if="treatments?.patient" >
        <PeriPatientInfo v-bind="treatments?.patient" />
      </template>

      <div v-if="status == 'pending'">
        <h2>Loading...</h2>
      </div>
      <table class="table table-sm [&_th]:p-1 [&_td]:p-1" v-if="status == 'success'">
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Tooth Numbers</th>
            <th>Procedure</th>
            <th>Dentist/s</th>
            <th>Amount Charged</th>
            <th>Amount Paid</th>
            <th>Balance</th>
            <!-- <th>Next Appointment Date</th> -->
          </tr>
        </thead>
        <tbody>
          <RecordsTreatmentEntry v-for="treatment in treatments" :treatment="treatment"
            :selected="selected?.id == treatment.id" @select="toggle(treatment)" @deselect="deselect"
            :class="{ 'bg-base-200': selected?.id == treatment.id }" />
        </tbody>
      </table>
      <ClientOnly>
        <PrintFooter  reportPrefix="tr" />
      </ClientOnly>
    </main>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useFormKitNodeById } from "@formkit/vue";
import type { treatment as treatmentTable } from "~/server/database/schema";
import type { SubmitHandler } from "~/utils/formkit";
import PeriPatientInfo from "~/components/records/PeriPatientInfo.vue";
import { fullName } from "~/utils/records/PatientInfo";
definePageMeta({
  layout: false,
})
type SubmitTreatment = Omit<typeof treatmentTable.$inferInsert, 'updatedAt' | 'amountChargedCentavos'> & {
  amountChargedPesos: number
};

const dayjs = useDayjs()
const FORM_ID = 'treatment'
const form = useFormKitNodeById(FORM_ID)
const today = dayjs().format('YYYY-MM-DD')
const route = useRoute("dental-chart-id-treatment-record")
const { data: treatments, status, refresh } = useAsyncData(async () => {
  const treatments = await $fetch(`/api/treatments?dentalChartId=${route.params.id}`)
  console.log(treatments)
  return treatments.map(({ payments, createdAt, dentalChart, ...treatment }) => {

    const totalPaidCentavos = sum(payments, "amountPaidCentavos")
    const date = dayjs(createdAt).format('MMMM DD, YYYY')
    const time = dayjs(createdAt).format('hh:mm A')
    const balance = treatment.amountChargedCentavos - totalPaidCentavos

    return {
      ...treatment,
      createdAt: {
        date,
        time
      },
      dentist: fullName(dentalChart.user),
      balancePesos: balance / 100,
      amountChargedPesos: treatment.amountChargedCentavos / 100,
      totalPaidPesos: totalPaidCentavos / 100,
      patient: dentalChart.user,
    }
  })
})

const { selected, deselect, toggle } = useRowSelect<NonNullable<Flatten<typeof treatments.value>>, number>()

const onSubmit: SubmitHandler<SubmitTreatment> = async (data, node) => {
  console.log(data)
  if (data.id) {
    // patch instead
    const response = await $fetch(`/api/treatments/${data.id}`, {
      method: 'PATCH',
      body: {
        dentalChartId: route.params.id,
        amountChargedCentavos: data.amountChargedPesos * 100,
        ...data,
      }
    })
    await refresh()
    form.value?.reset({})
    return
  }
  await $fetch('/api/treatments', {
    method: 'POST',
    body: {
      dentalChartId: route.params.id,
      amountChargedCentavos: data.amountChargedPesos * 100,
      ...data,
    }
  })

  addNotif({
    id: 'treatment-record-submitted',
    message: 'Treatment record submitted',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
  })
  form.value?.reset()
  await refresh()
}
</script>
