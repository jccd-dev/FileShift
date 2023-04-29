import * as fs from 'fs-extra'
import * as path from 'path'


// define the paths to the source and dest
const viewsSrcDir = path.join(__dirname, 'src', 'views')
const viewsDistDir = path.join(__dirname, 'dist', 'views')

// include all
fs.ensureDirSync(viewsDistDir)
fs.copySync(viewsSrcDir, viewsDistDir)