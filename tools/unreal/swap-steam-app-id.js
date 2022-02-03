//
// node CI/shared/unreal/swap-steam-app-id.js
//
// Replaces the development Steam App ID with the production Steam App ID listed in the VDF file.
//

import fs from 'fs'

let vdf = process.env['CI_STEAM_VDF']
let configFile = 'Config/DefaultEngine.ini'

// extract app ID from the VDF file
vdf = fs.readFileSync(vdf, { encoding: 'utf8' })
vdf = vdf.split('\n')

let appId

for (let row of vdf) {
  if (row.includes('appid')) {
    appId = row
  }
}

appId = appId.replace(/[^\d]/g, '')

// put app ID into the UE config
let config = fs.readFileSync(configFile, { encoding: 'utf8' })
config = config.replace('SteamDevAppId=480', `SteamDevAppId=${appId}`)
config = config.replace('SteamAppId=480', `SteamAppId=${appId}`)

fs.writeFileSync(configFile, config)