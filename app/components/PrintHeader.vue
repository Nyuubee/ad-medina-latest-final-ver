<template>
    <div class="hidden print-header text-center print:!flex flex-col items-center">
        <div class="flex flex-row  justify-center justify-items-center">
            <div class="avatar mr-4">
                <div class="w-10 rounded-full">
                    <img src="/public/favicon-57.png"></img>
                </div>
            </div>
            <div class="text-lg font-bold self-center">
                AD Medina Dental Clinic
            </div>
        </div>
        <div class="text-sm">
            623 Herodotus St. Vista Verde Executive Village,<wbr> Cainta, Rizal.
        </div>
        <div>
            <Icon name="material-symbols:call" class="text-2xl" />
            Mobile number:
            <span class="font-bold">
                09693008750
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
.print-header {
    @apply hidden print:block;
}
</style>
