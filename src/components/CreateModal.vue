<template>
	<modal :title="modalTitle" @close="$emit('close')">
		<template #body>
			<div class="p-3 space-y-2">
				<div class="">
					<input
						v-model="name"
						type="text"
						class="border rounded-md w-full text-sm p-2 placeholder:text-sm placeholder:px-2"
						placeholder="Name Folder" />
				</div>
				<div v-if="!hideIcon"class="">
					<div class="border rounded-md my-2">
						<div class="px-4">
							<small class="font-bold">Icons</small>
						</div>
						<div class="grid grid-cols-10 gap-2 p-3">
							<div
								v-for="icon in icons"
								:key="icon"
								class="border p-2 flex justify-center hover:bg-blue-200 rounded-md cursor-pointer" :class="{'bg-blue-200': selectedIcon === icon}"
                                @click="onSelectIcon(icon)"
                            >
								<i
									:class="`${icon} text-blue-600`"
									aria-hidden="true"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template #footer>
			<div class="px-4 gap-2 flex">
				<button
					class="text-sm border rounded-md px-4 border-neutral-200 text-neutral-800 py-1"
                    @click="$emit('close')"
                >
					Cancel
				</button>
				<button
					class="text-sm border rounded-md px-4 bg-blue-500 text-white py-1"
					@click="submit">
					Submit
				</button>
			</div>
		</template>
	</modal>
</template>

<script setup lang="ts">
import { Folder } from './Documents.vue';
import Modal from './Modal.vue';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    hideIcon: {
        type: Boolean,
        default: false,
    },
    selected: {
		type: Object as () => Folder, // Use the Folder interface
		default: () => ({
			name: '',
			children: [], // Initialize with empty children array
		}),
	},
    type: {
        type: String,
        default: 'create',
    }
});

const name = ref<string>('');
const selectedIcon = ref<string | null>(null);
const icons = ref<string[]>([
	'fa fa-folder',
	'fa fa-folder-open-o',
	'fa fa-music',
    'fa fa-facebook',
	'fa fa-twitter',
	'fa fa-instagram',
	'fa fa-linkedin',
	'fa fa-youtube',
	'fa fa-github',
	'fa fa-user',
	'fa fa-user-circle',
	'fa fa-cog',
	'fa fa-home',
	'fa fa-search',
	'fa fa-shopping-cart',
	'fa fa-heart',
	'fa fa-bell',
	'fa fa-envelope',
	'fa fa-phone',
	'fa fa-file',
	'fa fa-cloud',
	'fa fa-trash',
	'fa fa-plus',
	'fa fa-minus',
	'fa fa-check',
	'fa fa-times',
	'fa fa-arrow-left',
	'fa fa-arrow-right',
	'fa fa-arrow-up',
	'fa fa-arrow-down',
	'fa fa-arrow-circle-left',
	'fa fa-arrow-circle-right',
	'fa fa-laptop',
	'fa fa-camera',
	'fa fa-microphone',
	'fa fa-plug',
	'fa fa-credit-card',
	'fa fa-briefcase',
	'fa fa-tree',
	'fa fa-leaf',
	'fa fa-heartbeat',
	'fa fa-stethoscope',
	'fa fa-eye',
	'fa fa-lock',
	'fa fa-unlock',
	'fa fa-gift',
	'fa fa-star',
	'fa fa-flag',
]);

const onSelectIcon = (icon: string) => {
    selectedIcon.value = icon
}


const modalTitle = computed(() => props.type === 'rename' ? 'Edit Folder' : 'Buat Folder');
const emits = defineEmits(['submit', 'update', 'close']);
const submit = () => {
    const params ={
        id: props?.selected?.id ?? null,
        name: name.value,
        icon: selectedIcon?.value || 'fa fa-folder',
    }
    
    if (props.type === 'rename') {
        emits('update', params);
    } else {
        emits('submit', params);
    }
};

onMounted(() => {
    if (props.selected && props.type === 'rename') {
        name.value = props.selected.name ?? '';
    }
});
</script>
