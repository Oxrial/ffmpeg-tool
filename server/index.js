const express = require('express')
const path = require('path')
const fs = require('fs').promises
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

let fileList = []
let currentDirectory = ''

app.post('/scan', async (req, res) => {
	try {
		const directory = req.body.directory
		await fs.access(directory)

		const files = await fs.readdir(directory)
		fileList = files
			.filter((file) => path.extname(file).toLowerCase() === '.flv')
			.map((file) => ({
				name: file,
				path: path.join(directory, file).replace(/\\/g, '/'),
				ctime: Date.now()
			}))

		currentDirectory = directory
		res.json({ success: true, files: fileList })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

app.post('/sort', (req, res) => {
	const { sortBy } = req.body

	if (sortBy === 'name') {
		fileList.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortBy === 'date') {
		fileList.sort((a, b) => a.ctime - b.ctime)
	}

	res.json({ success: true, files: fileList })
})

app.post('/confirm', async (req, res) => {
	try {
		const content = fileList.map((file) => `file '${file.path}'`).join('\n')
		await fs.writeFile(path.join(currentDirectory, 'filelist.txt'), content)
		res.json({ success: true, count: fileList.length })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`API服务器运行在 http://localhost:${PORT}`)
})
