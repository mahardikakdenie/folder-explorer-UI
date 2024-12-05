<template>
	<div v-if="!isLoading" class="grid sm:grid-cols-2 grid-cols-1 mt-6 gap-10">
		<!-- Subfolders in selected folder -->
		<div
			v-if="selectedFolder.children"
			class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-5 max-h-[680px] overflow-y-auto">
			<div
				v-for="(subfolder, index) in selectedFolder.children"
				:key="index"
				class="rounded-xl bg-gray-50 transition duration-300 ease-in-out">
				<div
					class="flex flex-col justify-center items-center p-4 hover:bg-gray-200 hover:shadow-lg cursor-pointer rounded-md"
					@click="selectItem(subfolder)"
					@contextmenu="handleRightClick($event, subfolder)"
					@dblclick="onDoubleClick(subfolder)">
					<div
						class="w-16 h-16 bg-gray-300 rounded-full flex justify-center items-center mb-2">
						<img
							src="https://i.ibb.co/87DRwhQ/folder.png"
							alt="folder icon"
							class="w-12 h-12" />
					</div>
					<p class="text-sm text-center font-semibold text-gray-800">
						{{ subfolder.name }}
					</p>
				</div>
			</div>
		</div>
		<!-- Default folder view for larger screens or empty state -->
		<div class="hidden sm:inline-block text-center">
			<div class="w-48 mx-auto mb-4">
				<img
					src="https://i.ibb.co/87DRwhQ/folder.png"
					alt="default folder" />
			</div>
			<p v-if="!selectFolder" class="text-gray-500">No folders to display</p>

			<div v-else class="mt-10 text-start">
				<div>
					<span class="text-md font-bold">{{ selectFolder.name }}</span>
				</div>
				<div>
					<p class="text-sm text-gray-400">
						This folder is currently empty. Upload your files to get
						started.
					</p>
				</div>
				<div class="mt-4 text-sm text-gray-500">
					<p>
						If you are looking for specific documents, you can
						organize them here. Click on the folder to start adding
						content!
					</p>
				</div>
				<div class="mt-6">
					<!-- Optional: Add a button to upload or create a folder -->
					<button
                        @click="onDoubleClick(selectFolder)"
						class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
						Masuk Documents
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// Define the structure of each subfolder item
export interface Subfolder {
    id?: number
	name?: string;
	icon?: string;
	isOpen?: boolean,
	children?: Subfolder[]; // Optional: Only if folders can have nested folders
}

// Define the structure of the selected folder (which contains an array of subfolders)
export interface Folder {
    id?: number
	name?: string;
	icon?: string;
	children?: Subfolder[];
}

// Define props with types
defineProps({
	isLoading: {
		type: Boolean,
		default: false,
	},
	selectedFolder: {
		type: Object as () => Folder, // Use the Folder interface
		default: () => ({
			name: '',
			children: [], // Initialize with empty children array
		}),
	},
});

const selectFolder = ref<Folder | null>(null);

// Methods
const emits = defineEmits([
	'handle-right-click',
	'select-item',
	'on-double-click',
]);

const selectItem = (subfolder: Subfolder) => {
	emits('select-item', subfolder);
    selectFolder.value = subfolder;
};

const handleRightClick = (event: MouseEvent, subfolder: Subfolder) => {
	emits('handle-right-click', event, subfolder);
};

const onDoubleClick = (subfolder: Subfolder) => {
	emits('on-double-click', subfolder);
};
</script>

<style scoped>
/* Optionally, add custom styling for animations or shadows */
</style>
