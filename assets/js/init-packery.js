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
    let size = element.getAttribute('size') || _.random(1, 2)
    element.setAttribute('size', size)
  }
}

function _randomizePadding(element) {
  let width       = element.offsetWidth,
      directions  = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      padding     = _.reduce(directions, (r,d) => {
                      r[d] = _.round(_.random(width * 0.05, width * 0.24)) + 'px'
                      return r }, {})
  _.each(padding, (v, k) => element.style[k] = v ) }

function _distMetric(x,y,x2,y2) {
  let xDiff = x - x2,
      yDiff = y - y2
  return (xDiff * xDiff) + (yDiff * yDiff) }

//Detect Closest Edge
function _closestEdge(x,y,w,h) {
  let topEdgeDist     = _distMetric(x,y,w/2,0),
      bottomEdgeDist  = _distMetric(x,y,w/2,h),
      leftEdgeDist    = _distMetric(x,y,0,h/2),
      rightEdgeDist   = _distMetric(x,y,w,h/2),
      min             = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist)
  switch (min) {
    case leftEdgeDist:    return 'left'
    case rightEdgeDist:   return 'right'
    case topEdgeDist:     return 'top'
    case bottomEdgeDist:  return 'bottom' } }

function _coordinates(self, e) {
  function _offset({x, y}, ε) {
    x += ε.offsetLeft
    y += ε.offsetTop

    if(ε.className.match(/\bpackery\b/)) return {x, y}
    else return _offset({x, y}, ε.parentNode) }

  let {x, y} = _offset({x: 0, y: 0}, self) 
  x = e.pageX - x
  y = e.pageY - y
  return {x, y}
}

function _initOverlay(item) {


  item.onmouseenter = function(e){
    let {x, y}    = _coordinates(this, e),
        edge      = _closestEdge(x, y, this.clientWidth, this.clientHeight),
        overlay   = this.getElementsByClassName('overlay')[0]
  
    switch(edge){
      case 'left':
        //tween overlay from the left
        overlay.style.top = '0%'
        overlay.style.left = '-100%'
        TweenLite.to(overlay, .5, {left: '0%'})
        break
      case 'right':
        overlay.style.top = '0%'
        overlay.style.left = '100%'
        //tween overlay from the right
        TweenLite.to(overlay, .5, {left: '0%'})
        break
      case 'top':
        overlay.style.top = '-100%'
        overlay.style.left = '0%'
        //tween overlay from the right
        TweenLite.to(overlay, .5, {top: '0%'})
        break
      case 'bottom':
        overlay.style.top = '100%'
        overlay.style.left = '0%'
        //tween overlay from the right
        TweenLite.to(overlay, .5, {top: '0%'})
        break}}
  
   
  item.onmouseleave = function(e){
    let {x, y}  = _coordinates(this, e),
        edge    = _closestEdge(x,y,this.clientWidth, this.clientHeight),
        overlay = this.getElementsByClassName('overlay')[0]
  
    switch(edge){
      case 'left':
        TweenLite.to(overlay, .5, {left: '-100%'})
        break
      case 'right':
        TweenLite.to(overlay, .5, {left: '100%'})
        break
      case 'top':
        TweenLite.to(overlay, .5, {top: '-100%'})
        break
      case 'bottom':
        TweenLite.to(overlay, .5, {top: '100%'})
        break }}
      }

export default function initPackery() {
  let base = document.querySelector(selector);
  if (!base) return

  imagesLoaded(base).on('always', () => {
    let packery = new Packery(base, { itemSelector, percentPosition })
    base.classList.remove('is-loading')

    _.each(packery.items, item => {
      _randomizePadding(item.element.getElementsByClassName('box')[0])
      _initOverlay(item.element.getElementsByClassName('box')[0].getElementsByClassName('content')[0])
    })

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
            base.appendChild(el) })
          packery.appended(newItems)
          packery.layout()

          _resizeCaptions()
          _.each(newItems, el => {
            _randomizePadding(el.getElementsByClassName('box')[0])
            _initOverlay(el.getElementsByClassName('box')[0].getElementsByClassName('content')[0])})

          next()})})})
    .watch({ threshold: 300 })})

  _sizeUp()
  _resizeCaptions()
}
