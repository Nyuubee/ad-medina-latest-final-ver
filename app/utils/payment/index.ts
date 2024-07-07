export type PaymentMethodTypes = 'cash' | 'gcash' | 'maya' | 'credit' | 'debit' | 'check'
export const PaymentMethodEnumValues: [PaymentMethodTypes, ...PaymentMethodTypes[]] = ["cash", "credit", "debit", "check", "gcash", "maya"]


export function useToday(format: string = "YYYY-MM-DD") {
    const dayjs = useDayjs()
    // // yyyy-mm-dd
    const today = computed(() => dayjs().format(format))
    return {
        today,
        dayjs,
    }
}
