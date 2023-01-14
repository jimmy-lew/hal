<template>
    <div
        class="
        absolute z-10
        -top-[110%] left-1/2 -translate-x-1/2
        text-xs"
    >
        <div class="tooltip glow">
            <div>
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.tooltip {
    @apply
    relative
    flex flex-col justify-center items-center
    rounded-md
    bg-[#18181b];
    --radius: 10rem; 
}

.tooltip > div {
    @apply
    flex flex-col justify-center items-center
    m-px
    py-2 px-3
    text-xs
    bg-[#0c0c0c];
    border-radius: inherit;
    z-index: 1000;
}
</style>