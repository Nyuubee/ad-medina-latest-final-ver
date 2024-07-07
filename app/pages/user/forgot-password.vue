<template>
    <main class="flex flex-col items-center">

        <Head>
            <Title>Forgot Password</Title>
        </Head>
        <!-- card -->
        <div class="card bg-base-200 h-max  w-full max-w-xl self-center">
            <div class="card-body">
                <div class="card-title">Forgot password?</div>
                <!-- send email -->
                <FormKit id="send-email" type="form" :actions="false" @submit="(data) => sendFormData = data"
                    :disabled="sent">
                    <FormKit type="email" id="email" name="email" label="Enter your email" validation="required" />
                    <FormKit type="submit" label="send verification code"
                        :inputClass="{ 'btn': true, 'input-disabled': sent }" />
                    <!-- if sendStatus == pending, show loading -->
                    <div v-if="sendStatus == 'pending'">
                        Sending verification code...
                    </div>
                    <template v-if="sendStatus == 'error'">
                        <div v-if="sendError?.statusCode == 500">
                            Ooops, try again later
                        </div>
                    </template>
                </FormKit>
                <!-- verify code -->
                <template v-if="sent && (challenge == null || challenge == 'mismatch')">
                    <FormKit id="verify-code" type="form" :actions=false @submit="(data) => verifyFormData = data">
                        <!-- hidden:email -->
                        <FormKit type="hidden" id="email" name="email" :value="sendFormData.email" />
                        <FormKit type="text" id="code" autocomplete="off" name="code" label="Enter the code"
                            validation="required" />
                        <FormKit type="submit" inputClass="btn" label="Verify code" />
                        <!-- if mismatch -->
                        <div v-if="challenge == 'mismatch'" class="text-error">Invalid code</div>
                    </FormKit>
                </template>
                <!-- reset password -->
                <template v-if="challenge == 'matches'">
                    <form @submit.prevent="onSubmitNewPassword(newPassword)" class="formkit-form">
                        <!-- hidden:username -->
                        <label class="label">
                            <span class="label-text">Username:</span>
                            <span class="label-text-alt">
                                <slot name="top-right-label"></slot>
                            </span>
                        </label>
                        <input type="text" id="username" class="input input-disabled" name="username"
                            :value="target?.username" disabled />
                        <AuthNewPassword v-model="newPassword" />
                        <!-- change password -->
                        <button type="submit" class="btn btn-primary" :class="{ 'btn-disabled': tooWeak }">
                            Change password
                        </button>
                    </form>
                </template>
                <!-- show dialog when success -->
                <dialog id="informationUpdated" ref="informationUpdatedDialog" class="modal"
                    @close="navigateTo('/login')">
                    <div class="modal-box text-success-content">
                        <h3 class="font-bold text-lg">Password has been reset!</h3>
                        <p class="py-4">Press ESC key or click the button below to close</p>
                        <div class="modal-action items-center">
                            <form method="dialog" class="join flex justify-between gap-x-6 w-full">
                                <!-- if there is a button in form, it will close the modal -->
                                <!-- nuxtlink -->
                                <NuxtLink to="/login" class="btn btn-primary text-xl"> Login</NuxtLink>
                            </form>
                        </div>
                    </div>
                </dialog>
                <!-- {{ challenge }}
                {{resetStatus }} -->
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
import { arrayBufferToHex, sha256 } from '@clinic/crypto';
import { useZXCVBN } from '~/composables/auth/useZXCVBN';

definePageMeta({
    layout: 'guest',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "/",
    },
})
const sendFormData = ref<{
    email?: string
}>({
    email: undefined
})
const { data: target, status: sendStatus, error: sendError } = useFetch("/api/users/forgot-password", {
    query: sendFormData,
    immediate: false,
    watch: [sendFormData]
})

const sent = computed(() => {
    return sendStatus.value == "success" || (sendStatus.value == "error" && sendError.value?.statusCode == 403 && sendError.value?.statusMessage == "Code has not expired")
})

const verifyFormData = ref<{
    code?: string
}>({
    code: undefined
})
const { data: challenge, } = useFetch("/api/users/forgot-password/challenge", {
    body: verifyFormData,
    method: 'POST',
    immediate: false,
})

const newPassword = ref("")
const result = useZXCVBN(newPassword);
const tooWeak = computed(() => result.value.score < 1)
const hashedPassword = ref<string>()
const code = ref<string>()
const email = ref<string>()
async function onSubmitNewPassword(password: string) {
    const hashedBuffer = await sha256(password)
    hashedPassword.value = arrayBufferToHex(hashedBuffer)
    code.value = verifyFormData.value.code
    email.value = sendFormData.value.email
}
const { status: resetStatus } = useFetch("/api/users/password", {
    body: {
        newPassword: hashedPassword,
        code,
        email,
    },
    method: 'POST',
    immediate: false,
    watch: [hashedPassword]
})
watch(resetStatus, resetStatus => {
    if (resetStatus == 'success') {
        informationUpdatedDialog.value?.showModal()
    }
})
const informationUpdatedDialog = ref<HTMLDialogElement>()
</script>
<style scoped>
.formkit-form {
    @apply form-control gap-y-4;
}
</style>
