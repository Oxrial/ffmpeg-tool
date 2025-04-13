import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useFileStore = defineStore('files', () => {
	const files = ref([])
	const currentDir = ref('')
	const isLoading = ref(false)
	const message = ref('')

	const scanFiles = async (directory) => {
		try {
			isLoading.value = true
			const { data } = await axios.post('http://localhost:3001/scan', { directory })
			files.value = data.files
			currentDir.value = directory
			message.value = `找到 ${data.files.length} 个FLV文件`
		} catch (error) {
			message.value = error.response?.data?.error || error.message
		} finally {
			isLoading.value = false
		}
	}

	const sortFiles = async (sortBy) => {
		const { data } = await axios.post('http://localhost:3001/sort', { sortBy })
		files.value = data.files
	}

	const saveFilelist = async () => {
		try {
			isLoading.value = true
			const { data } = await axios.post('http://localhost:3001/confirm')
			message.value = `成功生成 filelist.txt (${data.count}个文件)`
		} catch (error) {
			message.value = error.response?.data?.error || error.message
		} finally {
			isLoading.value = false
		}
	}

	return { files, currentDir, isLoading, message, scanFiles, sortFiles, saveFilelist }
})
