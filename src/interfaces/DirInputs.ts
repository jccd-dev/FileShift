import fs from 'fs-extra'

export interface Inputs {
    sourceDir: string,
    destinationDir: string,
    excludedFiles: string[]
}

export interface MyCopyOptions extends fs.CopyOptions {
    recursive?: boolean
}

