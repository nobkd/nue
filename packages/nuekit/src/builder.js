/* Builders for CSS, JS, and TS */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { resolve } from 'import-meta-resolve'

let jsBuilder
let cssBuilder

export async function getJsBuilder(is_esbuild) {
  if (!typeof jest && jsBuilder) return jsBuilder

  try {
    jsBuilder = is_esbuild ? await import(resolve('esbuild', `file://${process.cwd()}/`)) : Bun
    return jsBuilder
  } catch {
    throw 'JS bundler not found. Please use Bun or install esbuild'
  }
}

export async function getCssBuilder(is_lcss) {
  if (!typeof jest && cssBuilder) return cssBuilder

  try {
    cssBuilder = is_lcss ? await import(resolve('lightningcss', `file://${process.cwd()}/`)) : Bun
    return cssBuilder
  } catch {
    throw 'CSS bundler not found. Please use Bun>=1.1.30 or install lightningcss'
  }
}

export async function buildJS(args) {
  const { outdir, toname, minify, bundle } = args
  const is_esbuild = args.esbuild || !process.isBun
  const builder = await getJsBuilder(is_esbuild)
  let ret

  const opts = {
    external: bundle ? ['../@nue/*', '/@nue/*'] : is_esbuild ? undefined : ['*'],
    entryPoints: [args.path],
    format: 'esm',
    outdir,
    bundle,
    minify,
  }

  if (args.silent) opts.logLevel = 'silent'

  if (toname) {
    if (is_esbuild) {
      delete opts.outdir
      opts.outfile = join(outdir, toname)
    } else {
      opts.naming = toname
    }
  }

  try {
    ret = await builder.build(opts)

  } catch (e) { ret = e }

  // console.info(ret)
  const error = parseError(ret)
  if (error) throw error
}

export function parseError(buildResult) {
  const { logs = [], errors = [] } = buildResult
  let error

  // Bun
  if (logs.length) {
    const [err] = logs
    error = { text: err.message, ...err.position }
  }

  // esbuild
  if (errors.length) {
    const [err] = errors
    error = { text: err.text, ...err.location }
  }

  if (error) {
    error.title = error.text.includes('resolve') ? 'Import error' : 'Syntax error'
    delete error.file
    return error
  }

}

export async function lightningCSS(filename, minify, opts = {}) {
  const is_lcss = opts.lcss || !process.isBun
  let builder = await getCssBuilder(is_lcss)

  let include
  if (is_lcss) {
    include = builder.Features.Colors
    if (opts.native_css_nesting) include |= builder.Features.Nesting
  }

  try {
    if (is_lcss) {
      return (await builder.bundleAsync({ filename, include, minify })).code?.toString()
    } else {
      const result = (await builder.build({ entrypoints: [filename], minify, experimentalCss: true }))

      if (!result?.success) {
        const log = result?.logs[0]
        throw { fileName: filename, loc: log?.position, data: { text: log?.message } }
      }

      return await result?.outputs[0]?.text()
    }
  } catch ({ fileName, loc, data }) {
    throw {
      title: 'CSS syntax error',
      lineText: loc.lineText || (await fs.readFile(fileName, 'utf-8')).split(/\r\n|\r|\n/)[loc.line - 1],
      text: data.type,
      ...loc
    }
  }
}
