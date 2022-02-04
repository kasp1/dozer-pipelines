//
// node CI/shared/tools/replace-in-file.js <file> <pattern> <replacement>
//
// Replaces one or multiple occurences of a pattern in a file.
//
// Example, will replace all ProjectVersion=* lines with ProjectVersion=1.0.0
// node CI/shared/tools/replace-in-file.js Config/DefaultGame.ini "^\W*ProjectVersion=.+$" "ProjectVersion=1.0.0"
//
// The replacement can contain an environment variable, example:
// node CI/shared/tools/replace-in-file.js Config/DefaultGame.ini "^\W*ProjectVersion=.+$" "ProjectVersion=###CI_VERSION###"
//

import fs from 'fs'

const file = process.argv[2]
let pattern = process.argv[3]
let replacement = process.argv[4]

if (!fs.existsSync(file)) {
  console.error('The specified file', file, 'does not exist, or is not readable by this process.')
  process.exit(1)
}

if (replacement.includes('###')) {
  for (let key in process.env) {
    let variable = `###${key}###`

    if (replacement.includes(variable)) {
      replacement = replacement.replace(variable, process.env[key])
    }
  }
}

console.log(replacement)

pattern = new RegExp(pattern, 'gm')

let contents = fs.readFileSync(file, { encoding: 'utf8' } )
contents = contents.replace(pattern, replacement)
fs.writeFileSync(file, contents)

console.log('Updated', file, 'with', replacement)
