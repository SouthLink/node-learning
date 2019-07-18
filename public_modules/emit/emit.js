const fs = require('fs')
const events = require('events')

class Watcher extends events.EventEmitter {
	constructor(watchDir, processedDir) {
		super()
		this.watchDir = watchDir
		this.processedDir = processedDir
		this.init()
	}

	init() {
		console.log(this.watchDir)
		console.log(this.processedDir)
	}

	watch() {
		fs.readdir(this.watchDir, (err, files) => {
			if (err) throw err
			for (let x in files) {
				this.emit('process', files[x])
			}
		})
	}

	start() {
		fs.watchFile(this.watchDir, () => {
			this.watch()
		})
	}
}

const watcher = new Watcher(watchDir, processedDir)

watcher.on('process', (file) => {
	const watchFile = `${watchDir}/${file}`
	const processedFile = `${processedDir}/${file.toLowerCase()}`

	fs.rename(watchFile, processedFile, err => {
		if (err) throw err
	})
})