import { execSync } from 'child_process'

console.log('Getting the 2FA code...')

const STEAMGUARD = process.env['CI_STEAMGUARD_CLI']
const SDA = process.env['CI_STEAM_SDA_DIR']

let code = execSync(`${STEAMGUARD} -m ${SDA}`, { encoding: 'utf8' })
code = code.trim()

console.log(`##CI_STEAM_2FA_CODE=${code}#`)