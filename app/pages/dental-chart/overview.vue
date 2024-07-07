<template>
  <NuxtLayout name="default">
    <template #navbar-start>
    </template>
    <main class="p-2">
      <PrintHeader />
      <SearchInput @search="searchQuery = $event; refresh()">
        <RefreshButton @click="refresh()" />
      </SearchInput>
      <div class="mt-2 flex flex-wrap gap-y-4 join print:hidden">
        <NuxtLink to="/dental-chart" class="join-item btn btn-primary btn-sm">
          <Icon name="material-symbols:add" class="text text-lg" />
          New Patient
        </NuxtLink>
        <template v-if="selectedDentalChart">
          <!-- View Dental Chart -->
          <NuxtLink :to="{
            path: `/dental-chart/${selectedDentalChart.id}`,
          }" class="join-item btn btn-sm">
            <Icon name="material-symbols:edit" class="text text-lg" />
            View Dental Chart
          </NuxtLink>
          <!-- View intraoral exam -->
          <NuxtLink v-if=selectedDentalChart?.intraoralExam :to="{
            path: `/dental-chart/${selectedDentalChart.id}/intraoral-exam/${selectedDentalChart.intraoralExam?.id}`,
          }" class="join-item btn btn-sm" :class="{ 'btn-disabled': !selectedDentalChart?.intraoralExam }">
            <Icon name="material-symbols:edit" class="text text-lg" />
            View Intraoral Exam
          </NuxtLink>
          <!-- Make intraoral Exam -->
          <NuxtLink :to="{
            path: `/dental-chart/${selectedDentalChart.id}/intraoral-exam`,
            query: { dentalChartId: selectedDentalChart.id, patientId: selectedDentalChart.patient.id }
          }" class="join-item btn btn-sm" :class="{ 'btn-disabled': selectedDentalChart?.intraoralExam }">
            <Icon name="material-symbols:edit" class="text text-lg" />
            Make Intraoral Exam
          </NuxtLink>
          <!-- Treatment record -->
          <NuxtLink :to="{
            path: `/dental-chart/${selectedDentalChart.id}/treatment-record`,
          }" class="join-item btn btn-sm">
            <Icon name="material-symbols:edit" class="text text-lg" />
            Treatment Record
          </NuxtLink>
          <!-- Deselect -->
          <button class="join-item btn btn-error btn-sm" @click="deselect()">
            <Icon name="material-symbols:close" class="text text-lg" />
            Deselect
          </button>
        </template>
        <template v-else>
          <button class="join-item btn btn-sm btn-disabled">
            <Icon name="material-symbols:edit" class="text text-lg" />
            View Dental Chart
          </button>
          <button class="join-item btn btn-sm btn-disabled">
            <Icon name="material-symbols:edit" class="text text-lg" />
            View Intraoral Exam
          </button>
          <button class="join-item btn btn-sm btn-disabled">
            <Icon name="material-symbols:edit" class="text text-lg" />
            Make Intraoral Exam
          </button>
          <button class="join-item btn btn-sm btn-disabled">
            <Icon name="material-symbols:edit" class="text text-lg" />
            Treatment Record
          </button>
          <button class="join-item btn btn-sm btn-disabled">
            <Icon name="material-symbols:close" class="text text-lg" />
            Deselect
          </button>
        </template>
      </div>
      <h1 class="text-lg">Dental Records</h1>

      <table class="table">
        <thead>
          <!-- name, date, procedure -->
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Procedure</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="record of patientRecords">
            <RecordsDentalChartEntry class="hover cursor-pointer h-max"
              :class="{ 'bg-base-200': record.id == selectedDentalChart?.id }" :treatment="record.treatment"
              :fullName="record.fullName" :patientId="record.patient.id" :date="record.date"
              :selected="record.id == selectedDentalChart?.id" @select="toggle(record)" @deselect="deselect" />
          </template>
          <template v-if="patientRecords?.length == 0">
            <!-- No results -->
            <tr>
              <td colspan="5" class="text-center text-xl bg-base-200">
                <!-- Empty icon -->
                No results
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div>
        &nbsp;
      </div>
      <div class="flex w-full justify-center">
        <PageBar :canNext :canPrev :max="max" :min="page.displayedNumber" @next="next" @prev="prev" />
      </div>
      <ClientOnly>
        <PrintFooter reportPrefix="odc" />
      </ClientOnly>
    </main>
  </NuxtLayout>
</template>
<script setup lang="ts">
import PrintFooter from '~/components/PrintFooter.vue';
import PrintHeader from '~/components/PrintHeader.vue';
import RefreshButton from '~/components/RefreshButton.vue';
import SearchInput from '~/components/records/SearchInput.vue';
import { fullName } from '~/utils/records/PatientInfo';

definePageMeta({
  layout: false,
})

const dayjs = useDayjs()
// example: May 31, 2024
const DATE_FORMAT = 'MMMM DD, YYYY'
type Query = {
  id?: number | string //When clearing formkit's type:number, it becomes a string
  name?: string
  start?: string
  end?: string
}
const _search_query = ref<Query>({
  id: undefined,
  name: undefined,
  start: undefined,
  end: undefined
})
const searchQuery = useSearchQuery(_search_query)

const { data: patientRecordsCount } = useFetch("/api/dental-charts/count", {
  ...defaultCount(),
  query: searchQuery,
  watch: [searchQuery],
})
const { page, canNext, canPrev, max } = usePagination(patientRecordsCount, 8)
const { next, prev } = usePageControlFromQuery('dental-chart-overview', 'page', page)
const { data: patientRecords, refresh } = useAsyncData(
  () => {
    return $fetch(`/api/dental-charts`, {
      query: {
        limit: page.perPage,
        offset: page.offset,
        ...searchQuery.value,
      }
    })
  },
  {
    transform(data) {
      console.log(data)
      return data.map((record) => {
        return {
          ...record,
          fullName: fullName(record.patient),
          date: dayjs(record.updatedAt).format(DATE_FORMAT),
          treatment: record.treatment.map(t => ({
            createdAt: dayjs(t.createdAt).format(DATE_FORMAT),
            procedure: t.procedure,
          }))
        }
      })
    },
    watch: [() => page.current]
  })

const { selected: selectedDentalChart, toggle, deselect } = useRowSelect<Flatten<NonNullable<typeof patientRecords.value>>, number>()
</script>
