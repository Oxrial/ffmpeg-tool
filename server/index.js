import express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

let fileList = []
let currentDirectory = ''

app.post('/scan', async (req, res) => {
	const directory = req.body.directory
	if (!directory) return res.redirect('/?message=请选择目录')

	try {
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
		res.json({ success: 'success', files: fileList })
	} catch (err) {
		res.status(500).json({ success: 'error', error: err.message })
	}
})

app.post('/sort', (req, res) => {
	const { sortBy } = req.body

	if (sortBy === 'name') {
		fileList.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortBy === 'date') {
		fileList.sort((a, b) => a.ctime - b.ctime)
	}

	res.json({ success: 'success', files: fileList })
})

app.post('/confirm', async (req, res) => {
	const list = req.body.list
	try {
		const content = list.map((file) => `file '${file.path}'`).join('\n')
		await fs.writeFile(path.join(currentDirectory, 'filelist.txt'), content)
		res.json({ success: 'success', count: list.length })
	} catch (err) {
		res.status(500).json({ success: 'error', error: err.message })
	}
})

const PORT = 38093
app.listen(PORT, () => {
	console.log(`API服务器运行在 http://localhost:${PORT}`)
})
