<template>
  <main>
    <PrintHeader />
    <div class="flex flex-col justify-center">
      <div class="tabs tabs-bordered" role="tablist">
        <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Appointment Requests" checked />
        <div role="tabpanel" class="tab-content p-10">
          <!-- Appointment request -->
          <div class="overflow-x-auto">
            <div class="relative mb-4 flex justify-between">
              <div class="input-group  print:hidden">
                <select v-model="searchField" class="select select-bordered">
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="appointmentDate">Appointment Date</option>
                </select>
                <template v-if="searchField === 'appointmentDate'">
                  <input type="date" placeholder="Search by date" v-model="searchQuery" class="input input-bordered" />
                </template>
                <template v-else>
                  <input type="text" placeholder="Search appointments" v-model="searchQuery"
                    class="input input-bordered" />
                </template>
              </div>
              <div class="input-group print:hidden">
                <select v-model="sortField" class="select select-bordered">
                  <option value="id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="appointmentDate">Sort by Date</option>
                </select>
                <select v-model="sortOrder" class="select select-bordered">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Appointment Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Purpose</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(appointment, index) in paginatedAppointments" :key="appointment.id" class="bg-base-200">
                  <th>
                    <label>
                      <input type="checkbox" class="checkbox" :value="appointment.id"
                        @change="toggleSelection(appointment, $event)" :checked="isSelected(appointment.id)" />
                    </label>
                  </th>
                  <th>{{ appointment.id }}</th>
                  <td>{{ appointment.firstName }} {{ appointment.middleName }} {{ appointment.lastName }}</td>
                  <td>{{ new Date(appointment.appointmentDate).toLocaleDateString() }}</td>
                  <td>{{ appointment.startTime }}</td>
                  <td>{{ appointment.endTime }}</td>
                  <td>{{ appointment.purpose }}</td>
                  <td>{{ appointment.notes }}</td>
                  <td>{{ appointment.status }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <th class=" print:hidden">Actions:</th>
                  <td class="print:hidden">
                    <button @click="navigateToUpdate" class="btn btn-success join-item"
                      :class="{ 'btn-disabled': selectedAppointments.length !== 1 }">
                      <Icon name="material-symbols:edit" class="text text-lg" />
                      Update
                    </button>
                  </td>
                  <td class="print:hidden">
                    <NuxtLink to="/appointments/add" class="btn btn-primary join-item">
                      <Icon name="material-symbols:add" class="text text-lg" />
                      Add
                    </NuxtLink>
                  </td>

                </tr>
              </tbody>
            </table>
            <div class="flex justify-center mt-4">
              <PageBar :canNext="currentPage < totalPages" :canPrev="currentPage > 1" :max="totalPages"
                :min="currentPage" @next="nextPage" @prev="prevPage" class="scale-75" />
            </div>
          </div>
        </div>

        <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Completed" />
        <div role="tabpanel" class="tab-content p-10">
          <!-- Completed Appointments -->
          <div class="overflow-x-auto">
            <div class="relative mb-4 flex justify-between">
              <div class="input-group">
                <select v-model="completedSearchField" class="select select-bordered">
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="appointmentDate">Appointment Date</option>
                </select>
                <template v-if="completedSearchField === 'appointmentDate'">
                  <input type="date" placeholder="Search by date" v-model="completedSearchQuery"
                    class="input input-bordered" />
                </template>
                <template v-else>
                  <input type="text" placeholder="Search completed appointments" v-model="completedSearchQuery"
                    class="input input-bordered" />
                </template>
              </div>
              <div class="input-group">
                <select v-model="completedSortField" class="select select-bordered">
                  <option value="id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="appointmentDate">Sort by Date</option>
                </select>
                <select v-model="completedSortOrder" class="select select-bordered">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Appointment Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Purpose</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in paginatedCompletedAppointments" :key="appointment.id">
                  <td>{{ appointment.id }}</td>
                  <td>{{ appointment.firstName }} {{ appointment.middleName }} {{ appointment.lastName }}</td>
                  <td>{{ new Date(appointment.appointmentDate).toLocaleDateString() }}</td>
                  <td>{{ appointment.startTime }}</td>
                  <td>{{ appointment.endTime }}</td>
                  <td>{{ appointment.purpose }}</td>
                  <td>{{ appointment.notes }}</td>
                  <td>{{ appointment.status }}</td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-center mt-4">
              <PageBar :canNext="completedCurrentPage < completedTotalPages" :canPrev="completedCurrentPage > 1"
                :max="completedTotalPages" :min="completedCurrentPage" @next="nextCompletedPage"
                @prev="prevCompletedPage" class="scale-75" />
            </div>
          </div>
        </div>

        <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Cancelled" />
        <div role="tabpanel" class="tab-content p-10">
          <!-- Cancelled Appointments -->
          <div class="overflow-x-auto">
            <div class="relative mb-4 flex justify-between">
              <div class="input-group">
                <select v-model="cancelledSearchField" class="select select-bordered">
                  <option value="id">ID</option>
                  <option value="name">Name</option>
                  <option value="appointmentDate">Appointment Date</option>
                </select>
                <template v-if="cancelledSearchField === 'appointmentDate'">
                  <input type="date" placeholder="Search by date" v-model="cancelledSearchQuery"
                    class="input input-bordered" />
                </template>
                <template v-else>
                  <input type="text" placeholder="Search cancelled appointments" v-model="cancelledSearchQuery"
                    class="input input-bordered" />
                </template>
              </div>
              <div class="input-group">
                <select v-model="cancelledSortField" class="select select-bordered">
                  <option value="id">Sort by ID</option>
                  <option value="name">Sort by Name</option>
                  <option value="appointmentDate">Sort by Date</option>
                </select>
                <select v-model="cancelledSortOrder" class="select select-bordered">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Appointment Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Purpose</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in paginatedCancelledAppointments" :key="appointment.id">
                  <td>{{ appointment.id }}</td>
                  <td>{{ appointment.firstName }} {{ appointment.middleName }} {{ appointment.lastName }}</td>
                  <td>{{ new Date(appointment.appointmentDate).toLocaleDateString() }}</td>
                  <td>{{ appointment.startTime }}</td>
                  <td>{{ appointment.endTime }}</td>
                  <td>{{ appointment.purpose }}</td>
                  <td>{{ appointment.notes }}</td>
                  <td>{{ appointment.status }}</td>
                </tr>
              </tbody>
            </table>
            <div class="flex justify-center mt-4">
              <PageBar :canNext="cancelledCurrentPage < cancelledTotalPages" :canPrev="cancelledCurrentPage > 1"
                :max="cancelledTotalPages" :min="cancelledCurrentPage" @next="nextCancelledPage"
                @prev="prevCancelledPage" class="scale-75" />
            </div>
          </div>
        </div>

        <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Appointment Statistics" />
        <div role="tabpanel" class="tab-content p-10">
          <!-- Appointment Statistics -->
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Appointment Requests</div>
              <div class="stat-value">{{ appointmentRequestCount }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Completed Appointments</div>
              <div class="stat-value">{{ completedCount }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Cancelled Appointments</div>
              <div class="stat-value">{{ cancelledCount }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Total Appointments</div>
              <div class="stat-value">{{ totalCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientOnly>
      <PrintFooter reportPrefix="ap" />
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageBar from './PageBar.vue';

interface Appointment {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  notes: string;
  status: string;
}

const appointments = ref<Appointment[]>([]);
const completedAppointments = ref<Appointment[]>([]);
const cancelledAppointments = ref<Appointment[]>([]);
const selectedAppointments = ref<Appointment[]>([]);
const searchQuery = ref('');
const searchField = ref('id');
const sortField = ref('id');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const itemsPerPage = 10;

const completedSearchQuery = ref('');
const completedSearchField = ref('id');
const completedSortField = ref('id');
const completedSortOrder = ref<'asc' | 'desc'>('asc');
const completedCurrentPage = ref(1);

const cancelledSearchQuery = ref('');
const cancelledSearchField = ref('id');
const cancelledSortField = ref('id');
const cancelledSortOrder = ref<'asc' | 'desc'>('asc');
const cancelledCurrentPage = ref(1);

const fetchAppointments = async () => {
  try {
    const response = await fetch('/api/appointments');
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    const data = await response.json();
    appointments.value = data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

const fetchCompletedAppointments = async () => {
  try {
    const response = await fetch('/api/completed-appointments');
    if (!response.ok) {
      throw new Error('Failed to fetch completed appointments');
    }
    const data = await response.json();
    completedAppointments.value = data;
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
  }
};

const fetchCancelledAppointments = async () => {
  try {
    const response = await fetch('/api/cancelled-appointments');
    if (!response.ok) {
      throw new Error('Failed to fetch cancelled appointments');
    }
    const data = await response.json();
    cancelledAppointments.value = data;
  } catch (error) {
    console.error('Error fetching cancelled appointments:', error);
  }
};

const toggleSelection = (appointment: Appointment, event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    selectedAppointments.value = [appointment];
  } else {
    selectedAppointments.value = [];
  }
};

const isSelected = (id: number) => {
  return selectedAppointments.value.some(app => app.id === id);
};

const filteredAppointments = computed(() => {
  return appointments.value.filter(appointment => {
    const searchTerm = searchQuery.value.toLowerCase();
    if (searchField.value === 'id') {
      return appointment.id.toString().includes(searchTerm);
    } else if (searchField.value === 'name') {
      const fullName = `${appointment.firstName} ${appointment.middleName} ${appointment.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    } else if (searchField.value === 'appointmentDate') {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      return appointmentDate.includes(searchTerm);
    }
    return false;
  });
});

const filteredCompletedAppointments = computed(() => {
  return completedAppointments.value.filter(appointment => {
    const searchTerm = completedSearchQuery.value.toLowerCase();
    if (completedSearchField.value === 'id') {
      return appointment.id.toString().includes(searchTerm);
    } else if (completedSearchField.value === 'name') {
      const fullName = `${appointment.firstName} ${appointment.middleName} ${appointment.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    } else if (completedSearchField.value === 'appointmentDate') {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      return appointmentDate.includes(searchTerm);
    }
    return false;
  });
});

const filteredCancelledAppointments = computed(() => {
  return cancelledAppointments.value.filter(appointment => {
    const searchTerm = cancelledSearchQuery.value.toLowerCase();
    if (cancelledSearchField.value === 'id') {
      return appointment.id.toString().includes(searchTerm);
    } else if (cancelledSearchField.value === 'name') {
      const fullName = `${appointment.firstName} ${appointment.middleName} ${appointment.lastName}`.toLowerCase();
      return fullName.includes(searchTerm);
    } else if (cancelledSearchField.value === 'appointmentDate') {
      const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      return appointmentDate.includes(searchTerm);
    }
    return false;
  });
});

const sortedAppointments = computed(() => {
  return filteredAppointments.value.slice().sort((a, b) => {
    let fieldA: any, fieldB: any;
    if (sortField.value === 'name') {
      fieldA = `${a.firstName} ${a.middleName} ${a.lastName}`.toLowerCase();
      fieldB = `${b.firstName} ${b.middleName} ${b.lastName}`.toLowerCase();
    } else if (sortField.value === 'appointmentDate') {
      fieldA = new Date(a.appointmentDate);
      fieldB = new Date(b.appointmentDate);
    } else {
      fieldA = a[sortField.value];
      fieldB = b[sortField.value];
    }

    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const sortedCompletedAppointments = computed(() => {
  return filteredCompletedAppointments.value.slice().sort((a, b) => {
    let fieldA: any, fieldB: any;
    if (completedSortField.value === 'name') {
      fieldA = `${a.firstName} ${a.middleName} ${a.lastName}`.toLowerCase();
      fieldB = `${b.firstName} ${b.middleName} ${b.lastName}`.toLowerCase();
    } else if (completedSortField.value === 'appointmentDate') {
      fieldA = new Date(a.appointmentDate);
      fieldB = new Date(b.appointmentDate);
    } else {
      fieldA = a[completedSortField.value];
      fieldB = b[completedSortField.value];
    }

    if (fieldA < fieldB) return completedSortOrder.value === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return completedSortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const sortedCancelledAppointments = computed(() => {
  return filteredCancelledAppointments.value.slice().sort((a, b) => {
    let fieldA: any, fieldB: any;
    if (cancelledSortField.value === 'name') {
      fieldA = `${a.firstName} ${a.middleName} ${a.lastName}`.toLowerCase();
      fieldB = `${b.firstName} ${b.middleName} ${b.lastName}`.toLowerCase();
    } else if (cancelledSortField.value === 'appointmentDate') {
      fieldA = new Date(a.appointmentDate);
      fieldB = new Date(b.appointmentDate);
    } else {
      fieldA = a[cancelledSortField.value];
      fieldB = b[cancelledSortField.value];
    }

    if (fieldA < fieldB) return cancelledSortOrder.value === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return cancelledSortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedAppointments.value.slice(start, end);
});

const paginatedCompletedAppointments = computed(() => {
  const start = (completedCurrentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedCompletedAppointments.value.slice(start, end);
});

const paginatedCancelledAppointments = computed(() => {
  const start = (cancelledCurrentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedCancelledAppointments.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAppointments.value.length / itemsPerPage);
});

const completedTotalPages = computed(() => {
  return Math.ceil(filteredCompletedAppointments.value.length / itemsPerPage);
});

const cancelledTotalPages = computed(() => {
  return Math.ceil(filteredCancelledAppointments.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const nextCompletedPage = () => {
  if (completedCurrentPage.value < completedTotalPages.value) {
    completedCurrentPage.value++;
  }
};

const nextCancelledPage = () => {
  if (cancelledCurrentPage.value < cancelledTotalPages.value) {
    cancelledCurrentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const prevCompletedPage = () => {
  if (completedCurrentPage.value > 1) {
    completedCurrentPage.value--;
  }
};

const prevCancelledPage = () => {
  if (cancelledCurrentPage.value > 1) {
    cancelledCurrentPage.value--;
  }
};

const router = useRouter();

const navigateToUpdate = () => {
  if (selectedAppointments.value.length === 1) {
    const appointment = selectedAppointments.value[0];
    router.push({
      path: '/appointments/update',
      query: {
        id: appointment.id
      }
    });
  }
};

const appointmentRequestCount = computed(() => appointments.value.length);
const completedCount = computed(() => completedAppointments.value.length);
const cancelledCount = computed(() => cancelledAppointments.value.length);
const totalCount = computed(() => appointmentRequestCount.value + completedCount.value + cancelledCount.value);

onMounted(() => {
  fetchAppointments();
  fetchCompletedAppointments();
  fetchCancelledAppointments();
});
</script>
