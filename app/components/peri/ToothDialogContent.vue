<template>
    <div class="modal-box max-w-[max-content]">
        <div class="modal-action mt-0">
            <form method="dialog" class="flex w-full place-content-between">
                <!-- if there is a button in form, it will close the modal -->
            <h3 class="font-bold text-lg">Teeth Editor</h3>
                <button class="btn btn-sm btn-circle " @click="$emit('close')">
                    <Icon name="material-symbols:close" class="h-6 w-6" />
                </button>
                <!-- <button class="btn btn-primary" @click="$emit('save')">
                    <Icon name="material-symbols:save" class="h-6 w-6" />
                    Save
                </button> -->
            </form>
        </div>
        <slot>

        </slot>
    </div>
</template>
<script setup lang="ts">
defineEmits<{
    close: [],
    save: []
}>()
</script>
