const hbjs = require('handbrake-js')
const fs = require('fs');

let files = [];

function getFilesFromFolder(videosLocation) {
    const items = fs.readdirSync(videosLocation)
    return items.filter(name => name.indexOf('.') !== 0)
}

function converter(file, path) {
    console.log(`---- Converting --> ${file}`);
    
    hbjs.spawn({ input: `${path}/${file}`, output:`${path}/${file}.mp4` })
    .on('error', err => {
      // invalid user input, no video found etc
      console.log('problem to convert the file', err)
    })
    .on('progress', progress => {
      console.log(
        'Percent complete: %s, ETA: %s',
        progress.percentComplete,
        progress.eta
      )
    })
    .on('end', () => {
      if(files.length) {
        converter(files.shift())
      } else {
        console.log(`COMPLETED!`);
        console.log(`##################################`);
      }
    })
}

function main() {
  const path = '/Users/eliasmj/Documents/Vuze Downloads/True.Detective.S03E05.720p.WEB.H264-METCON[ettv]/';
  const extention = '.mkv';
  files = getFilesFromFolder(path).filter(file => file.includes(extention));
  converter(files.shift(), path);
}
main()

