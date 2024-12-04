<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar :folders="folders" @folder-selected="loadFolderContent" />

    <!-- Main Content -->
    <div class="w-full flex flex-col">
      <!-- Header / Toolbar -->
      <div class="bg-gray-100 p-4 shadow-md flex items-center space-x-4">
        <button @click="goBack" class="px-4 py-2 rounded bg-blue-500 text-white">Back</button>
        <div class="flex-1">
          <input type="text" v-model="searchQuery" placeholder="Search"
            class="w-full p-2 rounded-lg border border-gray-300" />
        </div>
        <div class="flex space-x-3 p-2">
          <!-- Grid View Button -->
          <button v-for="(icon, index) in ['fa-th-large', 'fa-th-list', 'fa-list']" :key="index"
            class="flex flex-col justify-center items-center p-3 rounded-lg bg-white hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
            <i :class="'fa ' + icon + ' text-2xl'"></i>
          </button>
        </div>
      </div>

      <!-- Main Content (Subfolders Only) -->
      <div class="flex-1 p-6 bg-gray-50" @contextmenu="handleRightClick($event)">
        <div v-if="selectedFolder">
          <h2 class="text-2xl font-semibold">{{ selectedFolder.name }}</h2>

          <!-- Displaying the folder contents (only subfolders) -->
          <div v-if="selectedFolder.subfolders.length === 0">
            <p class="text-gray-500">No subfolders.</p>
          </div>

          <!-- Grid of subfolders -->
          <div v-if="!isLoading" class="grid sm:grid-cols-10 grid-cols-2 mt-6 gap-10">
            <!-- Subfolders in selected folder -->
            <div v-for="subfolder in selectedFolder.subfolders" :key="subfolder.id"
              class="rounded hover:bg-gray-200 hover:rounded-lg cursor-pointer"
              @click="selectItem(subfolder)"
              @contextmenu="handleRightClick($event)"
            >
              <div class="flex justify-center">
                 <img src="https://i.ibb.co.com/87DRwhQ/folder.png" width="100" alt="" srcset="">
              </div>
              <p class="text-center">{{ subfolder.name }}</p>
            </div>
          </div>
          <LoadingSection v-else />
        </div>
        <div v-else>
          <p class="text-lg text-gray-500">Select a folder to view its contents.</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from './components/SideBar.vue';
import LoadingSection from './components/Loading.vue';

const folders = reactive([
  {
    id: 1,
    name: 'Documents / Work',
    subfolders: [
      {
        id: 3,
        name: 'Work',
        icon: 'fa fa-folder',
        subfolders: [
          { id: 4, name: 'WorkDoc1.pdf', type: 'file', icon: 'fa fa-file-pdf' },
          { id: 5, name: 'WorkImage.png', type: 'file', icon: 'fa fa-image' }
        ],
      },
      {
        id: 6,
        name: 'Personal',
        icon: 'fa fa-folder',
        items: [
          { id: 7, name: 'PersonalFile.txt', type: 'file', icon: 'fa fa-folder-open' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Downloads',
    subfolders: []
  }
]);

const contextMenuOptions = reactive([
  { label: 'Open', action: 'open', icon: 'fa fa-folder-open' },
  { label: 'Delete', action: 'delete', icon: 'fa fa-trash' },
  { label: 'Rename', action: 'rename', icon: 'fa fa-edit' }
]);


// State
const selectedFolder = ref(folders[0]);
const searchQuery = ref('');
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedItem = ref(null);

// Methods
const loadFolderContent = (folder: any) => {
  selectedFolder.value = folder;
};

const goBack = () => {
  console.log('Go Back');
};

const selectItem = (item: any) => {
  console.log('Selected Item:', item.name);
};

const handleRightClick = (event: MouseEvent, item?: any) => {
  event.preventDefault();
  contextMenuVisible.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  selectedItem.value = item;
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
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
    isLoading.value = false
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
