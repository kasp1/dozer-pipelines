import fs from 'fs'
import google from 'googleapis'

let version = process.env['CI_VERSION'] || '1.0.0'

const SERVICE_KEY = process.env['CI_SERVICE_KEY']
const PACKAGE_NAME = process.env['CI_PACKAGE_NAME']
const PACKAGE_BUNDLE = process.env['CI_PACKAGE_BUNDLE']
const PACKAGE_EXPANSIONS_DIR = process.env['CI_PACKAGE_EXPANSIONS_DIR']
const TRACK = process.env['CI_DEFAULT_GOOGLEPLAY_TRACK']


async function main () {
  console.log('Authenticating with Google APIs...')

  const auth = new google.Auth.GoogleAuth({
    keyFile: SERVICE_KEY,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  })

  const authClient = await auth.getClient()

  const client = new google.androidpublisher_v3.Androidpublisher({
    auth: authClient
  })

  console.log('Creating a new app edit...')

  let editInsertResponse = await client.edits.insert({
    packageName: PACKAGE_NAME
  })

  const editId = editInsertResponse.data.id

  console.log('Created a new edit with ID', editId)

  console.log('Uploading app bundle...', PACKAGE_BUNDLE)

  await client.edits.bundles.upload({
    editId: editId,
    packageName: PACKAGE_NAME,
    media: {
      body: PACKAGE_BUNDLE,
      mimeType: 'application/octet-stream'
    }
  })

  console.log('Looking for expansion files...', PACKAGE_EXPANSIONS_DIR)

  fs.readdirSync(PACKAGE_EXPANSIONS_DIR).forEach(file => {

    if (file.match(/\.obb$/)) {
      console.log('Uploading expansion file...', file)

      await client.edits.expansionfiles.upload({
        editId: editId,
        packageName: PACKAGE_NAME,
        media: {
          body: PACKAGE_EXPANSIONS_DIR + '/' + file,
          mimeType: 'application/octet-stream'
        }
      })
    }
  })

  console.log('Publishing the edit on Internal track...')

  await client.edits.tracks.update({
    editId: editId,
    track: TRACK,
    packageName: PACKAGE_NAME,
    requestBody: {
      releases: [{
        name: 'Build ' + version + '-' + versionCode,
        versionCodes: [ versionCode ],
        status: 'completed'
      }]
    }
  })

  console.log('Commiting the edit...')

  await client.edits.commit({
    editId: editId,
    packageName: PACKAGE_NAME,
  })

  console.log('Done.')
}

try {
  main()
} catch (e) {
  console.log(e)
}