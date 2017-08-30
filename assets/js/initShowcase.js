import Packery          from 'packery'
import imagesLoaded     from 'imagesloaded'
import lazyScroll       from 'scroll-lazy'
import textToDomElement from './textToDomElement'

let selector      = '.showcase',
    itemSelector  = '.showcase__item'

export default function initShowcase() {
  const showcase = document.querySelector(selector);
  if (!showcase) return

  imagesLoaded(showcase).on('always', () => {
    let packery = new Packery(showcase, { itemSelector })
    showcase.classList.remove('is-loading')

    lazyScroll
    .on(next => {
      let nextUrl = showcase.dataset.nextUrl
      if (!nextUrl) return

      fetch(nextUrl)
      .then(res => res.text())
      .then(body => {
        let newShowcase = textToDomElement(body, selector),
            newNextUrl  = newShowcase.dataset.nextUrl,
            newItems    = [...newShowcase.querySelectorAll(itemSelector)]

        imagesLoaded(newShowcase).on('always', () => {
          showcase.dataset.nextUrl = newNextUrl
          newItems.forEach(el => showcase.appendChild(el))
          packery.appended(newItems)
          packery.layout()
          next()})})})
    .watch({ threshold: 300 })})}
