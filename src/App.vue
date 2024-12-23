<template>
	<div class="flex h-screen">
		<!-- Sidebar -->
		<Sidebar
			:folders="menus"
			:is-loading="isFetching"
			:history="history"
			@selected="setSelectedFolder"
			@toggle="setToggle"
			@create-folder="createFolder"
			@open-modal-create="onMenuOptionClick('create')" />

		<!-- Main Content -->
		<div class="w-full flex flex-col">
			<!-- Header / Toolbar -->
			<div
				class="bg-gray-100 p-4 shadow-md flex items-center space-x-4 justify-between">
				<div class="flex gap-2">
					<button
						@click="
							goBack(folderHistory?.[folderHistory?.length - 2])
						"
						class="px-2 border border-blue-500 rounded-md">
						<i
							class="fa fa-chevron-left text-blue-500"
							aria-hidden="true"></i>
					</button>
					<div class="flex items-center space-x-2">
						<button
							v-for="(history, index) in folderHistory"
							:key="index"
							class="hover:text-blue-600 transition duration-300 ease-in-out text-[12px]"
							:disabled="index === folderHistory.length - 1"
							@click="setSelectedFolder(history)">
							{{ history?.name }}
							<!-- Gunakan ikon Font Awesome sebagai pemisah -->
							<small
								v-if="index !== folderHistory.length - 1"
								class="mx-2 text-gray-500">
								<i class="fa fa-arrow-right"></i>
								<!-- Ikon panah kanan -->
							</small>
						</button>
					</div>
				</div>
				<!-- Folder Creation Button -->
				<div v-if="!isLoading">
					<button
						class="border border-slate-600 rounded-lg w-full p-1 text-sm hover:bg-slate-700"
						@click="onMenuOptionClick('create')">
						<small>Buat Folder</small>
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
							selectedFolder &&
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
					<Documents
						:selected-folder="generalFolder"
						@handle-right-click="handleDocRightClck"
						@on-double-click="ondblclick" />
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

		<CreateModal
			v-if="isModalCreateVisible"
			:hide-icon="history.length >= 0"
			:selected="selectedItem"
			@close="isModalCreateVisible = false"
			:type="modalType"
			@submit="createFolder"
			@update="updateFolder" />

		<ConfirmModal
			v-if="isConfirmModalVisible"
			:selected="selectedItem"
			@close="isConfirmModalVisible = false"
			@submit="deleteData" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import Sidebar from './components/SideBar.vue';
import LoadingSection from './components/Loading.vue';
import CreateModal from './components/CreateModal.vue';
import ActionModal from './components/ActionModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import { folders } from './libs/static';
import Documents, { Subfolder } from './components/Documents.vue';
import {
	createFolders,
	deleteFolderData,
	getData,
	getDataSub,
	updateFolderData,
} from './libs/api/folders';

const menus = ref<any>(folders);

const contextMenuOptions = ref([
	{ label: 'Open', action: 'open', icon: 'fa fa-folder-open' },
	{ label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
	{ label: 'Rename', action: 'rename', icon: 'fa fa-edit' },
	{ label: 'Info', action: 'Info', icon: 'fa fa-info-circle' },
]);

const contextMenuDocs = ref<any>([]);

// State
const selectedFolder = ref<Subfolder>();
const generalFolder = ref<Subfolder | undefined>(undefined);
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
const isModalCreateVisible = ref<boolean>(false);
// Methods
const setToggle = (index: number) => {
	menus.value[index].isOpen = !menus.value[index].isOpen;
	selectedFolder.value = menus.value[index];

	if (history.value.length > 0) {
		history.value = [];
	}
	history.value.push(menus.value[index]);
};

const setSelectedFolder = (
    folder: any,
    isSidebar: boolean | undefined = false
) => {
    parentFolder.value = folder?.name;
    selectedFolder.value = folder;

    if (selectedFolder.value) {
        selectedFolder.value.children = (selectedFolder?.value?.children || []).filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );
        getSubDocs(folder.id);
    }

    subFolder.value = folder.name;

    if (isSidebar) {
        updateHistoryForSidebar(folder);
    } else {
        updateHistory(folder);
    }
};

const updateHistoryForSidebar = (folder: any) => {
    history.value = [];

    if (folder?.parent) {
        history.value.push(folder?.parent, folder);
    }
};

const updateHistory = (folder: any) => {
    if (history.value.length === 0 || !history.value.some((curr: any) => curr?.id === folder?.id)) {
        history.value = [folder];
        return;
    }

    const folderIndex = history.value.findIndex((curr: any) => curr?.id === folder?.id);

    if (folderIndex !== -1) {
        history.value = history.value.slice(0, folderIndex + 1);
    } else {
        history.value.push(folder);
    }
};

const folderHistory = computed(() => {
	return history.value;
});

