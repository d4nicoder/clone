import globby from 'globby'
import path from 'path'
import fs from 'fs'

export type IOptions = {
  cwd: string
  overwrite: boolean
}

const defaultOptions: IOptions = {
  cwd: process.cwd(),
  overwrite: true
}

const copyFile = async (source: string, destination: string, options: IOptions): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    // Check destination folder
    const relative = path.relative(options.cwd, source)
    const destinationFolder = path.resolve(path.join(destination, relative))

    console.log(`Copying ${source} to ${destinationFolder}`);
    let createFolder = false
    try {
      await fs.promises.stat(path.dirname(destinationFolder))
    } catch (e) {
      if (e.code === 'ENOENT') {
        createFolder = true
      } else {
        reject(e)
        return
      }
    }

    if (createFolder) {
      try {
        await fs.promises.mkdir(path.dirname(destinationFolder), {recursive: true})
      } catch (e) {
        reject(e)
        return
      }
    }

    const readStream = fs.createReadStream(source)
    const writeStream = fs.createWriteStream(destinationFolder)

    readStream.pipe(writeStream)

    writeStream.on('finish', () => {
      console.log('Copied')
      resolve()
    })
    writeStream.on('error', (err) => {
      reject(err)
    })
    readStream.on('error', (err) => {
      reject(err)
    })
  })
}

export const copy = async (pattern: string, destination: string, options?: IOptions): Promise<string[]> => {

  const opts: IOptions = (options) ? {...defaultOptions, ...options} : defaultOptions

  opts.cwd = path.resolve(opts.cwd)

  let files
  try {
    files = await globby(pattern, {cwd: opts.cwd})
  } catch (e) {
    throw e
  }

  console.log(`Files: ${files.length}`)
  
  // Converting to an absolute path
  files = files.map((f) => path.resolve(f))
  files.reduce((acum: any, file) => {
    console.log(file)
  }, [])

  const copied: string[] = []

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await copyFile(files[i], destination, opts)
      copied.push(result)
    } catch (e) {
      console.error(e)
    }
  }

  return copied
}


