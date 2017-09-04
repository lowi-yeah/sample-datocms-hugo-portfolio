import _                from 'lodash'
import Draggabilly      from 'draggabilly'

let selector = '.draggable'

export default function initDetail() {
  if(!document.querySelector(selector)) return
  new Draggabilly(selector, {})

  document.querySelector(selector).style.left = _.random(64) + 'vh'
  document.querySelector(selector).style.top  = _.random(25, 81) + 'vh'

  // left: 377px;
    // top: 189px;
  }
