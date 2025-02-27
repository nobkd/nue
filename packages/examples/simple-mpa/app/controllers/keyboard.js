
import { $, $$ } from '/@nue/view-transitions.js'
import { router } from '/@nue/app-router.js'

// list item query
const ITEM = '.list a'

document.addEventListener('keydown', (evt) => {
  const { target, key } = evt
  const actions = {}
  const first = $(ITEM)


  // search blur/focus
  const search = $('[type=search]')

  if (key == 'Tab') {
    if (target == search && search.value) {
      evt.preventDefault()
      first.focus()
    }
    if (evt.shiftKey && first == document.activeElement) {
      evt.preventDefault()
      search.focus()
      search.select()
    }
  }

  if (target.oninput || target.form || evt.defaultPrevented || evt.metaKey || evt.ctrlKey) return

  // escape
  if (key == 'Escape' && !$(':popover-open')) router.del('id')

  // check for accesskey element
  $$('[data-accesskey]').filter(el => !el.disabled).forEach(el => {
    if (el.dataset.accesskey == key) {
      el.focus()
      el.click()
      if (!el.href) evt.preventDefault()
    }
  })

  // next/prev seek
  if ('jk'.includes(key)) {
    const next = getNext(key == 'j')
    next?.focus()
    if (router.state.id) next?.click()
  }

})


function getNext(go_forward) {
  const active = document.activeElement
  if (!active || !active.matches(ITEM)) return $(ITEM)

  // get next focused
  const links = $$(ITEM)
  const next = links[links.indexOf(active) + (go_forward ? 1 : -1)]
  if (next) return next

  // seek to next page
  const btn = $(`[data-accesskey=${go_forward ? 'l' : 'h'}]`)

  if (!btn.disabled) {
    btn.click()
    const links = $$(ITEM)
    return links[go_forward ? 0 : links.length -1]
  }
}


