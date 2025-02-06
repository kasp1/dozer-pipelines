//
// node CI/shared/tools/set.js <variable-name> <variable-value>
//
// or
//
// import setEnvVariable from './CI/shared/tools/set.js'
// setEnvVariable('VariableName', 'VariableValue')
//
// Universal multiplatform way to set environment variables within Dozer,
// GitHub Actions, and GitLab CI.
//

import { execSync } from 'child_process'

export default function setEnvVariable(variable, value) {
  // GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    try {
      console.log(`Adding "${variable}=${value}" to $GITHUB_ENV`)
      execSync(`echo "${variable}=${value}" >> $GITHUB_ENV`, { shell: 'pwsh' })
    } catch (e) {
      console.log(`Error setting the ${variable} variable in GitLab CI: ${e.message}`)
    }
  }

  // GitLab CI
  else if (process.env.GITLAB_CI) {
    try {
      console.log(`Adding "${variable}=${value}" to $GITLAB_ENV`)
      execSync(`echo "${variable}=${value}" >> $GITLAB_ENV`, { shell: 'pwsh' })
    } catch (e) {
      console.log(`Error setting the ${variable} variable in GitLab CI: ${e.message}`)
    }
  }

  // Dozer
  else {
    console.log(`##${variable}=${value}#`)
  }
}

async function main() {
  const variable = process.argv[2]
  const value = process.argv[3]

  if (!variable || !value) {
    console.error('Usage: node CI/shared/tools/set.js <variable-name> <variable-value>')
    process.exit(1)
  }

  setEnvVariable(variable, value)
  process.exit(0)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}