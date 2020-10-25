const globby = require('globby')

const search = async () => {
  const files = await globby('../**/package.json', {ignore: 'node_modules/**/*'})
  return files.filter((file) => !/node_modules/.test(file))
}

search().then(console.log).catch(console.error)
