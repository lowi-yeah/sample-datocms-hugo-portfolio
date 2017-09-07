import _                from 'lodash'
import imagesLoaded     from 'imagesloaded'
import Isotope          from 'isotope'
import InfiniteScroll   from 'infinite-scroll'
import {scaleLinear}    from 'd3-scale'
import isMobile         from 'ismobilejs'

// function isTouchDevice() { 
//   console.log('isMobile', isMobile)
//   return isMobile.phone || isMobile.seven_inch || isMobile.tablet }

function isTouchDevice() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

// make imagesLoaded available for InfiniteScroll
InfiniteScroll.imagesLoaded = imagesLoaded

let selector        = '.grid',
    itemSelector    = '.grid > .grid-item',
    captionSelector = '.grid > .grid-item .text',
    fontWeights     = [400, 700, 800, 900],
    fontWeightΣ     = scaleLinear()
                        .domain([64, 16])
                        .rangeRound([0, 3])
fontWeightΣ.clamp(true)


function _getFontSize(element) {
  let style = window.getComputedStyle(element, null).getPropertyValue('font-size')
  return parseFloat(style)}

function _setFontSize(element, size) { element.style.fontSize = size + 'px'}


function _captionHeight(caption, ƒSize, i) {
  let ch      = caption.offsetHeight,
      ph      = caption.parentElement.parentElement.offsetHeight,
      ratioH  = ch/ph

  if(i > 42) return // safety first

  if(ratioH > 1) {
    ƒSize = ƒSize * 0.81
    _setFontSize(caption, ƒSize)
    _.delay(() => _captionHeight(caption, ƒSize, (i+1)), 100) } 
  else {
    caption.style.opacity = 1
    caption.style.fontWeight = fontWeights[fontWeightΣ(ƒSize)] }}

function _resizeCaption(caption) {

  if(isTouchDevice()) {
    _setFontSize(caption, 16)
    caption.style.opacity         = 1
    caption.style['align-self']   = 'flex-end'
    caption.style['text-shadow']  = 'none'
    // caption.style.background      = 'rgba(255, 255, 255, 0.92)'
    caption.style.background      = 'rgb(255, 255, 255)'
    return}

  let cw        = caption.offsetWidth,
      pw        = caption.parentElement.parentElement.offsetWidth,
      ratioW    = pw/cw,
      ƒSize     = _getFontSize(caption) * 0.81,
      newƒSize  = ƒSize * ratioW
  _setFontSize(caption, newƒSize)
  // we need the delays so that the elements have a chance to get redrawn
  _.delay(() => _captionHeight(caption, ƒSize, 0), 100)}

// helper function that randomly assigns the size attribute of an element,
// if it's not already set
function _sizeUp(element) {
  let size = element.getAttribute('size')

  if(size) element.setAttribute('size', size) 
  else {
    size = _.random(25, 50) + '%'
    if (isMobile.phone || isMobile.seven_inch ) 
      size = '100%'
    element.style.width = size
  }
}

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

  // check if we have a touch device, if so show the text
  if(isTouchDevice()) {
    let overlay   = item.getElementsByClassName('overlay')[0]
    overlay.style.left = 0 }

  item.onmouseenter = function(e){
    if(isTouchDevice()) return

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
    if(isTouchDevice()) return

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

function _initFilters(isotope, menu) {
  let base    = document.querySelector(selector),
      inputs  = document.querySelectorAll('.filter input[type="checkbox"]')
  function _filter() {
    let values    = _(inputs)
                      .map(checkbox => {
                        let name = checkbox.getAttribute('filter')
                        return {name: name, checked: checkbox.checked}})
                      .filter(({checked}) => checked)
                      .value(),
        filterFn  = function(item) {
                      let category  = item.getAttribute('category'),
                          index     = _.find(values, { name: category })
                      return !_.isNil(index)}
    isotope.arrange({ filter: filterFn })
    menu.close()}
    
  _.each(inputs, ι => { ι.onchange = _filter }) // attach onChange handler to each checkbox
  _filter() // filter once upon init
}

export default function initGrid(menu) {
  let base = document.querySelector(selector);
  if (!base) return

  let isotope   = new Isotope( base, {itemSelector: '.grid-item',
                                      layoutMode:   'fitRows',
                                      filter:       '*' }),
      infScroll = new InfiniteScroll( base, { path:     '#next > a',
                                              append:   '.grid-item',
                                              outlayer: isotope,
                                              status:   '.page-load-status',
                                              hideNav:  '#next'}),
      filters   = _initFilters(isotope, menu)

    // initialize the existing grid items. then re-layout
    _.each(isotope.items, item => {
        let box     = item.element.getElementsByClassName('box')[0],
            content = box.getElementsByClassName('content')[0],
            caption = content.getElementsByClassName('overlay')[0]
                        .getElementsByClassName('text')[0]
        _sizeUp(item.element)
        _randomizePadding(box)
        _resizeCaption(caption)
        _initOverlay(content)})
    isotope.layout()

    // upon append, initialize the new grid items. then re-layout
    infScroll.on( 'append', (response, path, items) => {
      _.each(items, item => {
        let box     = item.getElementsByClassName('box')[0],
            content = box.getElementsByClassName('content')[0],
            caption = content.getElementsByClassName('overlay')[0]
                        .getElementsByClassName('text')[0]
        _sizeUp(item)
        _randomizePadding(box)
        _resizeCaption(caption)
        _initOverlay(content)})
      isotope.layout()})}
