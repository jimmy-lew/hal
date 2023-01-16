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
                <div
                    ref="input"
                    class="relative w-[calc(100%-24px)] bg-transparent focus:outline-0 flex flex-wrap gap-2"
                    contenteditable="true"
                    placeholder="Type a command or search..."
                    @keydown="handleInput"
                >
                    <CommandInput v-if="commandInputs.length > 0" v-for="{ key, value: { focus } } in commandInputs" :label="key" :has-focus="focus" @change="(change) => handleInputChange(key, change)"/>
                </div>
            </div>
            <div class="pt-2">
                <div class="results flex flex-col items-center pt-0 max-h-96 overflow-y-auto border-b-[0.5px] border-white/20">
                    <SearchSection
                        v-if="Object.values(searchResults).some(dataHit => dataHit.length > 0)"
                        v-for="[key, value] in Object.entries(searchResults)"
                        :title="key"
                    >
                        <SearchItem
                            v-if="key.length > 0"
                            v-for="(data, index) in value"
                            :id="`si-${index}`"
                            :data="data"
                            :data-icon="icons[`${key}_icon`]"
                            :data-key="key.slice(0, key.length - 1)"
                            @click="handleClick(key, data)"
                        />
                    </SearchSection>
                    <div v-else class="py-10 text-gray-400">
                        No Results...
                    </div>
                </div>
                <div class="flex items-center gap-1 p-2 text-xs">
                    <Card class="transition-all duration-500 ease-in scale-75">
                        <div class="flex items-center justify-center px-1 text-sm">
                            Tab
                        </div>
                    </Card>
                    &
                    <div class="flex items-center">
                        <Card class="transition-all duration-500 ease-in scale-75">
                            <div class="flex items-center justify-center px-1 text-sm">
                                Shift
                            </div>
                        </Card>
                        +
                        <Card class="transition-all duration-500 ease-in scale-75">
                            <div class="flex items-center justify-center px-1 text-sm">
                                Tab
                            </div>
                        </Card>
                    </div>
                    for navigation
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

// #region Handlers
const handleInput = (e: KeyboardEvent) => {
    const { target, key } = e
    if (!(target instanceof HTMLDivElement)) return 
    search.value = target.innerText
    if (target.innerText[0] !== '/' && key !== ' ') return
    e.preventDefault()
    selectNearest()
}

const handleClick = async (dataKey: string, data: any) => {
    const { searchOptions: { type } } = data
    const isCommand = type === 'command'
    const requiresInput = !!data.inputOptions
    if (isCommand) currentCommand.value = data
    if (!requiresInput || input.value == null) {
        await handlers.value[`${dataKey}_handler`](data)
        return emits('close')
    }

    Object.entries(data.inputOptions).forEach(([key, value]) => {
        commandInputs.value.push({ key, value })
    })
}

const handleInputChange = (key: string, value: string) => {
    const index = commandInputs.value.findIndex(({ key: _key }) => _key === key)
    commandInputs.value[index].value.data = value
}
// #endregion

// TODO: Decouple to independant component
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

        searchResults.value[key] = (dataHits.length && !dataHits.some(data => !data)) ? [...dataHits] : []
    })
})
// #endregion    

// #region Selection & Commands
const commandInputs = ref<any[]>([])
const currentCommand = ref<Nullable<InstanceType<typeof Command>>>(null)

const selectNearest = () => {
    const [[key], [[value]]] = [Object.keys(searchResults.value), Object.values(searchResults.value)]
    if (value) handleClick(key, value)
}

const selectByIndex = (index: number) => {
    const [[key], [value]] = [Object.keys(searchResults.value), Object.values(searchResults.value)]
    if (value) handleClick(key, value[index])
}
// #endregion

// #region Interactions
const emits = defineEmits(['close'])
const modal = ref<Nullable<HTMLElement>>(null)
const input = ref<Nullable<HTMLInputElement>>(null)

useFocus(input, { initialValue: true })
onClickOutside(modal, () => emits('close'))

const { enter } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        const { type } = e
        const [ isEnter ] = [ 'Enter' ].map(key => key === e.key)
        if ((isEnter) && type === 'keydown') e.preventDefault()
    }
})

whenever(enter, async () => {
    if (useActiveElement().value && currentCommand.value == null) return selectByIndex(Number(useActiveElement().value?.id.split('-')[1]))
    if (commandInputs.value.length == 0) return selectNearest()
    await handlers.value.commands_handler(currentCommand.value)
    currentCommand.value = null
    emits('close')
})
// #endregion
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

[contenteditable][placeholder]:empty::before{
    @apply text-zinc-400/90 content-[attr(placeholder)];
}
</style>