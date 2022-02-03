//
// node CI/shared/generate-release-number.js
//
// Generates a release number.
//

let releaseId = Math.floor(Date.now() / 1000 / 60) // minutes from 1970

console.log(`##CI_RELEASE_ID=${releaseId}#`)