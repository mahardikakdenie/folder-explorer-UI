<template>
	<div class="flex h-screen">
		<!-- Sidebar -->
		<Sidebar
			:folders="menus"
			@selected="loadFolderContent"
			@toggle="setToggle" />

		<!-- Main Content -->
		<div class="w-full flex flex-col">
			<!-- Header / Toolbar -->
			<div class="bg-gray-100 p-4 shadow-md flex items-center space-x-4">
				<button
					@click="goBack"
					class="px-4 py-2 rounded bg-blue-500 text-white">
					Back
				</button>
				<div class="flex-1">
					<small>{{ folderHistory }}</small>
				</div>
				<div class="flex space-x-3 p-2">
					<!-- Grid View Button -->
					<button
						v-for="(icon, index) in [
							'fa-th-large',
							'fa-th-list',
							'fa-list',
						]"
						:key="index"
						class="flex flex-col justify-center items-center p-3 rounded-lg bg-white hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
						<i :class="'fa ' + icon + ' text-2xl'"></i>
					</button>
				</div>
			</div>

			<hr />

			<!-- Main Content (Subfolders Only) -->
			<div
				class="flex-1 p-6 bg-gray-50"
				@contextmenu="handleRightClick($event)">
				<div v-if="selectedFolder">
					<!-- <h2 class="text-2xl font-semibold">{{ subFolder }}</h2> -->

					<!-- Displaying the folder contents (only subfolders) -->
					<div
						v-if="
							!selectedFolder.children ||
							selectedFolder.children.length === 0
						"
						class="flex justify-center">
						<img
							src="https://i.ibb.co.com/zQMFnyg/folder-1.png"
							alt=""
							srcset="" />
					</div>

					<!-- Grid of subfolders -->
					<Documents
						v-if="!isLoading && selectedFolder.children && selectedFolder.children.length > 0"
						:isLoading="isLoading"
						:selected-folder="selectedFolder"
						@handle-right-click="handleDocRightClck"
            @on-double-click="ondblclick"
          />
					<LoadingSection v-else />
				</div>
				<div v-else>
					<p class="text-lg text-gray-500">
						Select a folder to view its contents.
					</p>
				</div>
			</div>
		</div>
		<div
			v-if="contextMenuVisible"
			:style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
			class="absolute bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50 w-48">
			<ul class="space-y-1 text-sm">
				<li v-for="(option, index) in contextMenuOptions" :key="index">
					<button
						@click="onMenuOptionClick(option.action)"
						class="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all duration-150">
						<i :class="option.icon" class="text-lg"></i>
						<span>{{ option.label }}</span>
					</button>
				</li>
			</ul>
		</div>
		<div
			v-if="contextDocsMenu"
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
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import Sidebar from './components/SideBar.vue';
import LoadingSection from './components/Loading.vue';
import { folders } from './libs/static';
import Documents, { Subfolder } from './components/Documents.vue';

const menus = reactive(folders);

const setToggle = (index: number) => {
	menus[index].isOpen = !menus[index].isOpen;
};

const contextMenuOptions = ref([
	{ label: 'Open', action: 'open', icon: 'fa fa-folder-open' },
	{ label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
	{ label: 'Rename', action: 'rename', icon: 'fa fa-edit' },
	{ label: 'Info', action: 'Info', icon: 'fa fa-info-circle' },
]);

const contextMenuDocs = ref<any>([]);

// State
const selectedFolder = ref<Subfolder | null>(null);
// const searchQuery = ref('');
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedItem = ref<any>(null);
const subFolder = ref('');
const parentFolder = ref('');
// const currentFolder = computed(() => {
// 	return `${parentFolder.value} - ${subFolder.value}`;
// });

// Methods
const history = ref<string[]>([]);
const loadFolderContent = (folder: any, subfolder: any) => {
	parentFolder.value = folder?.name;
	selectedFolder.value = subfolder;
	subFolder.value = subfolder.name;

  if (history.value.length > 0) {
    history.value = [];
  }
  history.value.push(folder.name);
};

const folderHistory = computed(() => {
  return history.value?.join(' - ') ?? '';
})

const goBack = () => {
	console.log('Go Back');
};

const handleRightClick = (event: MouseEvent) => {
	event.preventDefault();
	contextMenuVisible.value = true;
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;
	contextMenuOptions.value = [
		{ label: 'Buat Folder', action: 'create', icon: 'fa fa-folder-open-o' },
	];
};

const contextDocsMenu = ref<Boolean>(false);
const handleDocRightClck = (event: MouseEvent, subfolder?: Subfolder) => {
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;
	event.preventDefault();
	contextDocsMenu.value = true;
	selectedItem.value = subfolder;
	if (selectedItem.value) {
    contextMenuDocs.value = [
		{ label: 'Open', action: 'open', icon: 'fa fa-folder-open' },
		{ label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
		{ label: 'Rename', action: 'rename', icon: 'fa fa-edit' },
		{ label: 'Info', action: 'Info', icon: 'fa fa-info-circle' },
	];
  } else {
    contextMenuDocs.value = [
		{ label: 'Buat Folder', action: 'create', icon: 'fa fa-folder-open-o' },
	];
  }

  console.log('contextMenuOptions :', contextMenuOptions.value);
  
};

const ondblclick = (subfolder: Subfolder) => {
  selectedFolder.value = subfolder;
  history.value.push(subfolder.name || '');
};

const closeContextMenu = () => {
	contextMenuVisible.value = false;
  contextDocsMenu.value = false;
};

const onMenuOptionClick = (action: string) => {
	console.log(`${action} action on ${selectedItem}`);
	contextMenuVisible.value = false;
};

// Lifecycle Hooks
const isLoading = ref(true);
onMounted(() => {
	window.addEventListener('click', closeContextMenu);

	setTimeout(() => {
		isLoading.value = false;
	}, 3000);
});

onBeforeUnmount(() => {
	window.removeEventListener('click', closeContextMenu);
});
</script>

<style scoped>
/* Main styling */
.bg-gray-100 {
	background-color: #f7fafc;
}

.bg-white {
	background-color: white;
}

.text-gray-500 {
	color: #a0aec0;
}

.grid-cols-4 {
	grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
	.grid-cols-4 {
		grid-template-columns: repeat(2, 1fr);
		/* Adjust grid layout on smaller screens */
	}
}

.font-icon-folder {
	font-size: 90px !important;
}
</style>
