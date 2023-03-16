import EventEmitter from 'events'
import fs from 'fs-extra'
import path from 'path'
import { Inputs,MyCopyOptions } from '../interfaces/DirInputs'

/**
 * 
 * @param data 
 */
export const copyFiles = (data: Inputs) => {
    const sourceDir = data.sourceDir
    const sourceDirName = path.basename(data.sourceDir)
    const destinationWithSourceDir = path.join(data.destinationDir, sourceDirName)
    const foldertoExclude = data.excludedFiles

    const copyOptions: MyCopyOptions = {
        recursive: true,
        preserveTimestamps: true,
        filter: (src: string) => {
            return !foldertoExclude.some((foldertoExclude: string) => src.includes(foldertoExclude))
        }
    }

    const fileCopiedEvent = new EventEmitter()

        fs.copy(sourceDir, destinationWithSourceDir, {
            ...copyOptions,
            overwrite: false,
            errorOnExist: true,
            filter: (src: string, dest: string) => {
                const isCopy = !foldertoExclude.some((foldertoExclude: string) => src.includes(foldertoExclude))

                if(isCopy) fileCopiedEvent.emit('fileCopied', path.basename(src))
                return isCopy
            },
        
        },(err) => {
            if (err) {
                fileCopiedEvent.emit('error', err);
            } else {
                fileCopiedEvent.emit('end');
                }
            }
        )

    return fileCopiedEvent;
}

/**
 * @description: trimmed the string to remove the space between commas then
 *               convert the trimmed string into array
 * @param excludeFiles 
 * @returns {StringArray} excludedFilesArray 
 */
export const convertToStringArray = (excludeFiles: string): string[] => {
    const excludedFilesString = excludeFiles 
    const excludeFilesTrimmed = excludedFilesString.replace(/\s*,\s*/g, ",");
   
    const excludedFilesArray = excludeFilesTrimmed.split(",");
    
    return excludedFilesArray
}

/**
 * @description: count and return all files in the provided directory 
 *               besides the excluded files 
 * @param {string }sourceDir 
 * @param {string} excludedFiles 
 * @returns {number} totalFiles : total number of files inside the directory
 */
export const countAllFiles = (sourceDir: string, excludedFiles: string[]): number => {
    let totalFiles: number = 0
    const files = fs.readdirSync(sourceDir);
    files.forEach((file) => {
        const filepath = path.join(sourceDir, file);
        if (fs.statSync(filepath).isDirectory()) {

            // check if the directory should be excluded
            //then increment the totalfile if it is a folder
            if (!excludedFiles.includes(file)) {
                totalFiles++
                totalFiles += countAllFiles(filepath, excludedFiles);
            }
        } else {
            if (!excludedFiles.some((excludedFile: string) => filepath.includes(excludedFile))) {
                totalFiles++
            }
        }
    });

    return totalFiles
}
