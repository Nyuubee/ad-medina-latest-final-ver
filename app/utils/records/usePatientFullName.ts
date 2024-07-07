export interface FullName {
    firstName?: string;
    middleName?: string | null;
    lastName?: string;
    suffix?: string | null;
}

export function toFullName(user: FullName) {
    return `${user.firstName} ${user.middleName ?? ''} ${user.lastName} ${user.suffix ?? ''}`
}
export function usePersonFullName(user: FullName | Ref<FullName>) {
    const _user = toRef(user);
    const fullName = computed(() => toFullName(_user.value));
    return { fullName };
}
