import {TweenMax, Power2} from 'gsap'

//See in action: http://www.jeanpaze.com/#Honda-CRV

let objArrowBuffer, timeline

function init() {

  console.log('init funky button')

  objArrowBuffer = {}
  objArrowBuffer.status = ""
  TweenMax.set( "#back svg", { scaleX:-1 } )
  timeline = createArrowAnimation( { parent:"#back" } )
  
  // $( "#back a" ).on( "mouseover mouseout click", onArrowHandler );
  document.getElementById('back').onmouseenter  = onMouseEnter
  document.getElementById('back').onmouseleave  = onMouseLeave
  document.getElementById('back').onclick       = onClick

  TweenMax.set( "#back svg", { visibility: 'visible' } )
  timeline.tweenFromTo( "in", "in-end" )
}

function createArrowAnimation( {parent} ) {
  TweenMax.set( parent + ".arrow-pt-3-bottom", { drawSVG:"91% 91%", opacity:0 } );
  TweenMax.set( parent + ".arrow-pt-3-top", { drawSVG:"0" } );
  TweenMax.set( parent + ".arrow-pt-1, " + parent + ".arrow-pt-2", { drawSVG:"100% 100%" } );
  TweenMax.set( parent + ".mud-container", { scale:0, transformOrigin:"50% 50%" } );
  TweenMax.set( parent + ".xplod *", { drawSVG:"100% 100%" } );

  return new TimelineMax( { paused:true } )
    .to(  parent + ".arrow-pt-1",     .25,  { drawSVG:"100% 100%", x:7, rotation:-45, transformOrigin:"100% 100%", ease:Power2.easeIn }, "in" )
    .to(  parent + ".arrow-pt-2",     .25,  { drawSVG:"100% 100%", x:7, rotation:45, transformOrigin:"100% 0", ease:Power2.easeIn }, "in" )
    .to(  parent + ".arrow-pt-3-top", .3,   { drawSVG:"0% 9%",      ease:Power2.easeIn }, "in" )
    .to(  parent + ".arrow-pt-3-top", .7,   { drawSVG:"91% 100%",   ease:Power2.easeOut }, "in+=.3" )
    .set( parent + ".arrow-pt-1",           { drawSVG:"0 100%",     x:-8, rotation:-45, transformOrigin:"100% 100%", ease:Power2.easeIn }, "in+=.7" )
    .to(  parent + ".arrow-pt-1",     .3,   { x:0, rotation:0, transformOrigin:"100% 100%", ease:Back.easeOut.config( 2 ) }, "in+=.7" )
    .set( parent + ".arrow-pt-2",           { drawSVG:"0 100%", x:-8, rotation:45, transformOrigin:"100% 0", ease:Power2.easeIn }, "in+=.7" )
    .to(  parent + ".arrow-pt-2",     .3,   { x:0, rotation:0, transformOrigin:"100% 0", ease:Back.easeOut.config( 2 ) }, "in+=.7" )
    .set( parent + ".arrow-pt-3-bottom",    { drawSVG:"91% 100%",   opacity:1 }, "in+=1.1" )
    .set( parent + ".arrow-pt-3-top",       { drawSVG:"0" }, "in+=1.1" )
    .to(  {}, .01, {}, "in-end" )

    .to( parent + ".mud-container", .5, { scale:1, transformOrigin:"50% 50%", ease:Back.easeOut }, "over" )
    .fromTo( parent + ".circle-path-2", .7, { rotation:0, transformOrigin:"40% 45%" }, { rotation:360, transformOrigin:"40% 45%", ease:Back.easeOut }, "over" )
    .to( parent + ".arrow *", .2, { stroke:"#000000", ease:Back.easeOut }, "over" )
    .to( parent + ".arrow-pt-1", .1, { rotation:-15, transformOrigin:"100% 100%", ease:Power4.easeOut }, "over" )
    .to( parent + ".arrow-pt-1", .5, { rotation:0, transformOrigin:"100% 100%", ease:Back.easeOut }, "over+=.1" )
    .to( parent + ".arrow-pt-2", .1, { rotation:15, transformOrigin:"100% 0", ease:Power4.easeOut }, "over" )
    .to( parent + ".arrow-pt-2", .4, { rotation:0, transformOrigin:"100% 0", ease:Back.easeOut }, "over+=.1" )
    .to( parent + ".arrow", .2, { rotation:-10, scale:1.2, transformOrigin:"50% 50%", ease:Power4.easeOut }, "over" )
    .to( parent + ".arrow", .6, { rotation:0, scale:1, transformOrigin:"50% 50%", ease:Back.easeOut }, "over+=.2" )
    .to( {}, .01, {}, "over-end" )

    .to( parent + ".arrow-pt-1", .25, { drawSVG:"100% 100%", x:7, rotation:-45, transformOrigin:"100% 100%", ease:Power2.easeIn }, "click" )
    .to( parent + ".arrow-pt-2", .25, { drawSVG:"100% 100%", x:7, rotation:45, transformOrigin:"100% 0", ease:Power2.easeIn }, "click" )
    .to( parent + ".arrow-pt-3-bottom", .3, { drawSVG:"100% 100%", ease:Power2.easeIn }, "click" )
    .to( parent + ".arrow-pt-3-top", .3, { drawSVG:"0% 9%", ease:Power2.easeIn }, "click" )
    .to( parent + ".arrow-pt-3-top", 1, { drawSVG:"91% 100%", ease:Power2.easeOut }, "click+=.3" )
    .to( parent + ".mud-container, " + parent + ".arrow", .3, { scale:1.5, transformOrigin:"50% 50%", ease:Power4.easeOut }, "click+=.3" )
    .to( parent + ".mud-container, " + parent + ".arrow", .3, { scale:1, transformOrigin:"50% 50%", ease:Power1.easeOut }, "click+=.8" )
    .set( parent + ".arrow-pt-1", { drawSVG:"0 100%", x:-8, rotation:-45, transformOrigin:"100% 100%", ease:Power2.easeIn }, "click+=1" )
    .to( parent + ".arrow-pt-1", .3, { x:0, rotation:0, transformOrigin:"100% 100%", ease:Back.easeOut.config( 2 ) }, "click+=1" )
    .set( parent + ".arrow-pt-2", { drawSVG:"0 100%", x:-8, rotation:45, transformOrigin:"100% 0", ease:Power2.easeIn }, "click+=1" )
    .to( parent + ".arrow-pt-2", .3, { x:0, rotation:0, transformOrigin:"100% 0", ease:Back.easeOut.config( 2 ) }, "click+=1" )
    .to( {}, .01, {}, "click-end" )

    .to( parent + ".circle-path-1", .5, { x:18, scale:.6, transformOrigin:"50% 50%", ease:Power4.easeIn }, "out" )
    .to( parent + ".circle-path-2", .5, { x:-18, scale:.6, transformOrigin:"50% 50%", ease:Power4.easeIn }, "out" )
    .set( parent + ".circle-path-1, " + parent + ".circle-path-2", { x:0, scale:1, transformOrigin:"50% 50%" }, "out+=.5" )
    .set( parent + ".mud-container", { scale:0, transformOrigin:"50% 50%" }, "out+=.5" )
    .to( parent + ".arrow *", .2, { stroke:"#FFFFFF", ease:Back.easeOut }, "out+=.5" )
    .to( parent + ".arrow-pt-1", .2, { rotation:-30, transformOrigin:"100% 100%", ease:Power4.easeIn }, "out+=.3" )
    .to( parent + ".arrow-pt-2", .2, { rotation:30, transformOrigin:"100% 0", ease:Power4.easeIn }, "out+=.3" )
    .to( parent + ".arrow", .2, { rotation:10, scale:1.2, transformOrigin:"50% 50%", ease:Power4.easeIn }, "out+=.3" )
    .to( parent + ".arrow", .6, { rotation:0, scale:1, transformOrigin:"50% 50%", ease:Back.easeOut }, "out+=.6" )
    .to( parent + ".arrow-pt-1", .5, { rotation:0, transformOrigin:"100% 100%", ease:Back.easeOut.config(3) }, "out+=.5" )
    .to( parent + ".arrow-pt-2", .4, { rotation:0, transformOrigin:"100% 0", ease:Back.easeOut.config(3) }, "out+=.5" )
    .set( parent + ".xplod *", { drawSVG:"100% 100%", opacity:1 }, "out+=.45" )
    .to( parent + ".xplod *", .1, { drawSVG:"0% 100%", ease:Power4.easeIn }, "out+=.45" )
    .to( parent + ".xplod *", .7, { drawSVG:"0", opacity:0, ease:Power4.easeOut }, "out+=.55" )
    .to( {}, .01, {}, "out-end" )
}


