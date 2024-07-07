<template>
    <div>
        <h2>Legend</h2>
        <div class="grid md:grid-cols-3 print:grid-cols-3 gap-8">
            <div>
                <h3>Condition</h3>
                <ChartLegendItem legend-id="✓">Present Teeth</ChartLegendItem>
                <ChartLegendItem legend-id="D">Decayed Teeth</ChartLegendItem>
                <ChartLegendItem legend-id="M">Missing due to caries</ChartLegendItem>
                <ChartLegendItem legend-id="MO">Missing due to other reasons</ChartLegendItem>
                <ChartLegendItem legend-id="Im">Impacted Tooth</ChartLegendItem>
                <ChartLegendItem legend-id="Sp">Supernumerary Tooth</ChartLegendItem>
                <ChartLegendItem legend-id="Rf">Root Fragment</ChartLegendItem>
                <ChartLegendItem legend-id="Un">Unerupted Tooth</ChartLegendItem>
            </div>
            <div>
                <h3>Restoration and Prosthetics</h3>
                <ChartLegendItem legend-id="Am">Amaigam Filling</ChartLegendItem>
                <ChartLegendItem legend-id="Co">Composite Filling</ChartLegendItem>
                <ChartLegendItem legend-id="Jc">Jacket Crown</ChartLegendItem>
                <ChartLegendItem legend-id="Ab">Abutment</ChartLegendItem>
                <!-- Att - attachment -->
                <ChartLegendItem legend-id="Att">Attachment</ChartLegendItem>
                <!-- P - Pontic -->
                <ChartLegendItem legend-id="P">Pontic</ChartLegendItem>
                <!-- In - inlay -->
                <ChartLegendItem legend-id="In">Inlay</ChartLegendItem>
                <!-- Imp - Implant -->
                <ChartLegendItem legend-id="Imp">Implant</ChartLegendItem>
                <!-- S - Sealants -->
                <ChartLegendItem legend-id="S">Sealants</ChartLegendItem>
                <!-- Rm - Removable Denture -->
                <ChartLegendItem legend-id="Rm">Removable Denture</ChartLegendItem>
            </div>
            <div>
                <h3>Surgery</h3>
                <!-- X - Extraction due to Caries -->
                <ChartLegendItem legend-id="X">Extraction due to caries</ChartLegendItem>
                <!-- XO - Extration due to other causes -->
                <ChartLegendItem legend-id="XO">Extraction due to other causes</ChartLegendItem>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
// Convert legend-id and the text inside as an enum
import ChartLegendItem from './ChartLegendItem.vue';
</script>
