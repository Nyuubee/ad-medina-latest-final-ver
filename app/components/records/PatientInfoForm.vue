<template>
  <!--  :actions=false hides the  auto-added submit btn-->
  <FormKit type="group" name="patientInfo">
    <div class="font-bold gap-y-4 gap-x-8 flex flex-col xl:flex-row print:flex-row">

      <section class="first-col flex flex-col self-center gap-y-1">
        <div class="flex flex-col lg:flex-row print:flex-row gap-x-1">
          <!-- first name -->
          <FormKit type="text" inputClass="pl-1" label="First Name" name="firstName" validation="required">
          </FormKit>
          <!-- middle name -->
          <FormKit type="text" inputClass="pl-1" label="Middle Name" name="middleName">
          </FormKit>
          <!-- last name -->
          <FormKit type="text" inputClass="pl-1" label="Last Name" name="lastName" validation="required">
          </FormKit>
        </div>
        <div class="grow grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 md:max-w-sm flex-wrap">
          <!-- B-day -->
          <FormKit type="date" name="birthDate" placeholder="YYYY-MM-DD" :min="dateBefore" :max="dateBefore"
            inputClass="" v-model="birthDate" label="Birthdate" :validation="`required|date_before:${dateBefore}`"
            validation-visibility="live">
          </FormKit>
          <!-- Age -->
          <FormKit type="text" outerClass="w-max" name="age" label="Age" v-model="age" ignore readonly />
          <!-- Religion -->
          <FormKit type="text" label="Religion" name="religion" validation="required">
          </FormKit>
          <!-- Nationality -->
          <FormKit type="text" label="Nationality" name="nationality" validation="required" value="Filipino">
          </FormKit>
        </div>

        <!-- Home address -->
        <FormKit type="textarea" label="Home Address" :rows="2" inputClass="long-input" name="homeAddress"
          validation="required">
        </FormKit>
        <!-- Occupation -->
        <FormKit type="text" name="occupation" label="Occupation" validation="required">
        </FormKit>

        <!-- Dental insurance -->
        <FormKit type="text" input-class="long-input" name="insurance" label="Dental Insurance" />
        <!-- effective date -->
        <FormKit type="date" wrapperClass="!flex-row" name="effectiveDate" placeholder="YYYY-MM-DD"
          label="Effective Date" />

        <!-- For minors -->
        <template v-if="isMinor">
          <div>
            For minors: 
          </div>
          <!-- Parent/Guardian's name -->
          <FormKit type="text" label="Parent/Guardian's Name" outer-class="ml-4" input-class="long-input"
            name="parentGuardian" validation="required">
          </FormKit>
          <!-- Occupation -->
          <FormKit type="text" label="Occupation" input-class="long-input" outer-class="ml-4"
            name="parentGuardianOccupation" validation="required">
          </FormKit>
        </template>

        <!-- Whom may we thank for reffering you -->
        <FormKit type="text" labelClass="w-max" input-class="long-input" name="referrer"
          label="Whom may we thank for reffering you?" />

        <!-- Reason for dental consultation -->
        <FormKit type="text" labelClass="w-max" input-class="long-input" name="consultationReason"
          label="Reason for dental consultation:" />
      </section>

      <section class="second-col w-max">
        <!-- Gender -->
        <FormKit type="select" label="Sex" id="sex" name="sex" placeholder="sex" :options="[
          { value: '', label: 'Sex', attrs: { disabled: true }, selected: true },
          { value: 'male', label: '♂ Male' },
          { value: 'female', label: '♀ Female' }
        ]" validation="required">
        </FormKit>
        <!-- NickName -->
        <FormKit type="text" name="nickName" label="Nick Name:" />
        <!-- Home No. -->
        <FormKit type="tel" :placeholder="CONTACT_NUMBER.landline.placeholder" name="homeNumber" label="Home No.:"
          :validation="CONTACT_NUMBER.landline.matches" :help="CONTACT_NUMBER.landline.placeholder" />
        <!-- Office No. -->
        <FormKit type="text" name="officeNumber" label="Office No.:" />
        <!-- Cel/Mobile No. -->
        <FormKit type="tel" :placeholder="CONTACT_NUMBER.mobile.placeholder" :help="CONTACT_NUMBER.mobile.placeholder"
          :validation="CONTACT_NUMBER.mobile.matches" name="mobileNumber" label="Cel/Mobile No.:" />
        <!-- email address -->
        <FormKit type="email" name="email" label="Email Address:" validation="email" />
      </section>
    </div>
    <FormKitMessages class="col-span-2 text-error" />

  </FormKit>

</template>
<script setup lang="ts">
import { type FormKitNode } from "@formkit/core"
import { FormKitMessages } from '@formkit/vue'
import { calcAge } from "~/server/utils/dayjs";
import { CONTACT_NUMBER } from "~/utils/records";

defineEmits<{
  'submit': [data: any, node: FormKitNode],
}>()
function tmrw() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today
}


const tmr = tmrw();
const dateBefore = computed(() => tmr.toDateString())
const birthDate = ref<string>()
const age = computed({
  get() {
    if (birthDate.value) {
      return Math.max(calcAge(birthDate.value), 0);
    }
    return 0;
  },
  set(val: number) {
    return val;
  }
})
const isMinor = computed(() => age.value < 18)
</script>
<style scoped>
button[type=submit] {
  @apply self-center justify-self-center;
}

:deep(.long-input) {
  @apply lg:min-w-[30rem] print:min-w-[30rem];
}
</style>
