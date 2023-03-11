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
                const isCopy = !foldertoExclude.some((foldertoExclude) => src.includes(foldertoExclude))

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