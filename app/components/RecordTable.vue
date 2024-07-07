<template>
  <table class="table table-sm">
    <tbody>
      <tr>
        <th v-for="column in columnHeaders">{{ column }}</th>
      </tr>
      <template v-if="records">
        <!-- @vue-expect-error -->
        <tr :class="{ 'bg-base-200': active == record }" :key="`${identifier}${record[identifier]}`"
          class="hover:cursor-pointer hover:bg-base-200" v-for="record, index in records"
          @click="$emit('click'); selectOrClear(record)">
          <td v-for="column in columnsInternal" class="hover:bg-base-300">
            <slot :name="column" :value="record[column]" :index>
              {{ record[column] }}
            </slot>
          </td>
        </tr>
      </template>
      <slot></slot>
    </tbody>
    <slot name=footer>
    </slot>
  </table>
</template>
<script setup lang="ts" generic="K extends string, V, R extends Record<K,V>">

const props = defineProps<{
  columns: [K,...K[]] | Partial<Record<K,string>>
  identifier: K
  records?: R[] | null;
}>()
defineSlots<R & {
  footer: void
  default: void
}>()
const active = defineModel<R>('active')
// const normalized
const columnHeaders = computed<string[]>(() => {
  if (Array.isArray(props.columns)) {
    return props.columns
  } else {
    return Object.values(props.columns)
  }
})
const columnsInternal = computed<K[]>(() => {
  if (Array.isArray(props.columns)) {
    return props.columns 
  } else {
    return Object.keys(props.columns) as K[]
  }
})
defineEmits<{
  click: []
}>()
function selectOrClear(r:R) {
  if (active.value == r) {
    active.value = undefined
  } else {
    active.value = r
  }
}
</script>
