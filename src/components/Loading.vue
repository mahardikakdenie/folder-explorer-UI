<template>
    <div class="w-full flex justify-center h-full items-center">
        <img :src="LoadingSVG" alt="loading" class="h-auto max-w-full object-contain" :class="`${sizeClass}`" />
    </div>
</template>

<script setup lang="ts">
import LoadingSVG from '../assets/loading.gif';

defineProps({
    sizeClass: {
        type: String,
        default: 'w-36'
    }
})
</script>
