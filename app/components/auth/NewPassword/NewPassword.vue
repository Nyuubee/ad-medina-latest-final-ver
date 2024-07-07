<template>
    <label class="label">
        <span class="label-text text-xl">Enter a <strong>strong</strong> password:</span>
        <!-- <span class="label-text text-xl">
            Empty for now
        </span> -->
    </label>
    <PasswordVisibilityControl>
        <template #default="{passwordType}">
            <input class="grow" :class="{'input-error':isInvalid}" :type="passwordType" name="new-password" id="new-password" autocomplete="new-password"  placeholder="password here"
            :minlength="MIN_PASSWORD_LENGTH" v-model="password" required  @input="onInput"/>
        </template>
      </PasswordVisibilityControl>
    <label class="label">
        <AuthNewPasswordBotLeftLabel :rating="result" v-if="result" />
        <AuthNewPasswordBotRightLabel :needed="needed" />
    </label>
    <AuthNewPasswordStrengthChecker :result="result" v-if="result" />
</template>
<script setup lang="ts">
import useInvalid from '~/composables/auth/useInvalid';
import { useZXCVBN } from '~/composables/auth/useZXCVBN';
import PasswordVisibilityControl from '../PasswordVisibilityControl.vue';
/** 
 * Combines the Top & Bot labels with the input field based on
 * @see https://daisyui.com/components/input/#with-form-control-and-labels 
 * 
*/

const MIN_PASSWORD_LENGTH = 8;
const password = defineModel<string>({
    default:""
});
const result = useZXCVBN(password);
provide("result", result);
const needed = computed(() => Math.max(MIN_PASSWORD_LENGTH - password.value.length, 0));

const {isInvalid, onInput} = useInvalid();
</script>
