//
// Usage: node rm.js <File|Directory Path> [File|Directory Path2] ...
//

import fs from 'fs'
import rimraf from 'rimraf'

let targets = process.argv.slice(2)

for (let target of targets) {
  if (fs.existsSync(target)) {
    try {
      if (fs.lstatSync(target).isDirectory()) {
        rimraf.sync(target)
      } else {
        fs.unlinkSync(target)
      }

      console.log('Removed', target)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  } else {
    console.error(target, 'does not exist')
  }
}