<template>
    <div class="py-2">
        <TableCell v-for="cellData in columnData" :cell-data="cellData" class="cell"/>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    columnData: ColumnData
}>()
</script>

<style scoped>
.cell {
    @apply even:bg-gray-200;
}
</style>