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
    continue
  } else if (arg === '--cwd' && args.length >= i) {
    options.cwd = args[i + 1]
    continue
  }

  if (args.length - i === 2) {
    pattern = arg
  } else if (args.length - i === 1) {
    destination = arg
  }
}

console.log(options)
console.log(`Pattern: ${pattern}, destination: ${destination}`)

if (!pattern) {
  console.error('You have to define a pattern')
  process.exit(1)
} else if (!destination) {
  console.error('You have to define a destination')
  process.exit(2)
}

copy(pattern, destination, options).then(console.log).catch(console.error)
