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
        <div ref="modal" class="relative flex flex-col rounded-lg shadow-lg backdrop-blur-lg bg-[#0c0c0ce8] border-[0.5px] border-white/20">
            <div class="flex items-center rounded-t py-4 px-6 border-b-[0.5px] border-white/20">
                <Icon name="line-md:search" class="text-white -scale-x-100 mr-2"/>
                <input
                    ref="input"
                    class="w-full bg-transparent focus:outline-0 placeholder:text-zinc-300"
                    type="text"
                    v-model="search"
                    placeholder="Type a command or search..."
                />
            </div>
            <div class="py-1">
                <div class="results flex flex-col items-center pt-0 max-h-96 overflow-y-auto">
                    <!-- <SearchSection v-if="Object.values(searchResults).some(dataHit => dataHit.length > 0)" v-for="dataHits in Object.entries(searchResults)" :title="dataHits[0]">
                        <SearchItem v-if="dataHits.length > 0" v-for="data in dataHits[1]" :key="data.id" :objectKey="dataHits[0]" :data="data" @click="emits('outsideClicked')" />
                    </SearchSection> -->
                    <!-- <div v-else class="py-10 text-gray-400">
                        No Results
                    </div> -->
                    <div class="py-10 text-zinc-300">
                        No Results
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
const emits = defineEmits(['close'])

const modal = ref<Nullable<HTMLElement>>(null)
const search = ref('')
</script>

<style scoped>

</style>