<template>
  <div class="flex flex-col items-center">
    <div>
      <div class="gap-y-4 gap-x-8 flex flex-col xl:flex-row">
        <!-- first name -->
        <FormKit type="text" label="First Name" name="firstName" v-model="formData.firstName" validation="required" />
        <!-- middle name -->
        <FormKit type="text" label="Middle Name" name="middleName" v-model="formData.middleName" />
        <!-- last name -->
        <FormKit type="text" label="Last Name" name="lastName" v-model="formData.lastName" validation="required" />
      </div>

      <div class="gap-y-4 gap-x-8 flex flex-col xl:flex-row">
        <!-- Appointment Date -->
        <FormKit type="date" label="Appointment Date" name="appointmentDate" v-model="formData.appointmentDate" :min="today" validation="required" />
        <!-- Start Time -->
        <FormKit type="time" label="Start Time" name="startTime" v-model="formData.startTime" validation="required" />
        <!-- End Time -->
        <FormKit type="time" label="End Time" name="endTime" v-model="formData.endTime" validation="required" />
        <!-- Purpose -->
        <FormKit type="text" label="Purpose" name="purpose" v-model="formData.purpose" validation="required" />
      </div>

      <!-- Notes -->
      <FormKit type="textarea" label="Notes" name="notes" v-model="formData.notes" placeholder="Write down notes." />

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <!-- Register button -->
      <div class="mt-4">
        <button :disabled="isSubmitted" type="submit" @click="onSubmit" class="btn btn-primary">
          <Icon name="material-symbols:add" class="text text-lg" />
          {{ isSubmitted ? 'Registered!' : 'Register' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const router = useRouter();

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

const formData = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  notes: ''
});

const isSubmitted = ref(false);
const errorMessage = ref('');

const onSubmit = async (event: Event) => {
  event.preventDefault();
  
  try {
    const response = await $fetch('/api/appointments', {
      method: 'POST',
      body: (formData.value),
    });
    response.message
    if (response.message == "Appointment created") {
      console.log('Appointment created successfully!');
      isSubmitted.value = true;
      errorMessage.value = '';
      router.push('/appointments');
    } 
    
    else {
      throw new Error(response.message || 'Failed to submit form');
    }
    
  } catch (error) {
    console.error('Error:', error);
    // errorMessage.value = error.message;
    addNotif({
      id: 'conflict',
      message: error.message,
      type: 'error',
      icon: 'material-symbols:error',
      timeoutMS: 5000,
    })
  }
}
</script>