const goBack = (folderHistory: any) => {
	if (folderHistory) {
		setSelectedFolder(folderHistory);
	} else {
		selectedFolder.value = undefined;
		history.value = [];
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
			{ label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
			{ label: 'Rename', action: 'rename', icon: 'fa fa-edit' },
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

	getDataSub(
		documentId,
		{ entities: 'children.children,children.parent' },
		callback,
		err
	);
};

const isConfirmModalVisible = ref<boolean>(false);

const deleteData = (selected: any) => {
	const callback = (res: any) => {
		const data = res?.data;

		if (history.value.length === 0) {
			const index = generalFolder.value?.children?.findIndex(
				(curr) => curr?.id === data?.id
			);
			if ((index && index !== -1) || index === 0) {
				if (generalFolder.value?.children?.length === 1) {
					generalFolder.value.children = [];
				}
				generalFolder.value?.children?.splice(index, 1);
			}

			const indexMenus = menus.value.findIndex(
				(curr: any) => curr?.id === data.id
			);

			if ((indexMenus && indexMenus !== -1) || indexMenus === 0) {
				menus.value.splice(indexMenus, 1);
			}
		} else {
			if (selectedFolder.value) {
				const index = selectedFolder.value.children?.findIndex(
					(curr) => curr?.id === data?.id
				);

				if ((index && index !== -1) || index === 0) {
					if (selectedFolder.value.children) {
						selectedFolder.value.children.splice(index, 1);
					}
				}
			}
		}

		isConfirmModalVisible.value = false;
		selectedFolder.value = {};
	};

	const err = (e: any) => console.log(e);

	deleteFolderData(selected?.id, callback, err);
};

const createFolder = (params: any, type: string) => {
	const callback = (res: any) => {
		const data = res?.data?.data;

		if (type === 'sidebar') {
			menus.value.push({ ...data, children: [] });
		} else {
			isModalCreateVisible.value = false;

			if (history.value.length === 0) {
				if (generalFolder.value?.children) {
					generalFolder.value.children.push({
						...data,
						children: [],
					});
				}
			} else {
				if (selectedFolder.value) {
					if (selectedFolder.value.children) {
						selectedFolder.value.children.push(data);
						if (selectedFolder?.value?.isOpen === undefined) {
							const indexParent = menus.value.findIndex(
								(curr: any) => curr?.id === data?.parent_id
							);

							if (
								(indexParent && indexParent !== -1) ||
								indexParent === 0
							) {
								menus.value[indexParent].children.push(data);
							}
						}
					}

					// Checking not duplicate data
					if (
						selectedFolder?.value?.children &&
						selectedFolder?.value?.children?.length > 0
					) {
						selectedFolder.value.children =
							selectedFolder?.value?.children?.filter(
								(item, index, self) =>
									index ===
									self.findIndex((t) => t.id === item.id)
							);
						console.log(
							'🚀 ~ callback ~ selectedFolder.value.children:',
							selectedFolder.value.children
						);
					}
				}

				const activeFolder = history?.value?.findIndex(
					(curr: any) => curr?.id === selectedFolder.value?.id
				);

				if (activeFolder !== -1) {
					history.value[activeFolder].children.push(data);
				}
			}
		}

		// selectedFolder.value = null;
	};

	const err = (e: any) => console.log(e);

	createFolders(
		{
			name: params.name,
			icon: history.value.length === 0 ? params?.icon : 'fa fa-folder',
			parent_id: selectedFolder?.value?.id ?? null,
		},
		callback,
		err
	);
};

const updateFolder = (params: any) => {
	const callback = (res: any) => {
		const data = res?.data;

		// Pastikan selectedFolder tidak null atau undefined sebelum mengakses value
		if (selectedFolder?.value) {
			selectedFolder.value.name = data?.name ?? '';
		}
		if (history.value.length === 0) {
			const index = generalFolder.value?.children?.findIndex(
				(curr) => curr?.id === params?.id
			);

			if ((index && index !== -1) || index === 0) {
				if (generalFolder.value?.children) {
					generalFolder.value.children[index].name = params?.name;
				}
			}
		} else {
			if (selectedFolder.value) {
				const index = selectedFolder.value.children?.findIndex(
					(curr) => curr?.id === params?.id
				);

				if ((index && index !== -1) || index === 0) {
					if (selectedFolder.value.children) {
						selectedFolder.value.children[index].name =
							params?.name;
					}
				}
			}
		}

		isModalCreateVisible.value = false;
		selectedItem.value = null;
	};

	const err = (e: any) => console.log(e);

	updateFolderData(params.id, { name: params.name }, callback, err);
};

const ondblclick = (subfolder: Subfolder) => {
	getSubDocs(subfolder.id ?? 0);
	history.value.push(subfolder || '');
};

const closeContextMenu = () => {
	contextMenuVisible.value = false;
	contextDocsMenu.value = false;
};

const modalType = ref<string>('create');
const onMenuOptionClick = (key: string) => {
	if (key === 'create') {
		modalType.value = 'create';
		isModalCreateVisible.value = true;
	} else if (key === 'rename') {
		modalType.value = 'rename';
		isModalCreateVisible.value = true;
	} else {
		isConfirmModalVisible.value = true;
	}
};

const getDataFolders = () => {
	isFetching.value = true;
	isLoading.value = true;
	const callback = (res: any) => {
		menus.value = res?.data;
		isFetching.value = false;
		isLoading.value = false;

		generalFolder.value = {
			id: 1,
			name: 'haha',
			icon: '',
			children: res?.data,
		};
		isLoading.value = false;
	};

	const err = (e: any) => console.log(e);

	getData({ entities: 'children.children,children.parent' }, callback, err);
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
