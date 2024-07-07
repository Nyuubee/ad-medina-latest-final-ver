<template>
    <main class="gap-2">
        <form action="./chart" class="flex flex-col justify-center items-center gap-4">
            <ul class="steps steps-vertical lg:steps-horizontal">
                <li class="step step-primary">Basic Patient Information</li>
                <li class="step step-primary">Dental History</li>
                <li class="step step-primary">Medical History</li>
                <li class="step step-primary">Informed Consent</li>
                <li class="step">Dental Record Chart</li>
                <li class="step">Treatment Record</li>
            </ul>
        <ConsentClause>
            <template v-slot:title>
                Treatment To Be Done:
            </template>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus eligendi est maiores, iure esse omnis, exercitationem a doloribus nobis totam fuga expedita ducimus!
            <ConsentInput v-slot="input" />
        </ConsentClause>
        <ConsentClause>
            <template v-slot:title>
                Drugs & Medications:
            </template>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus eligendi est maiores, iure esse omnis, exercitationem a doloribus nobis totam fuga expedita ducimus! Blanditiis non quisquam consequuntur recusandae sunt quibusdam molestias hic, cum nulla cumque ducimus officia ipsa rerum expedita delectus, tenetur doloremque tempore veritatis dolorem, eveniet magni. Nam iure corporis explicabo sit
            <ConsentInput v-slot="input" />
        </ConsentClause>
        
        <u class="text-lg">I understand that dentistry is not an exact science and that no dentist can properly guarantee accurate results all the time</u>
        <ConsentClause>
            I hereby authorize any of the doctors/dental auxiliaries to proceed with and perform the dental restorations & treatments as explained to me. I understand that these are subject to modification depending on undiagnosable circumstances that may arise during the course of treatment. I understand that regardless Of any dental insurance coverage I may have, I am responsible for payment of dental fees, I agree to pay any attorney's fees, collection fee, or court costs thut may be incurrod to satisfy any obligation to this office. All treatment were properly explained to me & any untoward circumstances that may arise during the procedure, the dentist not be held liable since it is my free will, with full trust & confidence in him/her, to undergo Treatment undec his/her care.
        </ConsentClause>
        <!-- Patient signature -->
        <label class="form-control w-full max-w-xs">
        <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        <div class="label">
            <span class="label-text-alt">Patient/Parent/Guardian Signature</span>
        </div>
        </label>
        <!-- Doctor signature -->
        <label class="form-control w-full max-w-xs">
        <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
        <div class="label">
            <span class="label-text-alt">Doctor Signature</span>
        </div>
        </label>
        <input type="date" :value="consentDate">
        <!-- Form buttons -->
        <div class="join col-span-full row-start-last justify-center">
            <button type="reset" class="btn btn-error join-item">
                <Icon name="material-symbols:delete" class="text text-lg" />
                Clear</button>
            <button type="submit" class="join-item btn btn-primary">
                <Icon name="material-symbols:arrow-circle-right" class="text text-lg" />
                Next
            </button>
        </div>
    </form>
        </main>
</template>
<script setup lang="ts">
const consentDate = ref(new Date())
</script>
