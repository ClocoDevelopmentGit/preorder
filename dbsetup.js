#!/usr/bin/env node

import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

const env = { ...process.env }

// Prepare database path and Litestream
const target = '/data/dev.sqlite'
const hasDataDir = fs.existsSync('/data')

if (hasDataDir && !fs.existsSync(target) && process.env.BUCKET_NAME) {
  console.log('Restoring database from Litestream...')
  try {
    await exec(`npx litestream restore -config litestream.yml -if-replica-exists ${target}`)
  } catch (e) {
    console.error('Litestream restore failed, starting with fresh database', e)
  }
}

// prepare database
console.log('Running prisma migrations...')
await exec('npx prisma migrate deploy')

// launch application
if (process.env.BUCKET_NAME) {
  console.log('Starting application with Litestream replication...')
  await exec(`npx litestream replicate -config litestream.yml -exec ${JSON.stringify(process.argv.slice(2).join(' '))}`)
} else {
  console.log('Starting application...')
  await exec(process.argv.slice(2).join(' '))
}

function exec(command) {
  const child = spawn(command, { shell: true, stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} failed rc=${code}`))
      }
    })
  })
}
