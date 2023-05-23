//
// node CI/shared/unreal/sftp-upload.js user:password@host:port [sourcePath=remotePath] [...sourcePath=remotePath]
//
// Can be file or directory.
//

import Client from 'ftp-client'
import fs from 'fs'
import path from 'path'

const info = {
  host: process.argv[2].split('@')[1].split(':')[0],
  port: process.argv[2].split('@')[1].split(':')[1],
  user: process.argv[2].split('@')[0].split(':')[0],
  password: process.argv[2].split('@')[0].split(':')[1],
}

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

run()
