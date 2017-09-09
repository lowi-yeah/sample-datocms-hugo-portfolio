let letters = { a: ['a', 'A', 'α', 'Λ', '🜂', 'ﾍ'],
                c: ['c', 'C', 'Ɔ', 'ɕ', 'ɔ', 'ʗ', 'Ͻ', 'ﾧ'],
                d: ['d', 'D', 'δ', '🅓', '𐌃', 'Đ'],
                i: ['i', 'I', 'Ї', 'ו', 'ן', 'ℑ', '⌡', '⧘', 'ι'],
                k: ['k', 'K', 'κ', 'ҟ'],
                n: ['n', 'N', 'η', 'ɴ', 'П', 'П', 'ח',  'ℿ', '∩',  '⊓', '𝌓', '𐑿'],
                o: ['o', 'O', 'ø', 'θ', 'ם', 'ọ',  '▩', '●', '○', '⦻', '⨀', '⬢', '⬟', '⭓', '🝔'],
                s: ['s', 'S','Ϟ', 'ʃ', '⟆', '𐑥', '𐊖', '𐅜', 'ﻛ', 'ﻯ'],
                t: ['t', 'T', 'Ⱦ', 'ʈ', 'ʇ', 'ͳ', 'τ', 'Г', 'Т', 'т', 'Ŧ', '⏊', '⏉', 'ŧ'],
                u: ['u', 'U', 'ʉ', 'ṳ', '∪', '⨃']}


function _start(fps, headline) {

  let fpsInterval   = 1000 / fps, 
      then          = Date.now() + 4000,
      startTime     = then, now, elapsed,
      current       = _.map(headline, c => c),
      makeHeadline  = function() {
                        let index = _.random(current.length)
                        current = _.map(current, (c, ι) => {
                                      if(index === ι) {
                                        let ς = headline[ι]
                                        return _.sample(letters[ς]) || current[ι] }
                                      return c })
                        document // set new headline
                          .getElementById('headline')
                          .innerHTML = _.map( current, c => {
                            if(c === ' ') return '<span class="space"></span>'
                            return '<span>' + c + '</span>'
                          } )
                                          .join('') },

      animate     = () => {
                      requestAnimationFrame(animate)
                      now = Date.now()
                      elapsed = now - then
                      if (elapsed > fpsInterval) {
                        then = now - (elapsed % fpsInterval);
                        makeHeadline() }}
  makeHeadline()
  animate() 
  // makeHeadline()
}


function init() {
  let headline = document.getElementById('headline').textContent.trim()
  _start(1, headline)
}


export default { init: init }