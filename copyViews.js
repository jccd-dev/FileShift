const fs = require('fs-extra')
const path = require('path')


// define the paths to the source and dest
const viewsSrcDir = path.join(__dirname, 'src', 'views')
const publicDir = path.join(__dirname, 'public')

const viewsDistDir = path.join(__dirname, 'dist/src', 'views')
const publicDestDir = path.join(__dirname, 'dist', 'public')

// include all
fs.ensureDirSync(viewsDistDir)
fs.copySync(viewsSrcDir, viewsDistDir)

fs.ensureDirSync(publicDestDir)
fs.copySync(publicDir, publicDestDir)