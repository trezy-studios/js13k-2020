const archiver = require('archiver')
const fs = require('fs-extra')
const path = require('path');

(async function archive() {
	// Delete superfluous files
	const distPath = path.resolve('dist')
	const distFiles = await fs.readdir(distPath)

	await Promise.all(distFiles.map(filename => {
		if (['.css', '.js'].includes(path.extname(filename))) {
			return fs.unlink(path.resolve(distPath, filename))
		}
	}))

	// Start streaming to the zip file
	const output = fs.createWriteStream('./build.zip')
	const archive = archiver('zip', {
		zlib: { level: 9 } // set compression to best
	})

	const MAX = 13 * 1024 // 13kb

	// Alert if the output is too large
	output.on('close', function () {
		const bytes = archive.pointer()
		const percent = (bytes / MAX * 100).toFixed(2)
		if (bytes > MAX) {
			console.error(`Size overflow: ${bytes} bytes (${percent}%)`)
		} else {
			console.log(`Size: ${bytes} bytes (${percent}%)`)
		}
	})

	// Handle warnings
	archive.on('warning', function (err) {
		if (err.code === 'ENOENT') {
			console.warn(err)
		} else {
			throw err
		}
	})

	// Handle errors
	archive.on('error', function (err) {
		throw err
	})

	// Point Archiver to our zip file
	archive.pipe(output)

	// Start zipping the output
	archive.directory("./dist", false)

	archive.finalize()
})()
