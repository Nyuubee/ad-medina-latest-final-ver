<template>
    <div class="formkit-actions join w-full">
        <!-- search icon -->
        <div class="tooltip tooltip-bottom" data-tip="Click or Press enter">
            <FormKit type="submit" inputClass="btn join-item btn-sm btn-secondary" wrapperClass="flex flex-row" label="Search">
                <template #prefixIcon>
                    <Icon name="material-symbols:search" class="text text-lg" />
                </template>
            </FormKit>
        </div>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">

</script>
