<template>
    <div class="w-full flex justify-center h-full items-center">
        <img :src="LoadingSVG" alt="loading" class="w-36 h-auto max-w-full object-contain" />
    </div>
</template>

<script setup lang="ts">
import LoadingSVG from '../assets/loading.gif';
</script>
