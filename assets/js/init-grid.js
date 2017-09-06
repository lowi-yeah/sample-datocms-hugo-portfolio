import _                from 'lodash'
import imagesLoaded     from 'imagesloaded'
import Isotope          from 'isotope'
import InfiniteScroll   from 'infinite-scroll'
import {scalePow}       from 'd3-scale'

// make imagesLoaded available for InfiniteScroll
InfiniteScroll.imagesLoaded = imagesLoaded

let selector        = '.grid',
    itemSelector    = '.grid > .grid-item',
    captionSelector = '.grid > .grid-item .text',
    percentPosition = true

function _getFontSize(element) {
  let style = window.getComputedStyle(element, null).getPropertyValue('font-size')
  return parseFloat(style)}

function _setFontSize(element, size) { element.style.fontSize = size + 'px'}

function _resizeCaptions() {
  let captions  = document.querySelectorAll(captionSelector),
      fontΣ     = scalePow()
                    .exponent(2)
                    

  _.each(captions, (caption) => {
    // hackedy hack: before calculating the fontsize, unset the span width
    // caption.style.width = 'unset'

    let cw        = caption.offsetWidth,
        pw        = caption.parentElement.parentElement.offsetWidth,
        ratioW    = pw/cw,
        ƒSize     = _getFontSize(caption) * 0.81,
        newƒSize  = ƒSize * ratioW
    _setFontSize(caption, newƒSize)

    console.log('caption', caption, cw)
    console.log('parent', pw)
    console.log('ratioW', ratioW)
    // console.log('ratioH', ratioH)
    console.log('ƒSize', ƒSize)
    console.log('newƒSize', newƒSize)
    console.log('————')

    let ch      = caption.offsetHeight,
        ph      = caption.parentElement.parentElement.offsetHeight,
        ratioH  = ph/ch

    if(ratioH < 1) {
      newƒSize  = newƒSize * ratioH
      _setFontSize(caption, newƒSize)
    }

    console.log('caption', caption)
    console.log('ch', ch)
    console.log('ph', ph)
    console.log('ratioH', ratioH)
    console.log('————————')
  })}




// helper function that randomly assigns the size attribute of an element,
// if it's not already set
function _sizeUp(element) {
  let size = element.getAttribute('size') || _.random(1, 2)
  element.setAttribute('size', size) }

function _randomizePadding(element) {
  let width       = element.offsetWidth,

      paddings    = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      padding     = _.reduce(paddings, (r,d) => {
                      r[d] = _.round(_.random(width * 0.024, width * 0.16)) + 'px'
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
    if(ε.className.match(/^grid$/)) return {x, y}
    else return _offset({x, y}, ε.parentNode) }

  let {x, y} = _offset({x: 0, y: 0}, self) 
  x = e.pageX - x
  y = e.pageY - y
  return {x, y} }

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

export default function initGrid() {
  let base = document.querySelector(selector);
  if (!base) return

 
  let isotope   = new Isotope( base, {itemSelector: '.grid-item',
                                      layoutMode: 'fitRows' }),
      infScroll = new InfiniteScroll( base, { path: '#next > a',
                                              append: '.grid-item',
                                              outlayer: isotope,
                                              hideNav: '#next'})

    // initialize the existing grid items. then re-layout
    _.each(isotope.items, item => {
        let box     = item.element.getElementsByClassName('box')[0],
            content = box.getElementsByClassName('content')[0]
        _sizeUp(item.element)
        _randomizePadding(box)
        // _initOverlay(content) 
      })
    isotope.layout()
    _resizeCaptions()

    // upon append, initialize the new grid items. then re-layout
    infScroll.on( 'append', (response, path, items) => {
      _.each(items, item => {
        let box     = item.getElementsByClassName('box')[0],
            content = box.getElementsByClassName('content')[0]
        _sizeUp(item)
        _randomizePadding(box)
        // _initOverlay(content) 
      })
      isotope.layout()
      _resizeCaptions() })
}
