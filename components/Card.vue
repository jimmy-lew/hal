<template>
	<div class="card glow" :class="`rounded-${round}`">
		<div :class="`p-${padding}`">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    radius?: number
    padding?: number
    round?: RoundTypes
}>(), {
    radius: 6,
    padding: 2,
    round: 'lg'
})

const glowRadius = computed(() => `${props.radius}rem`)
</script>

<style scoped>
.card {
    @apply
    relative
    flex flex-col justify-center items-center
    bg-[#18181b];
    --radius: v-bind(glowRadius);
}

.card > div {
    @apply
    flex flex-col justify-center items-center
    m-px
    text-xs
    bg-[#0c0c0c];
    border-radius: inherit;
    z-index: 1000;
}
</style>