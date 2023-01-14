<template>
	<div class="card glow">
		<div>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.card {
    @apply
    relative
    flex flex-col justify-center items-center
    rounded-lg
    bg-[#18181b];
    --radius: 6rem;
}

.card > div {
    @apply
    flex flex-col justify-center items-center
    m-px
    p-2
    text-xs
    bg-[#0c0c0c];
    border-radius: inherit;
    z-index: 1000;
}
</style>