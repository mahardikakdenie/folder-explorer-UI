<template>
    <div class="hidden sm:flex h-screen">
        <!-- Sidebar -->
        <div class="bg-slate-800 text-white w-44 p-6 space-y-6 relative flex flex-col">
            <!-- Vertical Line for Sidebar -->
            <div class="absolute top-0 left-6 h-full"></div>

            <!-- Favorites Section -->

            <!-- Menu Items -->
            <ul class="relative flex-1 overflow-y-auto" style="scrollbar-width: none;">
                <!-- Membuat menu items bisa di-scroll -->
                <li>
                    <div class="text-gray-400 text-sm mb-2">
                        <small>Folders</small>
                    </div>
                </li>
                <li v-for="(item, index) in menuItems" :key="index" class="flex flex-col relative">
                    <!-- Parent Menu Item -->
                    <div class="flex items-center space-x-3 cursor-pointer rounded-lg p-2 hover:bg-slate-700 relative"
                        @click="toggleChildMenu(index)">
                        <i :class="item.icon" class="text-[17px]"></i>
                        <div class="text-[10px] font-medium">
                            {{ item.name }}
                        </div>
                    </div>

                    <!-- Child Menu Items -->
                    <ul v-if="item.isOpen" class="pl-6 space-y-1 mt-2 relative">
                        <!-- Connector Line from Parent to Child -->
                        <div v-if="item.children && item.children.length > 0"
                            class="absolute left-3 top-0 h-full max-h-[300px] overflow-y-auto" :class="{
                                'border-l border-slate-600 mb-2': item.isOpen,
                            }"></div>
                        <li v-for="(child, childIndex) in item.children" :key="childIndex">
                            <!-- Horizontal Connector Line -->
                            <div
                                class="flex items-center space-x-3 cursor-pointer rounded-lg p-2 hover:bg-slate-600 relative">
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

            <!-- Folder Creation Button -->
            <div class="w-full mt-8">
                <button class="border border-slate-600 rounded-lg w-full p-1 text-sm hover:bg-slate-700">
                    <small>Buat Folder</small>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { folders } from "../libs/static.ts";

const menuItems = reactive(folders);

const toggleChildMenu = (index: number) => {
    menuItems[index].isOpen = !menuItems[index].isOpen;
};
</script>
