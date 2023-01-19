<template>
    <GlowWrapper class="h-screen w-screen flex items-center justify-center bg-[#0c0c0c] text-white">
        <Table :table-data="tableData" :header-data="headerData"/>
        <ThePowerModal
            v-if="isModalActive"
            :dbs="{commands_db}"
            :data="{commands}"
            :icons="{commands_icon}"
            :handlers="{commands_handler}"
            @close="toggleModal"
        />
        <div class="fixed top-0 right-0 flex flex-col gap-4 p-4">
            <Card class="transition-all duration-500 ease-in hover:scale-125">
                <div class="flex items-center justify-center w-4 h-4">
                    ?
                </div>
            </Card>
            <Card class="transition-all duration-500 ease-in hover:scale-125" @click="toggleModal">
                <div class="flex items-center justify-center w-4 h-4">
                    /
                </div>
            </Card>
        </div>
    </GlowWrapper>
</template>

<script setup lang="ts">
// #region Table Data
const knight = Knight.getInstance()
const archer = Archer.getInstance()
const wizard = Wizard.getInstance()

const headerData: CellData[] = [
    { data: 'Unit Type', type: 'header' },
    { data: 'Level', type: 'header' },
    { data: 'Health', type: 'header' },
    { data: 'DPS', type: 'header' },
    { data: 'Regen', type: 'header', hint: 'hp/s' },
    { data: 'Movement', type: 'header', hint: 'px/s' },
]

const tableData: CellData[][] = [
    [{ data: 'Knight', type: 'header', icon: 'akar-icons:double-sword' }, ...objectToCellData(knight, filterKeyData)],
    [{ data: 'Archer', type: 'header', icon: 'icon-park-outline:archers-bow' }, ...objectToCellData(archer, filterKeyData)],
    [{ data: 'Wizard', type: 'header', icon: 'mdi:magic-staff' }, ...objectToCellData(wizard, filterKeyData)],
]
// #endregion

// #region Modal Stuff

// #region Command Data
const commands = ref<InstanceType<typeof Command>[]>([
    LevelUpCommand.getInstance(),
    LevelArcherCommand.getInstance(),
    LevelKnightCommand.getInstance(),
    LevelWizardCommand.getInstance(),
])

const commands_db = ref(
await createLyraDB({
        _id: 'number',
        command: 'string',
        alias: 'string'
    }, commands.value)   
)

const commands_icon = 'mdi:slash-forward'

const commands_handler = async (command: InstanceType<typeof Command>) => {
    await command.execute()
    toggleModal()
}
// #endregion

// #region Interactions
const dblShift = ref(false)
const isModalActive = ref(false)

const toggleModal = () => {
    isModalActive.value = !isModalActive.value
}

const { shift, escape } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        const { type, key } = e
        const isWatchedKey = [ 'shift', 'escape' ].map(_key => _key === key).some(_key => Boolean(_key))
        if (isWatchedKey && type === 'keydown') e.preventDefault()
    }
})

whenever(escape, () => {
    if (!isModalActive.value) return
    isModalActive.value = false
})

whenever(shift, () => {
    if (dblShift.value) return toggleModal()
    dblShift.value = true
    setTimeout(() => dblShift.value = false, 500)
})
// #endregion

// #endregion
</script>

<style>
.glow::before {
    @apply content-default absolute inset-0;
    background: radial-gradient(var(--radius) circle at var(--x) var(--y),hsla(0,0%,100%,.5),transparent 40%);
    border-radius: inherit;
}
</style>