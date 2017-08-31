import SVGMorpheus from './lib/svg-morpheus'

let tocOptions  = {iconId:   'burger',
                     duration: 400,
                     rotation: 'none' },
    morpheus    = new SVGMorpheus('#iconset', tocOptions)

function _openSidebar() {
  morpheus.to('close')
  document.getElementById('sidebar').classList.add('visible')
}

function _closeSidebar() {
  morpheus.to('burger')
  document.getElementById('sidebar').classList.remove('visible')
}

export default function() {

  console.log('initMenu', document.querySelector('#toc'))
  console.log('initMenu', document.querySelector('#sidebar'))
  
  if (!document.querySelector('#toc')) return
  if (!document.querySelector('#sidebar')) return

  


  document.getElementById('toc').onclick = () => {
    if( morpheus._curIconId === 'burger') _openSidebar()
    if( morpheus._curIconId === 'close' ) _closeSidebar()
  }

  // $(id)
  //   .sidebar({
  //     // dimPage: false,
  //     onVisible: () => {
  //       tocButton.to('close')
  //       $('#toc').addClass('open') },
  //     onHide: () => {
  //       tocButton.to('burger')
  //       $('#toc').removeClass('open') }})
  //   .sidebar('attach events', '#toc')
  //   .sidebar('attach events', '#sidebar  a')
}
