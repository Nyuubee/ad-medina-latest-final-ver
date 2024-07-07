<template>
    <div class="p-4">

        <Head>
            <Title>Help</Title>
        </Head>
        <!-- TOC -->
        <div class="top-0 bg-base-100 p-4 rounded-lg shadow-md">
            <h1 class="text-3xl font-bold mb-4">Table of Contents</h1>
            <ul class="list-inside list-decimal">
                <li>
                    <NuxtLink :to="{ hash: '#dental-records' }">Creating a dental record</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#edit-dental-record' }">Editing a dental record</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#payment' }">Payment</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#payment-void' }">Voiding a payment</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#adding-supply' }">Adding a Supply</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#using-supply' }">Using a Supply</NuxtLink>
                </li>
                <li>
                    <NuxtLink :to="{ hash: '#printing' }">Generating Reports</NuxtLink>
                </li>
            </ul>
        </div>
        <!-- if there's no print button in the page do: -->
        <div id="dental-records" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <!--Create a new dental record  -->
                <NuxtLink :to="{ hash: '#dental-records' }">
                    Creating a dental record
                </NuxtLink>
            </h1>
            <!-- goto overview -->
            <h2 class="guide-step">Step 1: Click <button class="btn btn-sm">
                    <Icon name="material-symbols:add" class="w-5 h-5" />
                    New Patient
                </button> in the sidebar</h2>
            <!-- complete the form -->
            <h2 class="guide-step">Step 2: Fill in the form</h2>
            <p>Fill in the necessary details about the patient's dental history, medical history, and other relevant
                information.</p>
            <!-- press save -->
            <h2 class="guide-step">Step 3: Save the record by clicking <button v-if="!$route.query.registered"
                    class="btn btn-sm btn-primary">
                    <Icon name="mdi:account-plus" class="text text-lg" />
                    Register Patient
                </button></h2>
            <!-- Change tooth visibility if you wish -->
            <h2 class="guide-step">Step 4: Click <button class="btn btn-primary">Start Intraoral Exam</button> at the
                bottom middle of the screen</h2>
            <p>Alternatively, navigate back to overview</p>
            <!-- New options should appear in the sidebar -->
            <h2 class="guide-step">Step 5: Change tooth visibility</h2>
            <p>The visibility of different parts of the teeth can be adjusted using the button in the topbar </p>
            <p class="pb-48">
                <PeriTeethVisibilityDropdown class="dropdown-open" />
            </p>
            <h2 class="guide-step">Step 6: Use the Tooth Editor</h2>
            <p>Click on a tooth to bring up the Tooth Editor dialog.</p>
            <h2 class="guide-step">Step 7: Fill in the Details</h2>
            <p>Fill in the necessary details about the tooth's condition, treatments, notes, or any other relevant
                information.</p>
            <h2 class="guide-step">Step 8: Review</h2>
            <p>Review the updated information on the patient's dental chart.</p>
            <h2 class="guide-step">Step 9: Save the Record</h2>
            <p>Make sure to save the record by clicking <button class="join-item btn btn-sm
       btn-primary">
                    <icon name="material-symbols:save" class="text text-lg"></icon>
                    Save Changes
                </button> near the upper right corner</p>
            <!-- Proceed to treatment record -->
            <h2 class="guide-step">Step 10: Click
                <RecordsTreatmentLink class="btn" /> in the sidebar
            </h2>
            <h2 class="guide-step">Step 11: Click add from the topbar</h2>
            <p>
            <div class="join">
                <button class="join-item btn btn-sm btn-primary">
                    <Icon name="material-symbols:add" class="h-6 w-6" />
                    Add
                </button>
                <!-- Edit -->
                <!-- TODO -->
                <button class="join-item btn btn-sm btn-primary btn-disabled">
                    <Icon name="material-symbols:edit" class="h-6 w-6" />
                    Edit
                </button>
                <!-- view payments -->
                <button class="join-item btn btn-sm btn-disabled">
                    <Icon name="material-symbols:payments" class="h-6 w-6"></Icon>
                    Pay
                </button>
                <!-- Save -->
                <!-- Deselect -->
                <button class="join-item btn btn-sm btn-error btn-disabled">
                    <Icon name="material-symbols:cancel" class="h-6 w-6" />
                    Deselect
                </button>
            </div>
            </p>
            <h2 class="guide-step">Step 12: Complete the form then submit</h2>
            <h2 class="guide-step">Step 13: You can now view the patient in the <NuxtLink class="btn btn-sm" to="/dental-chart/overview"
                    active-class="active">
                    <Icon name="material-symbols:table" class="w-5 h-5" />
                    Overview
                </NuxtLink> page</h2>

            <!-- procedd to #payment -->

            <!-- <h2 class="guide-step">Note:</h2> -->
        </div>
        <!-- Editing Dental record -->
        <!-- goto overview -->
        <!-- select the patient -->
        <!-- say that same process like creating -->
        <!-- click save changes -->
        <div id="edit-dental-record" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <NuxtLink :to="{ hash: '#edit-dental-record' }">
                    Editing a dental record
                </NuxtLink>
            </h1>
            <h2 class="guide-step">Step 1: Go to <NuxtLink class="btn btn-sm" to="/dental-chart/overview"
                    active-class="active">
                    <Icon name="material-symbols:table" class="w-5 h-5" />
                    Overview
                </NuxtLink> page in the sidebar</h2>
            <h2 class="guide-step">Step 2: Select a patient</h2>
            <h2 class="guide-step">Step 3: In the topbar, click the specific form you want to edit.</h2>
            <h2 class="guide-step">Step 4: Make the necessary changes</h2>
        </div>
        <!-- payment of specific patient -->
        <div id="payment" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <NuxtLink :to="{ hash: '#payment' }">
                    Payment
                </NuxtLink>
            </h1>
            <h2 class="guide-step">Step 1: Go to the patient's treatment record </h2>
            <h2 class="guide-step">Step 2: In the table, click the treatment record</h2>
            <h2 class="guide-step">Step 3: Then, in the navbar, click pay</h2>
            <h2 class="guide-step">Step 4: It will navigate you to the payment page</h2>
            <h2 class="guide-step">Step 5: Complete the payment form</h2>
        </div>
        <div id="payment-void" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <NuxtLink :to="{ hash: '#payment-void' }">
                    Voiding a payment
                </NuxtLink>
            </h1>
            <h2 class="guide-step">Step 1: Go to the patient's treatment record </h2>
            <h2 class="guide-step">Step 2: In the table, click the balance of the treatment record</h2>
            <h2 class="guide-step">Step 3: It will navigate you to the payment page</h2>
            <h2 class="guide-step">Step 4: From the payment history table</h2>
            <h2 class="guide-step">Step 5: Click the reference number of the payment</h2>
            <h2 class="guide-step">Step 6: Click void</h2>
        </div>
        <!-- Adding a Supply -->
        <div id="adding-supply" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <NuxtLink :to="{ hash: '#adding-supply' }">
                    Adding a Supply
                </NuxtLink>
            </h1>
            <h2 class="guide-step">Step 1: Open the New Supply Dialog</h2>
            <p>Navigate to the supplies list page and click the "New Supply" button.</p>
            <h2 class="guide-step">Step 2: Fill Out the Supply Form</h2>
            <p>Enter the item name, category, quantity, supplier, and any other relevant details.</p>
            <h2 class="guide-step">Step 3: Submit the Form</h2>
            <p>Click the "Save" button to add the new supply.</p>
            <h2 class="guide-step">Step 4: Close the Dialog</h2>
            <p>Ensure the dialog closes and verify the addition in the supplies list.</p>
        </div>

        <!-- Using a Supply -->
        <div id="using-supply" class="guide-section">
            <h1 class="text-3xl font-bold mb-4">
                <NuxtLink :to="{ hash: '#using-supply' }">
                    Using a Supply
                </NuxtLink>
            </h1>
            <h2 class="guide-step">Step 1: Select a Supply</h2>
            <p>Find and select the supply you wish to use from the list.</p>
            <h2 class="guide-step">Step 2: Open the Use Supply Dialog</h2>
            <p>Click the "Use Supply" button to open the dialog.</p>
            <h2 class="guide-step">Step 3: Specify Usage Details</h2>
            <p>Enter the quantity being used and any notes regarding the usage.</p>
            <h2 class="guide-step">Step 4: Submit the Usage Form</h2>
            <p>Click "Submit" to record the usage of the supply.</p>
            <h2 class="guide-step">Step 5: Close the Dialog</h2>
            <p>Close the dialog and verify the usage in the supplies list.</p>
        </div>
        <div id="printing" class="guide-section">
            <h1 class="text-3xl font-bold mb-4" id="printing">
                <NuxtLink :to="{ hash: '#printing' }">
                    Generating Reports
                </NuxtLink>
            </h1>
            <ol class="list-disc list-inside">
                <li>
                    Use the <PrintButton /> button, usually located at the upper right corner of the page.
                </li>
                <li>
                    Alternatively, press the following keyboard shortcuts:
                    <ul class="ml-6 list-disc list-inside">
                        <li>
                            <kbd>Ctrl</kbd> + <kbd>p</kbd> on Windows and Linux
                        </li>
                        <li>
                            <kbd>⌘</kbd> + <kbd>p</kbd> on Mac.
                        </li>
                    </ul>
                </li>
                <li>Note: when there's no print button this means that the page is not supposed to be printed
                </li>
            </ol>
            <!-- for saving to pdf -->
            <!-- change the destination to pdf -->
            <h3>Saving as PDF</h3>
            <ol class="list-inside list-decimal">
                <li>Click the <PrintButton /> button</li>
                <li>Change the <strong>destination</strong>
                    to "Save as PDF"</li>
                <li>Click "Save"</li>
            </ol>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
kbd {
    @apply kbd;
}

.guide-section {
    @apply bg-base-100 shadow-md rounded-lg p-4
}

.guide-step {
    @apply text-xl font-semibold mb-2
}
</style>
