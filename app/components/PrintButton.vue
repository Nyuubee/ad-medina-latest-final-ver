<template>
    <button class="btn btn-sm btn-primary" @click="goPrint()">
        <Icon name="material-symbols:print" class="text text-lg"></Icon>
        Print
    </button>
</template>
<script setup lang="ts">
function goPrint() {
    window.print()
}
</script>
