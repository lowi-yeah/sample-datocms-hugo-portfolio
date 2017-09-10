// a little helper script for rendering glyphs of several fonts to svg

import _        from 'lodash'
import fontkit  from 'fontkit'
import fs       from 'fs'
import path     from 'path'

// console.log('lodash', _.random(3), repl)
console.log('hello text!')

function write(path, content) {
  // write to a new file named 2pac.txt
  fs.writeFile(path, content, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err
    // success case, the file was saved
    console.log('svg saved!')})}

function _makePath({font, metrics, d, char}) {
  return  '    <g ' +
            'font="'    + font + '" ' + 
            'char="'    + char + '" ' + 
            'width="'   + metrics.advanceWidth + '" ' + 
            'height="'  + metrics.advanceHeight + '" '+ 
            'left="'    + metrics.leftBearing + '" '+ 
            'top="'     + metrics.topBearing + '" >'+ 
            '\n      <path d="' + d + '" />\n'+ 
          '    </g>'}


function _makeChar(x) {
  let head  = '  <g id="glyph-' + x.char + '" >',
      foot  = '  </g>',
      paths = x.glyphs.join('\n')
  return head + '\n' + paths + '\n' + foot }

function _makeSvg(fontGlyphs) {
  let head  = '<svg id="glyphs" width="100%" height="100%" viewBox="0 0 512 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >',
      foot  = '</svg>',
      chars = _.map(fontGlyphs, _makeChar).join('\n')
  return head + '\n' + chars + '\n' + foot }

function getGlyphForFonts(char, fonts) { 
  let glyphs  = _.map(fonts, font => {
                        let run   = font.layout(char)
                        return {font:     font.postscriptName, 
                                metrics:  run.glyphs[0]._metrics,
                                char:     char,
                                d:        run.glyphs[0].path.toSVG()}})
  return {char: char,
          glyphs: _.map(glyphs, _makePath)} }

function read(dir) {
  return  fs.readdirSync(dir)
            .reduce((files, file) =>
              fs.statSync(path.join(dir, file)).isDirectory() ?
                files.concat(read(path.join(dir, file))) :
                files.concat(path.join(dir, file)), [])}

//  _
// | |_  ___ _ _ ___  __ __ _____   __ _ ___
// | ' \/ -_) '_/ -_) \ V  V / -_) / _` / _ \
// |_||_\___|_| \___|  \_/\_/\___| \__, \___/
//                                 |___/

let fontsPaths  = read('./resources/fonts').filter(p => p.match(/.*[(otf)|(ttf)]$/)),
    fonts       = _.map(fontsPaths, f => fontkit.openSync(f)),
    chars       = 'knac',
    fontGlyphs  = _.map(chars, c => getGlyphForFonts(c, fonts)),
    svg         = _makeSvg(fontGlyphs)

// console.log('glyphs', fontGlyphs)

write('./layouts//partials/glyphs.svg', svg)







