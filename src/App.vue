<template>
	<div class="app-container">
		<header>
			<h1><i class="fas fa-video"></i> FLV文件合并工具</h1>
			<div class="message" :class="resMsg.success">{{ resMsg.message }}</div>
		</header>
		<main>
			<div class="control-panel">
				<div class="directory-selector">
					<input v-model="directory" placeholder="选择FLV文件目录" readonly />
					<button @click="openFolderDialog"><i class="fas fa-folder-open"></i> 浏览</button>
				</div>
				<button @click="handleScan" :disabled="isLoading">
					<i class="fas" :class="isLoading ? 'fa-spinner fa-pulse' : 'fa-search'"></i>
					{{ isLoading ? '扫描中...' : '扫描FLV文件' }}
				</button>
			</div>

			<div class="file-manager">
				<div class="action-bar">
					<select v-model="sortMethod" @change="handleSort">
						<option value="name">按文件名</option>
						<option value="date">按创建时间</option>
					</select>
					<button @click="saveFilelist" :disabled="!files.length">
						<i class="fas fa-save"></i> 生成filelist.txt
					</button>
				</div>

				<div class="file-list-container">
					<div
						v-draggable="[
							files,
							{
								animation: 150,
								ghostClass: 'ghost'
							}
						]"
						class="file-list"
					>
						<FileItem v-for="file in files" :key="file.name" :file="file" />
					</div>
					<div class="file-count">共 {{ files.length }} 个FLV文件</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useFileStore } from './stores/fileStore'
import FileItem from './components/FileItem.vue'
import { vDraggable } from 'vue-draggable-plus'
import { storeToRefs } from 'pinia'

const { files, isLoading, resMsg } = storeToRefs(useFileStore())
const { scanFiles, sortFiles, saveFilelist, resetResMsg } = useFileStore()
const directory = ref('')
const sortMethod = ref('name')

const openFolderDialog = async () => {
	resetResMsg()
	if (window.electronAPI) {
		const result = await window.electronAPI.openFolderDialog()
		if (result) directory.value = result
	}
}

const handleScan = async () => {
	if (!directory.value) return
	await scanFiles(directory.value)
}

const handleSort = () => {
	sortFiles(sortMethod.value)
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
.sortable-ghost {
	opacity: 0.5;
	background: #3b82f688;
	border: 3px dashed pink;
}
</style>
