import anime from 'animejs'

function init() {
  console.log('init transition')

  // global function for navigating a step back
  // used on single pages to navigate back to the home screen
  window.goBack = function() {
    window.history.back()
  }
  
  function _href(e) {
    if(e.tagName.match(/body/gi)) return null
    let location = e.getAttribute('href')
    if(location) return location
    else return _href(e.parentElement)}
  
  // capture all a#href clicks
  window.onclick = e => { 
    let location = _href(e.target)
  
    if(location) {
      e.preventDefault()
      let τ = document.getElementById('transition'),
          δ = _.sample(['left', 'top']),
          ε = _.sample(['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']),
          ω = { targets: '#transition',
                top: 0,
                left: 0,
                easing:   ε,
                duration: 420 },
          α  = anime(ω) 
    α.complete = () => window.location = location }}

  let τ = document.getElementById('transition'),
      δ = _.sample(['left', 'top']),
      ρ = _.sample(['-102%', '102%']),
      ε = _.sample(['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']),
      ω = { targets: '#transition',
            easing:   ε,
            duration: 420 }
  ω[δ] = ρ
  anime(ω)}
export default { init: init }