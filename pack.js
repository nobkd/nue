import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const replace = ['*', 'latest']
if (process.argv[2] == 'reset') replace.reverse()

const f = join(process.cwd(), 'package.json')
const data = JSON.parse(readFileSync(f, 'utf-8'))
if (data.dependencies) Object.entries(data.dependencies).forEach(([k, v]) => {
  if (v == replace[0]) data.dependencies[k] = replace[1]
})
writeFileSync(f, JSON.stringify(data, null, 2) + '\n')
