import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios'
export const useFileStore = defineStore('files', () => {
	const files = ref([])
	const currentDir = ref('')
	const isLoading = ref(false)
	const resMsg = ref({ success: '', message: '^_^' })
	const resetResMsg = () => {
		resMsg.value = { success: '', message: '^_^' }
	}
	const scanFiles = async (directory) => {
		try {
			isLoading.value = true
			const res = await axios.post(
				import.meta.env.VITE_API_URL + '/scan',
				{ directory },
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
			files.value = res.data.files
			currentDir.value = directory
			resMsg.value = { ...res.data, message: `找到 ${res.data.files.length} 个FLV文件` }
		} catch (error) {
			const { data } = error.response
			resMsg.value = { ...data, message: data?.error || error.message }
		} finally {
			isLoading.value = false
		}
	}

	const sortFiles = async (sortBy) => {
		const { data } = await axios.post(import.meta.env.VITE_API_URL + '/sort', { sortBy })
		files.value = data.files
	}

	const saveFilelist = async () => {
		try {
			isLoading.value = true
			const { data } = await axios.post(
				import.meta.env.VITE_API_URL + '/confirm',
				{ list: files.value },
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
			resMsg.value = { ...data, message: `成功生成 ${currentDir.value} => filelist.txt (${data.count}个文件)` }
		} catch (error) {
			const { data } = error.response
			resMsg.value = { ...data, message: data?.error || error.message }
		} finally {
			isLoading.value = false
		}
	}

	return { files, currentDir, isLoading, resMsg, scanFiles, sortFiles, saveFilelist, resetResMsg }
})
