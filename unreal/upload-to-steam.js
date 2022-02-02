import { spawn } from 'child_process'

let code = process.env['CI_STEAM_2FA_CODE']
let login = process.env['CI_STEAM_LOGIN']
let password = process.env['CI_STEAM_PASSWORD']
let vdf = process.env['CI_STEAM_VDF']
let builderDir = process.env['CI_STEAM_BUILDER_DIR']

let executable = '.\\steamcmd.exe'
let args = [
  '+login', 
  login,
  password,
  '+run_app_build',
  vdf,
  '+quit',
]

console.log(executable, args.join(' '))

let cmd = spawn(executable, args, { cwd: builderDir })

cmd.stdout.on('data', (data) => console.log('stdout: ' + data.toString()) )
cmd.stderr.on('data', (data) => console.log('stderr: ' + data.toString()) )

setTimeout(() => {
  console.log('Piping the code in...', code)
  cmd.stdin.write(`${code}\n`)
}, 5000)