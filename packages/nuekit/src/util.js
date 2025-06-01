/* misc stuff. think shame.css */

import { execSync } from 'node:child_process'
import { promises as fs, realpathSync } from 'node:fs'
import { sep, parse, resolve, normalize, join, isAbsolute, dirname } from 'node:path'
import { styleText, inspect } from 'node:util'
import { fileURLToPath, pathToFileURL } from 'node:url'


export const srcdir = dirname(fileURLToPath(import.meta.url))

export function openUrl(url) {
  const open = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
  execSync(`${open} ${url}`)
}

export function esMain(url) {
  if (!url || !process.argv[1]) return false
  return realpathSync(fileURLToPath(url)) === realpathSync(process.argv[1])
}

// read from package.json
export const version = await async function() {
  const path = join(srcdir, '../package.json')
  const json = await fs.readFile(path, 'utf-8')
  return JSON.parse(json).version
}()

export async function importFromCWD(path) {
  const abs_path = resolve(process.cwd(), path)
  return import(pathToFileURL(abs_path).href)
}

export function getEngine() {
  const v = process.versions
  return process.isBun ? 'Bun ' + v.bun : 'Node ' + v.node
}

export function log(msg, extra = '') {
  console.log(colors.green('✓'), msg, extra)
}

log.error = function(msg, extra = "") {
  console.log(colors.red('!!'), msg, extra)
}

// console colors
export const colors = function() {
  const noColor = process.env.NO_COLOR || !(process.env.TERM || process.platform == 'win32') // can be removed when bun correctly handles this case in styleText
  const fns = {}
  for (const key in inspect.colors) {
    fns[key] = msg => noColor ? msg : styleText(key, msg)
  }
  return fns
}()

// returns { url, dir, slug, appdir }
export function parsePathParts(path) {
  path = normalize(path)
  const { dir, name, base } = parse(path)
  const basedir = getAppDir(path)
  const url = getUrl(dir, name)
  return { filepath: path, url, dir, slug: name + '.html', basedir }
}

export function joinRootPath(root, path, abs = false) {
  return join(abs ? process.cwd() : '', isAbsolute(path) ? '' : root, path)
}

export function getAppDir(path) {
  path = normalize(path)
  const [appdir] = path.split(sep)
  return appdir == path ? '' : appdir
}

// traverseDirsUp('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function traverseDirsUp(dir) {
  if (!dir) return []
  dir = normalize(dir)
  const els = dir.split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join(sep))
}

export function getUrl(dir, name) {
  let url = toPosix(dir) + '/'
  if (url[0] != '/') url = '/' + url
  if (name != 'index') url += name + '.html'
  return url
}

export function toPosix(path) {
  return path.replaceAll('\\', '/')
}

export function extendData(to, from = {}) {
  const include = addUnique(to.include, from.include)
  const exclude = addUnique(to.exclude, from.exclude)
  Object.assign(to, from)
  to.include = include
  to.exclude = exclude
}


function addUnique(to = [], from = []) {
  if (to.length) to = [...to]

  for (const el of from) {
    if (!to.includes(el)) to.push(el)
  }

  return to
}


export function sortCSS({ paths, globals, dir }) {
  function score(path) {
    if (path[0] == '/') path = path.slice(1)
    const appdir = getAppDir(path)
    const els = path.split(sep)
    return globals.includes(appdir) ? 0 : dir == appdir ? (els[2] ? 3 : 2) : 1
  }

  // alphabetical first
  paths.sort()

  // then by directory
  paths.sort((a, b) => score(a) - score(b))
}
