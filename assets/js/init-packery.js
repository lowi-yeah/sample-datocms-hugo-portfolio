import _                from 'lodash'
import Packery          from 'packery'
import imagesLoaded     from 'imagesloaded'
import lazyScroll       from 'scroll-lazy'
import textToDomElement from './textToDomElement'

let selector        = '.grid.packery',
    itemSelector    = '.grid.packery > .grid-item',
    captionSelector = '.grid.packery > .grid-item .text > span',
    percentPosition = true

function _getFontSize(element) {
  let style = window.getComputedStyle(element, null).getPropertyValue('font-size')
  return parseFloat(style)}

function _setFontSize(element, size) { 
  element.style.fontSize = size + 'px'}

function _resizeCaptions() {
  let captions = document.querySelectorAll(captionSelector)
  _.each(captions, (caption) => {

    // hackedy hack: before calculating the fontsize, unset the span width
    caption.style.width = 'unset'
    
    let fontSize  = _getFontSize(caption),
        width     = caption.offsetWidth,
        parent    = caption.parentElement.offsetWidth,
        ratio     = parent / width
    _setFontSize(caption, fontSize * ratio * 0.81)

    // hackedy hack: after setting the fontsize, set the span width to 100%
    caption.style.width = '100%' })}

// helper function that randomly assigns the size attribute of an element,
// if it;s not already set
function _sizeUp(element) {
  if(!element)
    _.each(document.querySelectorAll(itemSelector), el => _sizeUp(el))
  else {
    let size = element.getAttribute('size') || _.random(1, 3)
    element.setAttribute('size', size)
  }
}

function _randomizePadding(element) {
  let width       = element.offsetWidth,
      directions  = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      padding     = _.reduce(directions, (r,d) => {
                      r[d] = _.round(_.random(width * 0.01, width * 0.1)) + 'px'
                      return r }, {})
  _.each(padding, (v, k) => element.style[k] = v ) }

export default function initPackery() {
  let base = document.querySelector(selector);
  if (!base) return

  imagesLoaded(base).on('always', () => {
    let packery = new Packery(base, { itemSelector, percentPosition })
    base.classList.remove('is-loading')

    _.each(packery.items, item => _randomizePadding(item.element.getElementsByClassName('box')[0]))

    lazyScroll
    .on(next => {
      let nextUrl = base.dataset.nextUrl
      if (!nextUrl) return

      fetch(nextUrl)
      .then(res => res.text())
      .then(body => {
        let newBase     = textToDomElement(body, selector),
            newNextUrl  = newBase.dataset.nextUrl,
            newItems    = [...newBase.querySelectorAll(itemSelector)]

        imagesLoaded(newBase).on('always', () => {
          base.dataset.nextUrl = newNextUrl
          newItems.forEach(el => {
            _sizeUp(el)
            _randomizePadding(el.getElementsByClassName('box')[0])
            base.appendChild(el)
          })
          packery.appended(newItems)
          packery.layout()

          _resizeCaptions()
          _.each(newItems, el => _randomizePadding(el.getElementsByClassName('box')[0]))

          next()})})})
    .watch({ threshold: 300 })})

  _sizeUp()
  _resizeCaptions()
}
