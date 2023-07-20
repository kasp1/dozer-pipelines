//
// node CI/shared/unreal/sftp-upload.js user:password@host:port [sourcePath=remotePath] [...sourcePath=remotePath]
//
// Can be file or directory.
//
// Escape @ with %40
// Escape : with %3A
//

import Client from 'ftp-client'
import fs from 'fs'
import path from 'path'

const info = {
  host: unescape(process.argv[2].split('@')[1].split(':')[0]),
  port: unescape(process.argv[2].split('@')[1].split(':')[1]),
  user: unescape(process.argv[2].split('@')[0].split(':')[0]),
  password: unescape(process.argv[2].split('@')[0].split(':')[1]),
}

console.log(info)

async function run() {
  const ftp = new Client(info)

  ftp.connect(function () {
    const pairs = process.argv.slice(3)
  
    for (let pair of pairs) {
      pair = pair.split('=')
    
      if (fs.existsSync(pair[0])) {

        const base = path.dirname(pair[0])

        if (fs.lstatSync(base).isDirectory()) {
          console.log(`Uploading ${pair[0]}/** to ${pair[1]}`)

          ftp.upload(`${pair[0]}/**`, pair[1], {
            baseDir: pair[0],
            overwrite: 'all'
          }, (result) => console.log(result))
        } else {
          console.log(`Uploading ${pair[0]} to ${pair[1]}`)

          ftp.upload(pair[0], pair[1], {
            baseDir: base,
            overwrite: 'all'
          }, (result) => console.log(result))
        }
      } else {
        console.error(`${pair[0]} doesn't seem to exist.`)
      }
    }
  })
}

function unescape(str) {
  str = str.replace(/%40/g, '@')
  str = str.replace(/%3A/g, ':')
  return str
}

run()
