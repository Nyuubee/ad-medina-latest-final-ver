<template>
  <div class="flex flex-col items-center">
    <div>
      <div class="gap-y-4 gap-x-8 flex flex-col xl:flex-row">
        <!-- First name -->
        <FormKit type="text" label="First Name" name="firstName" v-model="formData.firstName" validation="required"/>
        <!-- Middle name -->
        <FormKit type="text" label="Middle Name" name="middleName" v-model="formData.middleName"/>
        <!-- Last name -->
        <FormKit type="text" label="Last Name" name="lastName" v-model="formData.lastName" validation="required"/>
      </div>

      <div class="gap-y-4 gap-x-8 flex flex-col xl:flex-row">
        <!-- Appointment Date -->
        <FormKit type="date" label="Appointment Date" name="appointmentDate" onkeydown="return false" v-model="formData.appointmentDate" :min="today" validation="required"/>
        <!-- Start Time -->
        <FormKit type="time" label="Start Time" name="startTime" v-model="formData.startTime" validation="required"/>
        <!-- End Time -->
        <FormKit type="time" label="End Time" name="endTime" v-model="formData.endTime" validation="required"/>
        <!-- Purpose -->
        <FormKit type="text" label="Purpose" name="purpose" v-model="formData.purpose" validation="required"/>
      </div>

      <!-- Notes -->
      <FormKit type="textarea" label="Notes" name="notes" v-model="formData.notes" placeholder="Write down notes." />

      <!-- Status -->
      <div class="mt-4">
        <label for="status">Status </label>
        <select v-model="formData.status" class="select select-bordered" name="status">
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Update button -->
      <div class="mt-4">
        <button :disabled="isSubmitted" type="submit" @click="onSubmit" class="btn btn-primary">
          <Icon name="material-symbols:edit" class="text text-lg" />
          {{ isSubmitted ? 'Updated!' : 'Update' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

interface FormData {
  id: number
  firstName: string
  middleName: string
  lastName: string
  appointmentDate: string
  startTime: string
  endTime: string
  purpose: string
  notes: string
  status: string
}

const route = useRoute();
const router = useRouter();
const formData = ref<FormData>({
  id: 0,
  firstName: '',
  middleName: '',
  lastName: '',
  appointmentDate: '',
  startTime: '',
  endTime: '',
  purpose: '',
  notes: '',
  status: 'Scheduled'
});

const isSubmitted = ref(false);

const fetchAppointment = async (id: number) => {
  try {
    const response = await fetch(`/api/appointments/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch appointment');
    }
    const data = await response.json();
    formData.value = {
      id: data.id,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      notes: data.notes,
      status: data.status
    };
  } catch (error) {
    console.error('Error fetching appointment:', error);
  }
};

onMounted(() => {
  const id = route.query.id;
  if (id) {
    fetchAppointment(Number(id));
  }
});

const onSubmit = async (event: Event) => {
  event.preventDefault();

  try {
    const response = await $fetch(`/api/appointments/${formData.value.id}`, {
      method: 'PUT',
      body: formData.value
    });
    console.log(response)
    if (response.message == "Appointment updated") {
      console.log('Appointment updated successfully!');
      isSubmitted.value = true;
      router.push('/appointments');
    } else {
      throw new Error('Failed to update form');
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
  } 
};

// const moveAppointment = async (appointment: FormData) => {
//   const endpoint = appointment.status === 'Completed' ? '/api/completed-appointments' : '/api/cancelled-appointments';
//   try {
//     const response = await $fetch(endpoint, {
//       method: 'POST',
//       body: appointment
//     });
//     if (response.message !== `${appointment.status} appointment created`) {
//       throw new Error(`Failed to create ${appointment.status} appointment`);
//     }
//     const deleteResponse = await $fetch(`/api/appointments/${appointment.id}`, {
//       method: 'DELETE'
//     });
//     if (deleteResponse.message !== 'Appointment deleted') {
//       throw new Error('Failed to delete appointment');
//     }
//     console.log(`${appointment.status} appointment moved successfully!`);
//     router.push('/appointments/appointments'); // Add redirect after moving the appointment
//   } catch (error) {
//     // console.error(`Error moving ${appointment.status} appointment:`, error);
//   }
// };
</script>
