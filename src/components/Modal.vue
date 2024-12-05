<template>
	<div class="modal-backdrop">
		<div class="modal-container p-2">
			<!-- Modal Header -->
			<div class="flex justify-between py-2 border-b px-3">
				<slot name="header">
					<small class="text-sm font-bold">{{ title }}</small>
				</slot>
				<button @click="closeModal" class="modal-close-button">
					<i class="fa fa-times" aria-hidden="true"></i>
				</button>
			</div>

			<!-- Modal Body -->
			<div class="modal-body p-2">
				<slot name="body">
					<p>
						This is the content of the modal. You can add your text,
						forms, or other components here.
					</p>
				</slot>
			</div>

			<!-- Modal Footer -->
			<div class="modal-footer">
				<slot name="footer">
					<button @click="closeModal" class="btn btn-danger">
						Close
					</button>
				</slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>

defineProps({
  title: {
    type: String,
    default: 'Modal Title',
  }
});

const emits = defineEmits(['close']);

// Method to close the modal
const closeModal = () => {
  emits('close');
};
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3); /* Semi-transparent background */
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

/* Modal Container */
.modal-container {
	background-color: #fff;
	border-radius: 0.75rem;
	width: 700px;
	max-width: 90%;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	transition: transform 0.3s ease-in-out;
}

/* Modal Header */
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #eee;
}

/* Modal Title */
.modal-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: #333;
}

/* Close Button */
.modal-close-button {
	background: none;
	border: none;
	cursor: pointer;
	color: #888;
	transition: color 0.3s ease;
}

.modal-close-button:hover {
	color: #333;
}

/* Modal Body */
.modal-body {
	font-size: 1rem;
	color: #555;
	margin-bottom: 1.5rem;
	line-height: 1.5;
}

/* Modal Footer */
.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
}

/* Buttons */
.btn {
	padding: 0.75rem 1.25rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-danger {
	background-color: #f44336;
	color: #fff;
	border: none;
}

.btn-danger:hover {
	background-color: #e53935;
}

/* Adding animation to the modal */
@keyframes modalAnimation {
	0% {
		transform: scale(0.9);
		opacity: 0;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

.modal-container {
	animation: modalAnimation 0.3s ease-out;
}
</style>
