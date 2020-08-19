// Module imports
import fs from 'fs-extra'
import path from 'path'





export function generateHTML (options = {}) {
	const {
		minify = false,
		target = '{bundle}.html',
		template,
	} = options

	let templatePath = null

	if (template) {
		templatePath = path.resolve(process.cwd(), template)
	}

  return {
		name: 'generateHTML',

		buildStart () {
			this.addWatchFile(templatePath)
		},

    async generateBundle (options, bundle) {
			if (!template) {
				throw new Error('You did not provide a template!')
			}

			let templateFile = await fs.readFile(templatePath, 'utf8')
			let scripts = ''

			const files = {}

			Object.entries(bundle).map(([filename, bundleStuffs]) => {
				const {
					code,
					source,
				} = bundleStuffs
				const bundleExtension = path.extname(filename)
				const filenameWithoutExtension = filename.replace(bundleExtension, '')

				// console.log(bundleStuffs)

				if (!files[filenameWithoutExtension]) {
					files[filenameWithoutExtension] = ''
				}

				let startTag = '<script defer>'
				let endTag = '</script>'

				if (bundleExtension === '.css') {
					startTag = '<style type="text/css">'
					endTag = '</style>'
				}

				if (minify) {
					files[filenameWithoutExtension] += `${startTag}${code || source.toString()}${endTag}`.replace(/\n^/m, '')
				} else {
					files[filenameWithoutExtension] += `
						${startTag}
							${code || source.toString()}
						${endTag}
					`
				}
			})

			Object.entries(files).forEach(([filename, fileAppends]) => {
				let targetFilename = target

				if (/{bundle}/g.test(targetFilename)) {
					targetFilename = targetFilename.replace(/{bundle}/g, filename)
				}

				this.emitFile({
					type: 'asset',
					fileName: targetFilename,
					source: templateFile + fileAppends,
				})
			})
    },
  }
}
