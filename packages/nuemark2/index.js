
import { parseDocument } from './src/document.js'
import { renderLines } from './src/render-blocks.js'

const EOL = /\r\n|\r|\n/


export function nuemark(str, opts) {
  return renderLines(str.split(EOL), opts)
}

export function nuedoc(str) {
  return parseDocument(str.split(EOL))
}

/* utilities */
export { elem } from './src/document.js'
export { renderInline } from './src/render-inline.js'
export { parseSize } from './src/render-tag.js'
