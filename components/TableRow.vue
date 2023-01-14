<template>
    <tr class="relative border-b border-[#18181b] first:!border-b last:border-0 rounded transition-all duration-300 ease-in hover:bg-[#18181b] hover:scale-[108%]">
        <TableCell v-for="cellData in data" :cell-data="cellData" />
    </tr>
</template>

<script setup lang="ts">
defineProps<{
    data: CellData[],
}>()
</script>

<style scoped>

</style>