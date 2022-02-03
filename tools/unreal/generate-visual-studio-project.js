//
// node CI/shared/unreal/generate-sln.js
//
// Requires the CI_UE_UPROJECT variable set with the name of the .uproject file.
//

import { execSync } from 'child_process'

const UPROJECT = process.env['CI_UE_UPROJECT']
const SLN = UPROJECT.replace('.uproject', '.sln')
console.log(`##CI_UE_SLN=${SLN}#`)

let cmd
let projectRoot = process.cwd()

if (process.platform == 'win32') {
  cmd = [
    '..\\UE4\\Engine\\Binaries\\DotNET\\UnrealBuildTool.exe',
    '-projectfiles',
    `-project=${projectRoot}/${UPROJECT}`,
    '-game',
    '-rocket',
    '-progress'
  ].join(' ')
} else {
  cmd = [
    '../UE4/Engine/Binaries/DotNET/UnrealBuildTool.exe',
    '-projectfiles',
    `-project=${projectRoot}/${UPROJECT}`,
    '-game',
    '-rocket',
    '-progress'
  ].join(' ')
}

console.log(cmd)

console.log(execSync(cmd, { encoding: 'utf8' }))