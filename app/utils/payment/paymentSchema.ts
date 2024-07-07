import {type FormKitSchemaNode} from "@formkit/core"

export function usePaymentSchema() {
    const schema = ref<FormKitSchemaNode>({
        $formkit: 'group',
        id: 'payment',
        name:'payment',
        $el: 'div',
        children: [
            {
                $formkit: 'number',
                label: 'Amount Charged',
                id: 'amountChargedCentavos',
                name: 'amountChargedCentavos'
            },
            {
                $formkit: 'number',
                id: 'amountPaidCentavos',
                name: 'amountPaidCentavos',
                label: 'Amount Paid'
            },
            {
                $formkit: 'number',
                id: 'changeCentavos',
                name: 'changeCentavos',
                label: 'Change',
            },
            {
                $formkit: 'number',
                id: 'balance',
                label: 'Balance',
                name: 'balance',
            }
        ]
    })

    return {
        schema
    }
}
