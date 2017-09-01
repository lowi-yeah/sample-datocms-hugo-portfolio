import _                from 'lodash'
import Packery          from 'packery'
import imagesLoaded     from 'imagesloaded'
import lazyScroll       from 'scroll-lazy'
import textToDomElement from './textToDomElement'

let selector        = '.detail.packery',
    itemSelector    = '.detail.packery > .grid-item',
    percentPosition = true

export default function initDetail() {
  let base = document.querySelector(selector);
  if (!base) return
  console.log('initDetail')
  let packery = new Packery(base, { itemSelector, percentPosition })
  console.log('packery', packery)
  }
