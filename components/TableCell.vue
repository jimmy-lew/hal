<template>
    <th v-if="type === 'header'" ref="cell" class="relative py-3 px-6 font-semibold group first:rounded-l-md last:rounded-r-md">
        <Icon v-if="icon" size="16" :name="icon" class="mr-2"/>
        {{ formattedData }}
        <Tooltip v-if="hint" class="opacity-0 transition-opacity duration-[1200ms] ease-out group-hover:opacity-100">{{ hint }}</Tooltip>
    </th>
    <td v-else class="py-3 px-6 last:rounded-r-md">
        <Icon v-if="icon" size="16" :name="icon" class="mr-2"/>
        {{ formattedData }}
    </td>
</template>

<script setup lang="ts">
const props = defineProps<{
    cellData: CellData
}>()

const { cellData } = toRefs(props)

const {
    data,
    type,
    hint,
    icon
} = toRefs(cellData.value)

const isTooltipActive = ref(false)
const cell = ref<Nullable<HTMLElement>>(null)

const formattedData = computed(() => {
    if (typeof data.value === 'number') {
        return data.value.toLocaleString()
    }
    return data.value
})

const isHovered = useElementHover(cell)

watch(isHovered, (isHovered) => {
    isTooltipActive.value = isHovered
})
</script>

<style scoped>

</style>