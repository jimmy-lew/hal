<template>
<div class="table glow">
    <div>
        <table>
            <thead class="text-xs text-left uppercase font-normal">
                <TableRow :data="headerData"/>
            </thead>
            <tbody>
                <TableRow v-for="rowData in tableData" :data="rowData"/>
            </tbody>
        </table>
    </div>
</div>
</template> 

<script setup lang="ts">
defineProps<{
    tableData: CellData[][]
    headerData: CellData[]
}>()
</script>

<style scoped>
.table {
    @apply
    relative
    flex flex-col justify-center items-center
    rounded-md
    bg-[#18181b];
    --radius: 18rem;    
}

.table > div {
    @apply
    flex flex-col justify-center items-center
    m-px
    py-2 px-2
    text-xs
    bg-[#0c0c0c];
    border-radius: inherit;
    z-index: 1000;
}
</style>


