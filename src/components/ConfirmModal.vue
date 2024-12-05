<template>
    <modal title="Konfirmasi">
        <template #body>
            <div>
                <span>Apakah Anda Yakin Ingin Menghapus Folder Ini ? </span>
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
					@click="onSubmit">
					Submit
				</button>
			</div>
		</template>
    </modal>
</template>

<script lang="ts" setup>
import { Folder } from './Documents.vue';
import Modal from './Modal.vue';

const props = defineProps({
    selected: {
        type: Object as () => Folder,
        default:  null,
    }
});

const emits = defineEmits(['submit', 'close']);

const onSubmit = () => {
    emits('submit', props.selected);
}
</script>
