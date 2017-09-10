
let HERO_ROOT   = 'hero',
    GLYPHS_ROOT = 'glyphs',
    SVG_ROOT    = 'bam',
    G           = '.glyphs',
    NORMAL      = 1000,
    hero, glyphsRoot, svg, g,
    text, lines, glyphlines

function _addEvent(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return
  if (object.addEventListener) object.addEventListener(type, callback, false)
  else if (object.attachEvent) object.attachEvent('on' + type, callback)
  else object['on'+type] = callback }

// function _map(xvalue, istart, istop, ostart, ostop) {
  // return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))}

function _glyphMetrics(cut) {
  return _.reduce(cut.attributes, (ρ, α) => {
              ρ[α.name] = _.isNaN(parseFloat(α.value)) ? α.value : parseFloat(α.value)
              return ρ }, {})}

function _getGlyphCuts(char) {
  let nodes = _(glyphsRoot.childNodes)
                .find(ε => ε.id === ('glyph-' + char)) 
                .childNodes
  return  _(nodes)
            .filter(ι => ι.nodeType === 1)
            .map(g => {return {g: g.cloneNode(true), μ: _glyphMetrics(g)}})
            .value() }

function _getGlyph(char, selector) {
  let cuts    = _getGlyphCuts(char),
      cut     = _.find(cuts, ({μ}) => _.reduce(selector, (ρ, v, k) => ρ && (μ[k] === v), true))
  return cut }

function _getGlyphs(text, selector) {
  // get the glyph for each character
  return _.map(text, c => _getGlyph(c, selector)) }

function _resize() {
  let δ = { x: window.innerWidth,
            y: window.innerHeight}
  svg.setAttribute('width', δ.x)
  svg.setAttribute('height', δ.y)
  svg.setAttribute('viewBox', '0 0 ' +  δ.x + ' ' + δ.y)
  return δ }

function _transform(ε, {offset, scale}) {
  ε.setAttribute('transform', `matrix(${scale} 0 0 ${scale} ${offset.x} ${offset.y})`) }

function _layoutLine(glyphs, index, lines) {
  return _.reduce(glyphs, (σ, glyph) => {
    let scale   = NORMAL / glyph.μ.height,
        offset  = { x: σ.x + glyph.μ.left,
                    y: NORMAL * (lines.length - index - 1) }
    _transform(glyph.g, {offset, scale})
    g.appendChild(glyph.g)
    σ.x += glyph.μ.width * scale
    return σ }, {x: 0, y: NORMAL})}

function _layout() {
  svg.innerHtml ='' // clear the current content

  let δw  = _resize(),                      // window dimensions
      δl  = _.map(glyphlines, _layoutLine), // line dimensions
      ӎx  = _.maxBy(δl, δ => δ.x),          // max line width
      Ʀw  = δw.x / ӎx.x                     // width ratio

  // transform only considering width
  g.setAttribute('transform', `matrix(${Ʀw} 0 0 ${Ʀw} 0 0)`)

  // …aftwerwards
  // get the height of the glyphs group
  // and compare it to the window height
  let h   = g.getBBox().height * Ʀw,
      Ʀh  = h / δw.y,
      δh  = (δw.y - h)/2

  // if the text is higher than the screen, re-scale the group
  if(Ʀh > 1) g.setAttribute('transform', `matrix(${Ʀw/Ʀh} 0 0 ${Ʀw/Ʀh} 0 0)`)
  // if the text is not as high as the screen, center the group
  else g.setAttribute('transform', `matrix(${Ʀw} 0 0 ${Ʀw} 0 ${δh})`)}

function init() {
  console.log('init bam')
  // check that the hero element exists
  hero = document.getElementById(HERO_ROOT)
  if(!hero) return

  glyphsRoot  = document.getElementById(GLYPHS_ROOT)
  svg         = document.getElementById(SVG_ROOT)
  g           = svg.querySelector(G)
  text        = 'studio knack'
  lines       = text.split(/\s/)

  // get the glyphs for all lines for the given fontselector
  glyphlines  = _.map(lines, l => _getGlyphs(l, {font: 'UniversLTStd-Bold'}))

  _layout()
  // _start(1, headline.textContent.trim())

  _addEvent(window, 'resize', _.debounce(_layout, 150))
}


export default { init: init }