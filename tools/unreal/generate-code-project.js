//
// node CI/shared/unreal/generate-code-project.js
//
// Requires the CI_UE_UPROJECT variable set with the name of the .uproject file.
// This is a multiplatform version of generate-visual-studio-project.js
//

import { execSync } from 'child_process'
import fs from 'fs'

const UPROJECT = process.argv[3] || process.env['CI_UE_UPROJECT']
const UE_HOME = process.argv[2] || process.env['CI_UE_HOME']

console.log(UE_HOME, UPROJECT)

if (!(UE_HOME && UPROJECT)) {
  console.log('Usage: node CI/shared/unreal/generate-code-project.js <UE_HOME> <.uproject>')
  process.exit(1)
}

const CODE_PROJECT = UPROJECT.replace('.uproject', process.platform == 'win32' ? '.sln' : '.xcworkspace')
console.log(`##CI_CODE_PROJECT=${CODE_PROJECT}#`)

let cmd, ubtPath
const projectRoot = process.cwd()
let uprojectPath = `${projectRoot}/${UPROJECT}`

// UE4, win
ubtPath = `${UE_HOME}/Engine/Binaries/DotNET/UnrealBuildTool.exe`

if (!fs.existsSync(ubtPath)) {
  // UE5, win
  ubtPath = `${UE_HOME}/Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool.exe`
  
  // UE4, unix
  if (!fs.existsSync(ubtPath)) {
    // UE5, unix
    ubtPath = `${UE_HOME}/Engine/Binaries/DotNET/UnrealBuildTool/UnrealBuildTool`
    
    if (!fs.existsSync(ubtPath)) {
      console.log('UnrealBuildTool not found. Unreal Engine home:', UE_HOME)
      process.exit(1)
    }
  }
}

if (process.platform == 'win32') {
  console.log('platform: ', process.platform == 'win32')
  ubtPath = ubtPath.replace(/\//g, '\\')
  uprojectPath = uprojectPath.replace(/\//g, '\\')
}

cmd = [
  ubtPath,
  '-projectfiles',
  `-project=${uprojectPath}`,
  '-game',
  '-rocket',
  '-progress'
].join(' ')

console.log(cmd)

console.log(execSync(cmd, { encoding: 'utf8' }))