function onMouseEnter( event ) {
  event.preventDefault()
  console.log('onMouseEnter', objArrowBuffer)
  if( objArrowBuffer.status != '' ) objArrowBuffer.event = event
  else 
    timeline.tweenFromTo( 'over', 'over-end' ) }

function onMouseLeave( event ) {
  event.preventDefault()
  console.log('onMouseLeave', event)
  if( objArrowBuffer.status != '' ) objArrowBuffer.event = event
  else timeline.tweenFromTo( 'out', 'out-end' ) }

function onClick( event ) {
  event.preventDefault()
  console.log('onClick', event)
  if( timeline.currentLabel() != 'click' ) {
    objArrowBuffer.status = 'feeding'
    timeline.tweenFromTo( 'click', 'click-end', { onComplete:bufferAction, onCompleteParams:[ { timeline:timeline } ] } );
  } }

function bufferAction( objConfig ) {
  console.log('bufferAction', objConfig)

  // var objArrowBuffer = $( "#back a");
  // var currentBuffer = objArrowBuffer[ objConfig.side ];

  // objArrowBuffer = {};
  // objArrowBuffer.status = "";

  // if( objArrowBuffer.event ){
  //   if( objArrowBuffer.event.type != "mouseover" ) currentSideDiv.trigger( objArrowBuffer.event );
  // };
}

export default init