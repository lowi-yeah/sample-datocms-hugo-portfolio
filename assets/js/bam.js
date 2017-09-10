
let HERO_ROOT   = 'hero',
    GLYPHS_ROOT = 'glyphs',
    SVG_ROOT    = 'bam',
    G           = '.glyphs',
    NORMAL      = 1000,

    characters, glyphs,
    hero, glyphsRoot, svg, g

function _addEvent(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return
  if (object.addEventListener) object.addEventListener(type, callback, false)
  else if (object.attachEvent) object.attachEvent('on' + type, callback)
  else object['on'+type] = callback }

// function _map(xvalue, istart, istop, ostart, ostop) {
  // return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))}

function _getGlyphCuts(char) {
  let inner = _(glyphsRoot.childNodes)
                .find(ε => ε.id === ('glyph-' + char)) 
                .childNodes
  return _.filter(inner, ι => ι.nodeType === 1)}

function _glyphMetrics(cut) {
  return _.reduce(cut.attributes, (ρ, α) => {
              ρ[α.name] = _.isNaN(parseFloat(α.value)) ? α.value : parseFloat(α.value)
              return ρ }, {})}

function _getGlyph(char, index) {
  let cuts    = _getGlyphCuts(char),
      cut     = cuts[index],
      metrics = _glyphMetrics(cut)
  return {g: cut, μ: metrics} }

function _dimensions() {
  return 
}

function _resize() {
  let δ = { x: window.innerWidth,
            y: window.innerHeight}
  svg.setAttribute('width', δ.x)
  svg.setAttribute('height', δ.y)
  svg.setAttribute('viewBox', '0 0 ' +  δ.x + ' ' + δ.y)
  return δ }

function _transform(ε, {offset, scale}) {
  // console.log('_transform')
  // console.log('\t offset', offset)
  // console.log('\t scale', scale)
  ε.setAttribute('transform', `matrix(${scale} 0 0 ${scale} ${scale * offset.x} ${scale * offset.y})`)
}

function _layout() {
  // console.log('_layout', glyphs)
  let δw = _resize()
  svg.innerHtml ='' // clear the current content
  
  let δg = _.reduce(glyphs, (σ, glyph) => {
    // console.log('μ', glyph.μ)
    // console.log('g', glyph.g)
    let offset  = { x: σ.x + glyph.μ.left,
                    y: 0 },
        scale   = NORMAL / glyph.μ.height 
    
    _transform(glyph.g, {offset, scale})

    g.appendChild(glyph.g)
    σ.x += glyph.μ.width
    return σ
  }, {x: 0, y: NORMAL})

  // δw contains the window dimensions
  // δg contains the bounding box dimensions of all the glyphs
  let ratioW = δw.x / δg.x
  console.log('δw', δw, 'δg', δg, ratioW)
  g.setAttribute('transform', `matrix(${ratioW} 0 0 ${ratioW} 0 0)`)




}

function init() {
  console.log('init bam')
  // check that the hero element exists
  hero = document.getElementById(HERO_ROOT)
  if(!hero) return

  glyphsRoot  = document.getElementById(GLYPHS_ROOT)
  svg         = document.getElementById(SVG_ROOT)
  g           = svg.querySelector(G)
  characters  = 'knac'

  // find a glyph for each character
  // upon init always take the first fontface
  glyphs      = _.map(characters, c => _getGlyph(c, 0))

  _layout()
  // _start(1, headline.textContent.trim())

  _addEvent(window, 'resize', _.debounce(_layout, 150))
}


export default { init: init }