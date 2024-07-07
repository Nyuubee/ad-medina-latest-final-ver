<template>
  <!-- Open the modal using ID.showModal() method -->
  <dialog class="modal" :id>
    <div class="modal-box">
      <h3 class="font-bold text-lg">New treatment record</h3>
      <FormKit type="form" id="treatment-form" form-class="group gap-y-2 flex flex-col items-center w-full"
        :actions="false" v-model=value @submit="($event) => $emit('submit', $event)">
        <FormKit type="text" name="toothNumberStr" label="Tooth Number/s" validation="required" />
        <FormKit type="text" name="procedure" label="Procedure" validation="required" />
        <FormKit type="text" name="doctor" label="Dentist" validation="required" />
        <FormKit type="number" name="amountChargedPesos" label="Amount Charged (₱)" validation="required" value="0"
          min="0" />
        <FormKit type="number" name="amountPaidPesos" label="Amount Paid (₱)" validation="required"
          :max="value?.amountChargedPesos" :min="0" value="0" />
        <div>
          <label>Balance (₱) </label>
          <span>{{ balance }}</span>
        </div>
        <FormKit type="date" name="nextAppointment" label="Next Appointment" />
        <br>
        <div class="flex items-center justify-center gap-x-4">
          <button class="btn btn-primary group-item" :onclick="`${id}.close()`">Save</button>
          <div class="modal-action mt-0">
            <form method="dialog">
              <button class="btn group-item">Cancel</button>
            </form>
          </div>
        </div>
      </FormKit>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import type { NewTreatmentRecord } from '~/utils/records/PatientInfo';

const props = defineProps<{
  doctor: any,
  patient: any,
  /**
   * dialog element's id
   */
  id: string
}>()

const balance = computed(() => (value.value?.amountChargedPesos - value.value?.amountPaidPesos))

defineEmits<{
  submit: [data: NewTreatmentRecord]
}>()
const value = ref<NewTreatmentRecord>()

watch(value, (v) => {
  // if amount paid becomes greater than amount charged, set it to amount charged
  if (v && (v.amountPaidPesos > v.amountChargedPesos)) {
    value.value!.amountPaidPesos = value.value!.amountChargedPesos
  }
})

</script>
<style>
.formkit-input[type="submit"] {
  @apply btn btn-primary;
}

.formkit-input[type="text"],
.formkit-input[type="date"] {
  @apply input input-bordered p-1 w-full !important;
}


button[type="submit"] {
  @apply self-center justify-self-center
}

.formkit-message[data-message-type="validation"] {
  @apply text-error;
}
</style>
