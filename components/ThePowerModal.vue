<template>
<div
    class="
    fixed inset-0
    w-screen h-screen
    pt-[20%]
    px-4
    bg-black/70
    z-[2000]
    backdrop-blur-sm
    flex justify-center"
>
    <div class="relative w-full max-w-2xl">
        <div
            ref="modal"
            class="
            relative
            flex flex-col
            rounded-lg shadow-lg
            backdrop-blur-sm bg-transparent
            border-[0.5px] border-white/20"
        >
            <div class="flex items-center rounded-t py-4 px-6 border-b-[0.5px] border-white/20">
                <Icon name="line-md:search" class="text-white -scale-x-100 mr-2"/>
                <input
                    ref="input"
                    class="w-full bg-transparent focus:outline-0 placeholder:text-zinc-400/90"
                    type="text"
                    v-model="search"
                    list="autocompleteOff"
                    aria-autocomplete="none"
                    autocomplete="off"
                    placeholder="Type a command or search..."
                />
            </div>
            <div class="py-1">
                <div class="results flex flex-col items-center pt-0 max-h-96 overflow-y-auto">
                    <SearchSection
                        v-if="Object.values(searchResults).some(dataHit => dataHit.length > 0)"
                        v-for="[key, value] in Object.entries(searchResults)"
                        :title="key"
                    >
                        <SearchItem
                            v-if="key.length > 0"
                            v-for="data in value"
                            :data="data"
                            :data-icon="icons[`${key}_icon`]"
                            :data-key="key.slice(0, key.length - 1)"
                            @click="handleClick(key, data)"
                        />
                    </SearchSection>
                    <div v-else class="py-10 text-gray-400">
                        No Results
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { search as lyraSearch } from "@lyrasearch/lyra"
import { Lyra } from '@lyrasearch/lyra/dist/types';

const props = defineProps<{
    dbs: Record<string, Lyra<Schema>>
    data: Record<string, any[]>
    icons: Record<string, string>
    handlers: Record<string, (...args: any[]) => any>
}>()

const {
    dbs,
    data,
    handlers
} = toRefs(props)

// #region Search
const search = ref('')
const searchResults = ref<Record<string, any[]>>(
    Object.fromEntries(
        Object.keys(dbs.value)
            .map(key => key.split('_')[0])
            .map(key => [key, []])
    )
)

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

        searchResults.value[key] = dataHits.length && !dataHits.some(data => !data) ? [...dataHits] : []
    })
})
// #endregion    

// #region Selection 
const handleClick = (dataKey: string, data: any) => {
    handlers.value[`${dataKey}_handler`](data)
}
// #endregion

const emits = defineEmits(['close'])
const modal = ref<Nullable<HTMLElement>>(null)
const input = ref<Nullable<HTMLInputElement>>(null)

const { enter } = useMagicKeys()

useFocus(input, { initialValue: true })
onClickOutside(modal, () => emits('close'))

whenever(enter, () => {
    const [[key], [[value]]] = [Object.keys(searchResults.value), Object.values(searchResults.value)]
    if (value) handleClick(key, value)
})
</script>

<style scoped>
::-webkit-scrollbar {
    @apply w-2 h-2 bg-transparent
}

::-webkit-scrollbar-track {
    background: rgb(39 39 42);
}
::-webkit-scrollbar-thumb {
    @apply rounded-full;
    background: rgb(63 63 70);
}
</style>