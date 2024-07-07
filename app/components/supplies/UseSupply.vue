<template>
  <!-- FormKit:Form -->
  <dialog :id class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Use Supply</h3>
      <ClientOnly>
        <FormKit :id="formId" :name="formId" type="form" :actions="false" @submit="(data) => deduct(data)" :value="supply">
          <div>
            {{ supply?.name }}
          </div>
          <div>
            <!-- text: available -->
            Available: {{ supply?.quantityLeft }}
            <!-- is critical -->
            <Icon v-if="supply?.isCriticalLevel" name="material-symbols:warning" class="text-error h-4 w-4" />

          </div>
          <!-- quantity: number > 0, disabled if empty -->
          <FormKit type="number" id="quantityToUse" name="quantityToUse" placeholder="Use quantity" label="Use quantity"
            :validation="`required|min:0|maxQuantity`" 
            :validation-rules="{ maxQuantity }"
            :validation-messages="{
              maxQuantity: 'Quantity must be less than or equal to available quantity'
            }" 
            />

          <div class="modal-action">
          </div>
        </FormKit>
      </ClientOnly>
      <!-- show: SuppliesUse -->
      <div class="modal-action">
  
      <form method="dialog" class="flex w-full place-content-between">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-error">Close</button>
        <button class="btn btn-primary" @click.prevent="form?.submit()">
          <Icon name="material-symbols:save" class="h-6 w-6" />
          Use
        </button>
      </form>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import type { supplies } from '~/server/database/schema';
import { useFormKitNodeById, type FormKitNode } from '~/utils/formkit';

const props = defineProps<{
  id: string
  formId: string
  supply?: typeof supplies.$inferInsert & {quantityLeft:number, isCriticalLevel:boolean}
}>()


const form = computed(() => {
  const f = useFormKitNodeById(props.formId)
  return f.value
})

watch(() => props.supply, (value) => {
  if (value) {
    form.value?.reset(value)
  }
})

const editBody = ref<{
  id: number,
  quantityToUse: number,
}>()

const { status: editStatus, clear: clearEdit } = useAsyncData(async () => {
  console.log(editBody.value)
  if (editBody.value?.id) {
    const response = await $fetch(`/api/supplies/${editBody.value.id}/consume`, {
      method: 'PATCH',
      body: {
        id: editBody.value.id,
        quantityUsed: editBody.value.quantityToUse,
      },
    })
    return response
  }
}, {
  watch: [editBody],
  immediate: false,
})

const { add: showEditNotif } = useNotifWithControl({
  body: editBody,
  formkitForm: form,
  dialogId: 'edit_supply_dialog',
  notif: {
    message: 'Supply updated',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
    id: 'edit-supply',
  }
});
watch(editStatus, (editStatus) => {
  if (editStatus == 'success') {
    showEditNotif();
    // close self
    (document.getElementById(props.id) as HTMLDialogElement | undefined)?.close()
  }
})

function deduct(value: { quantityToUse: number }) {
  // deduct the quantity from the supply
  if (props.supply == undefined ||  props.supply.id == undefined) {
    throw Error('Supply is not loaded')
  }

  editBody.value = {
    id: props.supply.id,
    quantityToUse: value.quantityToUse
  }
}

function maxQuantity(node:FormKitNode<number>) {
  if (props.supply == undefined) {
    return
  }

  if (node.value <= props.supply.quantityLeft) {
    return true
  }
  return false
}
</script>
