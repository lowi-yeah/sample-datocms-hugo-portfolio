import '../sass/index.sass'
import menu       from './menu'
import about      from './about'
import initSlider from './init-slider'
import initGrid   from './init-grid'
import initDetail from './init-detail'
import transition from './transition'

// import initHover  from './init-hover'




menu.init()
about.init()
initGrid(menu)
initSlider()
initDetail()
transition.init()
// initHover()
