<template>
	<div class="flex h-screen">
		<!-- Sidebar -->
		<Sidebar
			:folders="menus"
			:is-loading="isFetching"
			:history="history"
			@selected="setSelectedFolder"
			@toggle="setToggle" />

		<!-- Main Content -->
		<div class="w-full flex flex-col">
			<!-- Header / Toolbar -->
			<div
				class="bg-gray-100 p-4 shadow-md flex items-center space-x-4 justify-between">
				<div class="flex gap-2">
					<button
						@click="goBack(folderHistory[folderHistory.length - 2])"
						class="px-2 border border-blue-500 rounded-md">
						<i
							class="fa fa-chevron-left text-blue-500"
							aria-hidden="true"></i>
					</button>
					<div class="flex items-center space-x-2">
						<small
							v-for="(history, index) in folderHistory"
							:key="index"
							class="hover:text-blue-600 hover:underline cursor-pointer transition duration-300 ease-in-out"
							@click="setSelectedFolder(history, history)">
							{{ history.name }}
							<!-- Gunakan ikon Font Awesome sebagai pemisah -->
							<small
								v-if="index !== folderHistory.length - 1"
								class="mx-2 text-gray-500">
								<i class="fa fa-arrow-right"></i>
								<!-- Ikon panah kanan -->
							</small>
						</small>
					</div>
				</div>
				<div class="flex space-x-1 p-2">
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
						v-if="
							!isLoading &&
							selectedFolder.children &&
							selectedFolder.children.length > 0
						"
						:isLoading="isLoading"
						:selected-folder="selectedFolder"
						@handle-right-click="handleDocRightClck"
						@on-double-click="ondblclick" />
					<LoadingSection v-else />
				</div>
				<div v-else>
					<p class="text-lg text-gray-500">
						Select a folder to view its contents.
					</p>
				</div>
			</div>
		</div>
		<ActionModal
			v-if="contextMenuVisible"
			:context-menu-y="contextMenuY"
			:context-menu-x="contextMenuX"
			:context-menu-docs="contextMenuOptions"
			@on-click="onMenuOptionClick" />
		<ActionModal
			v-if="contextDocsMenu"
			:context-menu-y="contextMenuY"
			:context-menu-x="contextMenuX"
			:context-menu-docs="contextMenuDocs"
			@on-click="onMenuOptionClick" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import Sidebar from './components/SideBar.vue';
import LoadingSection from './components/Loading.vue';
import ActionModal from './components/ActionModal.vue';
import { folders } from './libs/static';
import Documents, { Subfolder } from './components/Documents.vue';
import { getData, getDataSub } from './libs/api/folders';

const menus = ref(folders);

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
const isLoading = ref(false);
const isFetching = ref<boolean>(false);
const history = ref<any>([]);
// Methods
const setToggle = (index: number) => {
	menus.value[index].isOpen = !menus.value[index].isOpen;
	selectedFolder.value = menus.value[index];

	if (history.value.length > 0) {
		history.value = [];
	}
	history.value.push(menus.value[index]);
};

const setSelectedFolder = (folder: any, subfolder: any) => {
	parentFolder.value = folder?.name;
	selectedFolder.value = subfolder;
	subFolder.value = subfolder.name;

	const index = history.value.findIndex(
		(curr: any) => curr?.id === subfolder?.id
	);
	if (history.value.length > 0) {
		// Cek apakah id pertama di history berbeda dengan folder id yang sedang diproses
		if (history.value[0].id !== folder?.id && index === -1) {
			history.value = []; // Reset history jika id pertama berbeda
		} else if (history.value[0].id === folder?.id && index === -1) {
			// Jika id pertama sama, tambahkan subfolder ke history
			history.value.push(subfolder);
		} else {
			if (index !== -1) {
				// Jika ditemukan, hapus elemen setelah index pertama yang ditemukan
				history.value = history.value.slice(0, index + 1);
			}
		}
	} else {
		// Jika history kosong, tambahkan folder pertama
		history.value.push(folder);
	}
};

const folderHistory = computed(() => {
	return history.value;
});

const goBack = (history: any) => {
  if (history) {
    setSelectedFolder(history, history);
  }
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
			{
				label: 'Buat Folder',
				action: 'create',
				icon: 'fa fa-folder-open-o',
			},
		];
	}
};

const getSubDocs = (documentId: number) => {
	isLoading.value = true;
	const callback = (res: any) => {
		const data = res?.data;
		isLoading.value = false;
		selectedFolder.value = data;
	};

	const err = (e: any) => console.log(e);

	getDataSub(documentId, { entities: 'children.children' }, callback, err);
};

const ondblclick = (subfolder: Subfolder) => {
	getSubDocs(subfolder.id ?? 0);
	history.value.push(subfolder || '');
};

const closeContextMenu = () => {
	contextMenuVisible.value = false;
	contextDocsMenu.value = false;
};

const onMenuOptionClick = (key: string) => {
	console.log(key);
};

const getDataFolders = () => {
	isFetching.value = true;
	isLoading.value = true;
	const callback = (res: any) => {
		menus.value = res?.data;
		isFetching.value = false;
		isLoading.value = false;
	};

	const err = (e: any) => console.log(e);

	getData({ entities: 'children.children' }, callback, err);
};

// Lifecycle Hooks
onMounted(() => {
	getDataFolders();
	window.addEventListener('click', closeContextMenu);
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
