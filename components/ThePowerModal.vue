<template>
<Modal @close="() => emits('close')">
    <Search :dbs="dbs" :data="data" @repopulate="handleRepopulate">
        <template #input>
            <CommandInput v-if="commandInputs.length > 0" v-for="{ key, value: { focus } } in commandInputs" :label="key" :has-focus="focus" @change="(change) => handleInputChange(key, change)"/>
        </template>
    </Search>
    <div class="pt-2">
        <div class="flex flex-col items-center pt-0 max-h-96 overflow-y-auto border-b-[0.5px] border-white/20">
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
</Modal>
</template>

<script setup lang="ts">
import { Lyra } from '@lyrasearch/lyra/dist/types';

const {
    handlers
} = defineProps<{
    dbs: Record<string, Lyra<Schema>>
    data: Record<string, any[]>
    icons: Record<string, string>
    handlers: Record<string, (...args: any[]) => any>
}>()

// #region Handlers
const handleClick = async (dataKey: string, data: any) => {
    const { searchOptions: { type }, inputOptions } = data
    const isCommand = type === 'command'
    const requiresInput = !!inputOptions
    if (isCommand) currentCommand.value = data
    if (!requiresInput) {
        await handlers[`${dataKey}_handler`](data)
        return emits('close')
    }

    Object.entries(inputOptions).forEach(([key, value]) => {
        commandInputs.value.push({ key, value })
    })
}

const handleInputChange = (key: string, value: string) => {
    const index = commandInputs.value.findIndex(({ key: _key }) => _key === key)
    commandInputs.value[index].value.data = value
}
// #endregion

// #region Search
const searchResults = ref<Record<string, any[]>>({})

const handleRepopulate = (newResults: Record<string, any[]>) => searchResults.value = newResults
// #endregion

// #region Selection & Commands
const commandInputs = ref<any[]>([])
const currentCommand = ref<Nullable<InstanceType<typeof Command>>>(null)

const selectByIndex = (index: number) => {
    const [[key], [value]] = [Object.keys(searchResults.value), Object.values(searchResults.value)]
    if (value) handleClick(key, value[index])
}

const selectNearest = () => selectByIndex(0)
// #endregion

// #region Interactions
const emits = defineEmits(['close'])

const { enter } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        const { type, key } = e
        const isWatchedKey = [ 'Enter' ].map(_key => _key === key).some(_key => Boolean(_key))
        if (isWatchedKey && type === 'keydown') e.preventDefault()
    }
})

whenever(enter, async () => {
    const { id } = useActiveElement().value || { id: '' }
    if (id && currentCommand.value == null) return selectByIndex(Number(id.split('-')[1]))
    if (commandInputs.value.length == 0) return selectNearest()
    await handlers.commands_handler(currentCommand.value)
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
</style>