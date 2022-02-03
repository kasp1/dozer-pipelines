import fs from 'fs'

let file = 'Config/DefaultEngine.ini'
let releaseId = process.env['CI_RELEASE_ID']

if (!releaseId) {
  releaseId = Math.floor(Date.now() / 1000 / 60)
}

let config = fs.readFileSync(file).toString()

config = config.replace(/StoreVersion=\d+/g, 'StoreVersion=' + releaseId)
fs.writeFileSync(file, config)

console.log('Updated StoreVersion in', file, 'with', releaseId)