import fs from 'fs'

let file = process.env['CI_UE_UPLUGIN']
let nextVersion = process.env['CI_VERSION']

let config = fs.readFileSync(file).toString()

config = config.replace(/"VersionName": ".+"/g, nextVersion)
fs.writeFileSync(file, config)

console.log('Updated', file, 'with', nextVersion)