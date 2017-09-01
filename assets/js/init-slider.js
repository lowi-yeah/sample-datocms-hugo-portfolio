import { lory } from 'lory.js';
import imagesLoaded from 'imagesloaded';

export default function() {
  let slider = document.querySelector('.js_slider')
  if (!slider) return
  imagesLoaded(slider).on('always', () => {
    slider.classList.remove('is-loading')
    lory(slider, { infinite: 2, enableMouseEvents: true })})}