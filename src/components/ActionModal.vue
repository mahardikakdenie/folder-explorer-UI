<template>
	<div
		:style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
		class="absolute bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50 w-48">
		<ul class="space-y-1 text-sm">
			<li v-for="(option, index) in contextMenuDocs" :key="index">
				<button
					@click="onMenuOptionClick(option.action)"
					class="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all duration-150">
					<i :class="option.icon" class="text-lg"></i>
					<span>{{ option.label }}</span>
				</button>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
interface Menu {
    action: string;
    icon: string;
    label: string;
}
defineProps({
    contextMenuY: {
        type: Number,
        default: '',
    },
    contextMenuX: {
        type: Number,
        default: ''
    },
    contextMenuDocs: {
        type: Array as () => Menu[],
        default: () => {},
    }
});

const emits = defineEmits(['on-click']);

const onMenuOptionClick = (key: string) => {
    console.log("🚀 ~ onMenuOptionClick ~ key:", key)
    emits('on-click', key);
};
</script>
