const fs = require('fs')
const path = require('path')
const glob = require("glob")
const YAML = require('yaml')


const options = {
  workspace: 'swagger',
  general: 'index.yaml',
  paths: 'paths',
  components: 'components',
  target: 'result.yaml'
}

exports.init = async function (workspace = options.workspace, general = options.general, paths = options.paths, components = options.components) {
  if (!fs.existsSync(workspace)) await fs.mkdirSync(workspace)
  if (!fs.existsSync(path.join(workspace, general))) await fs.writeFileSync(path.join(workspace, general), '')
  if (!fs.existsSync(path.join(workspace, components))) await fs.mkdirSync(path.join(workspace, components))
  if (!fs.existsSync(path.join(workspace, paths))) await fs.mkdirSync(path.join(workspace, paths))
}


exports.compile = async function (workspace = options.workspace, general = options.general, paths = options.paths, components = options.components, target = options.target) {
  general = path.join(workspace, general)
  paths = path.join(workspace, paths)
  components = path.join(workspace, components)
  target = path.join(workspace, target)
  if (!fs.existsSync(general)) {
    console.error('Not exist', general)
    return
  }

  let generalFile = fs.readFileSync(general)
  if (fs.existsSync(target)) fs.unlinkSync(target)
  await fs.writeFileSync(target, generalFile + '\r\n')

  let pathsBlock = await organizePaths(paths)
  await fs.appendFileSync(target, YAML.stringify(pathsBlock), function () {})

  let componentsBlock = organizeComponents(components)
  await fs.appendFileSync(target, YAML.stringify(componentsBlock), function () {})
}


function globAsync(paths) {
  return new Promise((resolve, reject) => {
    glob(paths  + '/**/*', function(error, files) {
      if (error) return reject(error)
      resolve(files)
    })
  })  
}


async function organizePaths(paths) {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(paths)) {
      console.error('Definitios directory not found - ', paths)
      return reject('Definitios directory not found')
    }

    let block = { paths: {} }
    const files = await globAsync(paths)
    let loopStep = 0

    async function loop() {
      let filename = path.resolve(__dirname, files[loopStep])
      let stat = fs.statSync(filename)
      if (stat.isFile()) {
        let copied = fs.readFileSync(filename, 'utf8')
        let name = filename.replace(path.resolve(__dirname, paths), '')
        block.paths[name.replace('.yaml', '').replace(/\\/g, '/')] = YAML.parse(copied)
      }
      loopStep++
      if (loopStep < files.length) return loop()
      resolve(block)
    }
    loop()
  })

}


function organizeComponents(components) {
  if (!fs.existsSync(components)) {
    console.error('Definitios directory not found - ', components)
    return
  }

  let block = { components: { schemas: {} } }
  let files = fs.readdirSync(components)
  files.forEach(file => {
    let filename = path.resolve(__dirname, components, file)
    let copied = fs.readFileSync(filename, 'utf8')
    block.components.schemas[file.replace('.yaml', '')] = YAML.parse(copied)
  })
  return block
}
