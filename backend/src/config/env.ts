import fs from 'fs'
import path from 'path'

// The source pre-modifications: https://github.com/facebook/create-react-app/blob/33f1294f07a884ca2628fb6d8dc648bd18b25fbe/packages/react-scripts/config/env.js#L25-L49
const dotEnvPath = path.resolve(__dirname, '../../.env')
const NODE_ENV = process.env.NODE_ENV || 'development'

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${dotEnvPath}.${NODE_ENV}.local`,
  `${dotEnvPath}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotEnvPath}.local`,
  dotEnvPath,
].filter(Boolean) as string[]

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    )
  }
})
