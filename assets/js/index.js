import '../sass/index.sass'
import menu       from './menu'
import initSlider from './init-slider'
import initGrid   from './init-grid'
import initDetail from './init-detail'
import initFunky  from './init-funky-button'
import initHover  from './init-hover'

window.goBack = function() {
  window.history.back()
}

menu.init()
initGrid(menu)
initSlider()
initDetail()
// initHover()
// initFunky()
