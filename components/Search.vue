<script setup lang="ts">
import { search as lyraSearch } from "@lyrasearch/lyra"
import { Lyra } from '@lyrasearch/lyra/dist/types';

const props = defineProps<{
    dbs: Record<string, Lyra<Schema>>
    data: Record<string, any[]>
}>()

const emits = defineEmits(['repopulate'])

const {
    dbs,
    data,
} = toRefs(props)

const input = ref<Nullable<HTMLInputElement>>(null)

const search = ref('')
const searchResults = ref<Record<string, any[]>>(
    Object.fromEntries(
        Object.keys(dbs.value)
            .map(key => key.split('_')[0])
            .map(key => [key, []])
    )
)

const handleInput = (e: KeyboardEvent) => {
    const { target } = e
    if (!(target instanceof HTMLDivElement)) return 
    search.value = target.innerText
}

watch(search, (searchTerm) => {
    Object.entries(dbs.value).forEach(async ([dirtyKey, db]) => {

        const [key] = dirtyKey.split('_')

        const res = await lyraSearch(db, {
            term: searchTerm,
            properties: '*',
        })
        
        const dataHits = res.hits.map(({document}) => {
            const { _id } = document
            return data.value[key][_id]
        })

        searchResults.value[key] = (dataHits.length && !dataHits.some(data => !data)) ? [...dataHits] : []
    })

    emits('repopulate', searchResults.value)
})

useFocus(input, { initialValue: true })
</script>

<template>
    <div class="flex items-center rounded-t py-4 px-6 border-b-[0.5px] border-white/20 text-white ">
        <Icon name="line-md:search" class="-scale-x-100 mr-2"/>
        <div
            ref="input"
            class="relative w-[calc(100%-24px)] bg-transparent focus:outline-0 flex flex-wrap gap-2"
            contenteditable="true"
            placeholder="Type a command or search..."
            @keydown="handleInput"
        >
            <slot name="input"/>
        </div>
    </div>
</template>

<style scoped>
[contenteditable][placeholder]:empty::before{
    @apply text-zinc-400/90 content-[attr(placeholder)];
}
</style>