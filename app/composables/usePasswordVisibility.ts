export function usePasswordVisibility() {
    const visible = ref(false);
    /**
     * The type of the password input field.
     */
    const passwordType = computed<"text"|"password">(() => visible.value ? "text" : "password");

    function toggle() {
        visible.value = !visible.value;
    }
    return {
        visible,
        passwordType,
        toggle,
    }
}
