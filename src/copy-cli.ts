import { copy, IOptions } from './copy'

const args = process.argv.splice(2)

const options: IOptions = {
  cwd: process.cwd(),
  overwrite: false
}
let pattern: string = ''
let destination: string = ''

for (let i = 0; i < args.length; i++) {
  const arg = args[i]

  if (arg === '--overwrite') {
    options.overwrite = true
  } else if (arg === '--cwd' && args.length >= i) {
    options.cwd = args[i + 1]
  }

  if (args.length - i === 2) {
    pattern = arg
  } else if (args.length - i === 1) {
    destination = arg
  }
}

console.log(options)
console.log(`Pattern: ${pattern}, destination: ${destination}`)
