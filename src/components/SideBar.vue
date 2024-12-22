<template>
	<div class="hidden sm:flex h-screen">
		<!-- Sidebar -->
		<div
			class="text-white w-44 px-6 py-4 space-y-2 relative flex flex-col"
			:class="isLoading ? 'bg-neutral-50 shadow' : 'bg-slate-800 '">
			<!-- Vertical Line for Sidebar -->
			<div class="absolute top-0 left-6 h-full"></div>

			<!-- Favorites Section -->

			<!-- Menu Items -->
			<ul
				v-if="!isLoading"
				class="relative flex-1 overflow-y-auto"
				style="scrollbar-width: none"
				@contextmenu="handleRightClick($event)">
				<!-- Membuat menu items bisa di-scroll -->
				<li>
					<div class="text-gray-400 text-sm mb-2">
						<small>Folders</small>
					</div>
				</li>
				<li
					v-for="(item, index) in folders"
					:key="index"
					class="flex flex-col relative">
					<!-- Parent Menu Item -->
					<div
						class="flex items-center space-x-3 cursor-pointer rounded-lg p-2 hover:bg-slate-700 relative"
						@click="$emit('toggle', index)">
						<i :class="item.icon" class="text-[17px]"></i>
						<div class="text-[10px] font-medium">
							{{ item.name }}
						</div>
					</div>

					<!-- Child Menu Items -->
					<ul v-if="item.isOpen" class="pl-6 space-y-1 mt-2 relative">
						<!-- Connector Line from Parent to Child -->
						<div
							v-if="item.children && item.children.length > 0"
							class="absolute left-3 top-0 h-full max-h-[300px] overflow-y-auto"
							:class="{
								'border-l border-slate-600 mb-2': item.isOpen,
							}"></div>
						<li
							v-for="(child, childIndex) in item.children"
							:key="childIndex">
							<!-- Horizontal Connector Line -->
							<div
								@click="$emit('selected', child, true)"
								class="flex items-center space-x-3 cursor-pointer rounded-lg p-2 hover:bg-slate-600 relative"
								:class="{'bg-slate-600': history.some((curr: any) => curr?.id === child?.id)}">
								<span
									class="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 border-t border-slate-600"></span>
								<i :class="child.icon" class="text-[15px]"></i>
								<div class="text-[9px] font-medium">
									{{ child.name }}
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>

			<LoadingSection v-else size-class="h-20" />

			<!-- Folder Creation Button -->
			<div v-if="!isLoading" class="w-full mt-8">
				<button
					class="border border-slate-600 rounded-lg w-full p-1 text-sm hover:bg-slate-700"
					@click="onMenuOptionClick('create')"
				>
					<small>Buat Folder</small>
				</button>
			</div>
		</div>

		<ActionModal
			v-if="contextMenuVisible"
			:context-menu-y="contextMenuY"
			:context-menu-x="contextMenuX"
			:context-menu-docs="contextMenuOptions"
			@on-click="onMenuOptionClick" 
		/>
		
		<CreateModal
			v-if="isModalCreateVisible"
			@close="isModalCreateVisible = false"
			@submit="createFolder"
		/>
	</div>
</template>

<script setup lang="ts">
import LoadingSection from './Loading.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ActionModal from './ActionModal.vue';
import CreateModal from './CreateModal.vue';
// import { watch } from 'vue';
// Define folder and child types
interface Child {
	id?: number;
	name?: string;
	icon?: string;
	isOpen?: boolean;
	children?: Child[];
}

interface Folder {
	id?: number;
	name?: string;
	icon?: string;
	isOpen?: boolean;
	children?: Child[];
}

// Define the 'folders' prop with the correct type
defineProps({
	folders: {
		type: Array as () => Folder[], // Define folders as an array of Folder objects
		default: () => [],
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	history: {
		type: Array as () => Folder[],
		default: () => [],
	},
});

const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuOptions = ref([
	{ label: 'Open', action: 'open', icon: 'fa fa-folder-open' },
	{ label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
	{ label: 'Rename', action: 'rename', icon: 'fa fa-edit' },
	{ label: 'Info', action: 'Info', icon: 'fa fa-info-circle' },
]);

const handleRightClick = (event: MouseEvent) => {
	event.preventDefault();
	contextMenuVisible.value = true;
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;
	contextMenuOptions.value = [
		{ label: 'Buat Folder', action: 'create', icon: 'fa fa-folder-open-o' },
	];
};

const isModalCreateVisible = ref<boolean>(false);
const onMenuOptionClick = (key: string) => {
	if (key === 'create') {
		isModalCreateVisible.value = true;
	}
}

const emits = defineEmits(['create-folder', 'selected', 'toggle', 'open-modal-create']);

const createFolder = (params: { name: string; icon: string }) => {
	emits('create-folder', params, 'sidebar');
	isModalCreateVisible.value = false;
};

const closeContextMenu = () => {
	contextMenuVisible.value = false;
};

onMounted(() => {
	window.addEventListener('click', closeContextMenu);
});

onBeforeUnmount(() => {
	window.removeEventListener('click', closeContextMenu);
});
</script>
