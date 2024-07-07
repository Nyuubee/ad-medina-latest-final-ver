<template>
    <div class="flex flex-col items-center gap-y-4">

        <Head>
            <Title>
                Pay
            </Title>
        </Head>
        <template v-if="treatment">
            <div class="stats stats-vertical shadow">
                <div class="stat">
                    <div class="stat-title">Amount Charged:</div>
                    <div class="stat-value">₱ {{ treatment.amountChargedPesos.toFixed(2) }}</div>
                    <div class="stat-desc">on {{ treatment.createdAt }}</div>
                </div>
                <div class="stat" v-if="fullyPaid">
                    <div class="stat-title">Status</div>
                    <div class="stat-value text-success">Paid</div>
                </div>
                <!-- Balance -->
                <div class="stat" v-if="!fullyPaid">
                    <div class="stat-title">Balance</div>
                    <div class="stat-value text-error">₱ {{ treatment.balancePesos.toFixed(2) }}</div>
                </div>
            </div>
            <template v-if="!fullyPaid">
                <FormKit type="form"  @submit="onSubmit"  :value="treatment" :actions=false>
                    <FormKit type="hidden" name="id" id="id" />
                    <!-- select: payment methods -->
                     <FormKit type="select" name="method" id="method" inputClass="select select-bordered" :options="PaymentMethodEnumValues" validation="required" validation-visibility="dirty" label="Payment method:" />
                    <div class="flex flex-col items-center">
                        <FormKit id="amountPaidPesos" name="amountPaidPesos" inputClass="!input-md" label="Pay amount:"
                            type="number" outerClass="w-full" v-model="amountPaid"
                            :validation-rules="{ maxBalancePesos }"
                            :validation="`required|min:1|max:${treatment.balancePesos}`" validation-visibility="dirty"
                            :validationMesages="{ maxBalancePesos: 'Amount paid must not exceed the balance' }"
                            :max=treatment.balancePesos>
                        </FormKit>
                        <!-- New balance -->
                        <div class="stats stats-vertical shadow my-4">
                            <div class="stat">
                                <div class="stat-title">New balance:</div>
                                <div class="stat-value">
                                    {{ newBalancePreview }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="formkit-actions join">
                        <div class="join-item tooltip tooltip-bottom"
                            data-tip="Set's the amount to be paid to the remaining balance">
                            <FormKit id="setfullAmount" type="button" inputClass="join-item btn" @click="amountPaid = treatment.balancePesos">
                                Set to Full Amount
                            </FormKit>
                        </div>
                        <FormKit type='submit' id="payButton" inputClass="join-item btn btn-primary">
                            <Icon name="material-symbols:payments" class="h-6 w-6"></Icon>
                            pay
                        </FormKit>
                    </div>
                </FormKit>
            </template>
        </template>
        <div>
            <h2 class="text-xl">Payment History</h2>
            <RecordTable :columns :records="treatment?.payments" identifier="id" v-model:active="selectedPayment">
                <template #voidedAt="{ value }">
                    <span v-if="value">Yes</span>
                    <span v-else>No</span>
                </template>
                <template #amountPaidCentavos="{ value }">
                    ₱ {{ value / 100 }}
                </template>
            </RecordTable>
            <div class="join" v-if="selectedPayment && selectedPayment?.voidedAt == null ">
                <button id="voidBtn"  @click="onVoid(selectedPayment)" class="join-item btn btn-sm btn-error">
                    <Icon name="material-symbols:payments" class="h-6 w-6"></Icon>
                    Void Payment
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { PaymentMethodEnumValues } from '~/utils/payment';

import { useFormKitNodeById, type FormKitNode, type SubmitHandler } from "~/utils/formkit";
const route = useRoute("payments-id")
const columns = {
    'id': 'Reference #',
    'amountPaidCentavos': 'Amount Paid',
    'method': 'Method',
    'createdAt': 'Date',
    "voidedAt": "Voided",
}
const FORM_ID = "payment-form"
const formNode = useFormKitNodeById(FORM_ID)
const { data: treatment, refresh } = useFetch(`/api/treatments/${route.params.id as unknown as number}/payments`, {

})
const selectedPayment = ref<any>()
const amountPaid = ref(0)
const fullyPaid = computed(() => {
    if (treatment.value == undefined) {
        return false
    }
    return treatment.value.balanceCentavos == 0
})
const maxBalancePesos = function (node:FormKitNode) {
  return (node.value as number) <= (treatment.value?.balancePesos ?? 0)
}
watch(amountPaid, (value) => {
    if (treatment.value == undefined) {
        return
    }
    if (value > treatment.value.balancePesos) {
        amountPaid.value = treatment.value.balancePesos
    }
})

const newBalancePreview = computed(() => {
    if (treatment.value == undefined || fullyPaid.value) {
        return 0
    }
    // return balance if amountPaid is negative
    if (amountPaid.value < 0) {
        return treatment.value.balancePesos
    }
    return (treatment.value.balancePesos - amountPaid.value).toFixed(2)
})

const disablePayment = computed(() => {
    return amountPaid.value <= 0
})
const headers = useRequestHeaders(['cookie']) as HeadersInit
const onSubmit: SubmitHandler<{
    amountPaidPesos: number,
    id: number,
    method: 'cash',
}> = async (value, node) => {
    console.log(value)
    const response = await $fetch(`/api/payments`, {
        method: "POST",
        headers,
        body: {
            amountPaidCentavos: value.amountPaidPesos * 100,
            treatmentId: value.id,
            method: value.method,
        },
    })
    await refresh()
    const id = response[0].id
    addNotif({
        id: `payment-${id}`,
        message: `Payment ID:${id} recorded`,
        type: "success",
        icon: "material-symbols:check-circle",
        timeoutMS: 5000,
    })
}

const onVoid = async (value:{id:number}) => {
    console.log(value)
    const response = await $fetch(`/api/payments/${value.id}`, {
        method: "PATCH",
        body: {
            voided: true
        },
    })
    // refresh the treatment
    await refresh()
    formNode.value?.reset(treatment.value)
    selectedPayment.value = undefined
    amountPaid.value = 0
    addNotif({
        id: `payment-voided-${value.id}`,
        message: `Payment (${value.id}) voided`,
        type: "warning",
        icon: "material-symbols:check-circle",
        timeoutMS: 5000,
    })
}
</script>
