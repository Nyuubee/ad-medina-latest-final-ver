<template>
    <div>
        <progress class="progress" :class="result.color" :value="result.score"
            :max="MAX_SCORE"></progress>
        <AuthCardWithList class="text-warning" v-if="result.feedback.warning" :items="[result.feedback.warning]">
            <template v-slot:card-title>
                Warnings:
            </template>
        </AuthCardWithList>
        <AuthCardWithList v-if="result.feedback.suggestions.length" :items="result.feedback.suggestions">
            <template v-slot:card-title>
                Tips:
            </template>
        </AuthCardWithList>
    </div>
</template>
<script setup lang="ts">
import { type PasswordResult, MAX_SCORE } from '~/composables/auth/useZXCVBN';

defineProps<{
    result: PasswordResult,
}>();
</script>
