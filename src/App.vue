<template>
	<div class="app-container">
		<header>
			<h1><i class="fas fa-video"></i> FLV文件合并工具</h1>
			<div v-if="message" class="message">{{ message }}</div>
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

			<div v-if="files.length > 0" class="file-manager">
				<div class="action-bar">
					<select v-model="sortMethod" @change="handleSort">
						<option value="name">按文件名</option>
						<option value="date">按创建时间</option>
					</select>
					<button @click="saveFilelist" :disabled="isLoading">
						<i class="fas fa-save"></i> 生成filelist.txt
					</button>
				</div>

				<div class="file-list-container">
					<div ref="fileList" class="file-list">
						<FileItem v-for="file in files" :key="file.name" :file="file" />
					</div>
					<div class="file-count">共 {{ files.length }} 个FLV文件</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useFileStore } from './stores/fileStore'
import FileItem from './components/FileItem.vue'
import Sortable from 'sortablejs'

const fileStore = useFileStore()
const { files, currentDir, isLoading, message, scanFiles, sortFiles, saveFilelist } = fileStore

const directory = ref('')
const sortMethod = ref('name')
const fileList = ref(null)

const openFolderDialog = async () => {
	if (window.electronAPI) {
		const result = await window.electronAPI.openFolderDialog()
		if (result) directory.value = result
	}
}

const handleScan = async () => {
	if (!directory.value) return
	await scanFiles(directory.value)
	if (files.value.length > 0) {
		initSortable()
	}
}

const handleSort = () => {
	sortFiles(sortMethod.value)
}

const initSortable = () => {
	nextTick(() => {
		new Sortable(fileList.value, {
			animation: 150,
			handle: '.drag-handle',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			onEnd: () => {
				const newOrder = Array.from(fileList.value.children)
					.map((el) => files.value.find((f) => f.name === el.dataset.id))
					.filter(Boolean)
				files.value = newOrder
			}
		})
	})
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>
