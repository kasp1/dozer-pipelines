//
// node CI/shared/tools/find-file-in-folder.js <folder-path> <file-regex> <env-variable>
//
// Exits with code 1 if no file is found. <env-variable> is the environment variable to
// set the found file to, if found. Only the first found file is set to the variable.
// This script is designed for finding unique project files.
//
// Example:
// node CI/shared/tools/find-file-in-folder.js . "\.uproject$" CI_UE_UPROJECT
//

import fs from 'fs'

const folder = process.argv[2]
const variable = process.argv[4]
let pattern = process.argv[3]
pattern = new RegExp(pattern, 'gm')

async function main() {
  console.log('Looking for file...')

  let file = findFile(pattern)

  if (file) {
    console.log(`##${variable}=${file}#`)
  } else {
    console.log('No file found.')
    process.exit(1)
  }
}

main()

function findFile(pattern) {
  let found

  fs.readdirSync(folder).forEach(file => {
    if (file.match(pattern)) {
      console.log('Found', file)
      found = file
    }
  })

  return found
}