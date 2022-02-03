import fs from 'fs'


async function main() {
  console.log('Looking for a .uproject file...')

  let uproject = findFile(/\.uproject$/)

  if (uproject) {
    console.log(`##CI_UE_UPROJECT=${uproject}#`)
  } else {
    console.log('It seems like no uproject file has been found in this directory. Is this script run from an Unreal Engine project\'s root directory?')
    process.exit(1)
  }
}

main()

function findFile(pattern) {
  let found

  fs.readdirSync('.').forEach(file => {
    if (file.match(pattern)) {
      console.log('Found', file)
      found = file
    }
  })

  return found
}