<template>
    <!-- dialog -->
    <!-- w/ formkit checkboxes -->
    <dialog :id class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Edit Roles</h3>
            <div class="modal-body" v-if="auth">
                <!-- username -->
                 <div>
                    User: {{ auth.username }}
                 </div>
                <FormKit :id="FORM_ID" name="FORM_ID" type="form" @submit="onSubmit" :actions=false :value="rolesRecord">
                    <!-- for role in roles -->
                    <FormKit type="checkbox" v-for="role in ROLES" :key="role" :id="role" :name="role" :label="role"/>
                </FormKit>
            </div>
            <div class="modal-action items-center">
                <form method="dialog" class="join flex justify-between gap-x-6 w-full">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-error" @click="formNode?.reset()">
                        <Icon name="material-symbols:close"></Icon>
                        Close
                    </button>
                    <!-- save -->
                    <button class="btn btn-success" @click.prevent="formNode?.submit()">
                        <Icon name="material-symbols:save"></Icon>
                        Save
                    </button>
                </form>
            </div>
        </div>
    </dialog>
</template>
<script setup lang="ts">
import type { Roles } from '~/server/database/schema';
import { useFormKitNodeById, type SubmitHandler } from '~/utils/formkit';
const FORM_ID = 'edit-roles-form'
const formNode = useFormKitNodeById(FORM_ID)
const props = defineProps<{
    id: string,
    auth?: {
        username: string,
        userId: number,
    }
}>()
const ROLES: Roles[] = ['admin', 'doctor', 'inventory_manager', 'receptionist']
const { data: roles, refresh } = useAsyncData(async () => {
    if (props.auth?.userId) {
        return await $fetch(`/api/users/${props.auth?.userId}/roles`)
    } else {
        return []
    }
}, {
    watch: [() => props.auth?.userId],
})
const rolesRecord = computed(() => listToBoolRecordWithBasis(ROLES, roles.value?.map(r => r.role)  ?? []))
watch(() => props.auth?.userId, async() => await refresh())
// watch roleslist, set form
watch(rolesRecord, (roles) => {
    formNode.value?.reset(roles)
})

// createa {value:boolean, label:string}[] from ROLES, set false if not in roles
const justNewRoles = ref<Roles[]>([]);
const {data, status, execute} = useAsyncData(async() => {
    return await $fetch(`/api/users/${props.auth?.userId}/roles`, {
        method: 'PATCH',
        body: {
            roles: justNewRoles.value,
            userId: props.auth?.userId
        }
    })
}, {
    immediate: false,
})

const onSubmit:SubmitHandler<Record<Roles,boolean>> = async(value, node) => {
    justNewRoles.value = boolRecordWithBasisToList(ROLES, value)
    await execute()
    await refresh()
}
</script>
