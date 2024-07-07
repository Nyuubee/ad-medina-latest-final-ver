<template>
    <div>
        <!-- search by id, name (combination of firstName, middleName, lastName), email, birthdate,sex -->
        <FormKit type="form" @submit="(data) => searchQuery = data" :actions=false
            formClass="flex gap-x-2 gap-y-2 flex-wrap lg:flex-nowrap text-center items-center">
            <FormKit type="number" name="id" id="id" class="" placeholder="User ID" />
            <FormKit type="text" name="name" id="name" class="" placeholder="Name" />
            <FormKit type="text" name="email" id="email" class="" placeholder="Email" />
            <span class="flex flex-nowrap">
                Birthdate:
                <div class="tooltip tooltip-bottom" data-tip="Brithdate">
                    <FormKit type="date" name="birthdate" id="birthdate" class=""
                    placeholder="Birthdate" label="" />
                </div>
            </span>   
            <FormKit type="select" name='sex' :options="[{ label: 'sex', value: '' }, 'male', 'female']"
                placeholder="Sex" />
            <SearchSubmit>
            </SearchSubmit>
            <RefreshButton @click="refresh()" />
        </FormKit>
        <RecordTable :records="users" :columns="UpperCamelCase" identifier="id">
            <tr v-show="!users" class="text-center text-lg">
                <td class="text-lg" colspan="20">No users found</td>
            </tr>
            <template #footer>
                <tfoot class="flex flex-col w-full justify-center" colspan='0'>
                    <PageBar class="scale-75" :canNext :canPrev :max :min="page.displayedNumber" @next="next"
                        @prev="prev" />
                </tfoot>
            </template>
        </RecordTable>
    </div>
</template>
<script setup lang="ts">
type SearchQuery = {
    id?: number | string //When clearing formkit's type:number, it becomes a string
    name?: string
    email?: string
    birthdate?: string
}
const _searchQuery = ref<SearchQuery>({
    id: undefined,
    name: undefined,
    email: undefined,
    birthdate: undefined
})
const searchQuery = useSearchQuery(_searchQuery)
const { data: count } = useFetch("/api/users/count",
    {
        ...defaultCount(),
        query: searchQuery,
        watch: [searchQuery]
    }
)
const { page, max, canPrev, canNext, limit, offset } = usePagination(count, 4)
const { next, prev } = usePageControlFromQuery('admin', 'userslist', page)

const { data: users, refresh } = useAsyncData(
    async() => {
        // Fetch with query unless all fields are empty
        return $fetch(`/api/users`, {
            query: {
                ...searchQuery.value,
                limit: limit.value,
                offset: offset.value,
            },
        })
    },
    {
        watch: [searchQuery, () => page.current]
    }
)
const { columns: _columns } = useColumns(users)
const UpperCamelCase = computed<Record<string, string>>(() => {
    return _columns.value.reduce((acc, column) => {
        // convert lowerCamelCase to UpperSpacedCamelCase
        acc[column] = column.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
        return acc
    }, {} as Record<string, string>)
})
</script>
