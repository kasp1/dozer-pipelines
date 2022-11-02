//
// node CI/shared/tools/replace-known-vars-in-file.js <file> [new file]
//
// Walks through a file and replaces all ${ENVIRONMENT_VARIABLE_NAME} strings with corresponding variable values.
//

import fs from 'fs'

const file = process.argv[2]

if (!fs.existsSync(file)) {
  console.error('The specified file', file, 'does not exist, or is not readable by this process.')
  process.exit(1)
}

console.log('Replacing variables with values in', file)

let contents = fs.readFileSync(file, { encoding: 'utf8' } )

let pattern
for (let key in process.env) {
  pattern = new RegExp('\\$\\{' + key + '\\}', 'gm')
  contents = contents.replace(pattern, process.env[key])
}

if (process.argv[3]) {
  fs.writeFileSync(process.argv[3], contents)
} else {
  fs.writeFileSync(file, contents)
}

console.log('Done.')
