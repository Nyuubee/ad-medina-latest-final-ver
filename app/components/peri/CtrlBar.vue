<template>
    <div class="join">
        <button :disabled="!canUndo" @click="undo" class="btn join-item" type='button'>
            <Icon name="mdi:undo" class="text-xl" />
            Undo
        </button>
        <button :disabled="!canRedo" @click="redo" class="btn join-item" type='button'>
            <Icon name="mdi:redo" class="text-xl" />
            Redo
        </button>
        <!-- save -->
        <!-- <button @click="save" class="btn join-item" type='button'>
                    <Icon name="mdi:content-save" class="text-xl" />
                    Save
                </button> -->
    </div>
</template>
<script setup lang="ts">
import type { Tooth } from '~/utils/peri/Tooth';

const tooth = defineModel<Tooth>('tooth')
// defineEmits<>()
const { undo, redo, canRedo, canUndo } = useRefHistory(tooth, {
    deep: true,
})
const { Ctrl_Z, Ctrl_Y } = useMagicKeys();
whenever(Ctrl_Z, () => {
    undo();
})

whenever(Ctrl_Y, () => {
    redo();
})

</script>
