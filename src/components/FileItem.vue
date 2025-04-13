<template>
	<div class="file-item" :data-id="file.name">
		<div class="drag-handle">≡</div>
		<div class="file-info">
			<div class="file-name">{{ file.name }}</div>
			<div class="file-path">{{ file.path }}</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	file: {
		type: Object,
		required: true
	}
})
</script>

<style scoped>
.file-item {
	display: flex;
	align-items: center;
	padding: 12px;
	margin: 4px 0;
	background: white;
	border-radius: 6px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.drag-handle {
	margin-right: 12px;
	cursor: move;
	color: #64748b;
	font-size: 20px;
	user-select: none;
}

.file-info {
	flex: 1;
	overflow: hidden;
}

.file-name {
	font-weight: 500;
	margin-bottom: 4px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.file-path {
	font-size: 12px;
	color: #64748b;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.sortable-ghost .file-item {
	opacity: 0.5;
	background: #e2e8f0;
}

.sortable-chosen .file-item {
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
