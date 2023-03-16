import { countAllFiles } from './../modules/transferProcess';
import { Inputs } from './../interfaces/DirInputs';
import { Request, Response, Application } from "express"
import { copyFiles, convertToStringArray } from "../modules/transferProcess"

export const home = (req: Request, res: Response) => {
    res.render('home')
}

/**
 * @description receive and process the request of the user 
 * @param req 
 * @param res 
 */
export const copyData = (req: Request, res: Response) => {

    const inputs: Inputs = {
        sourceDir: req.body.source,
        destinationDir: req.body.dest,
        excludedFiles: convertToStringArray(req.body.excluded)
    }
    
    let filesCopied = 0
    const totalFiles = countAllFiles(inputs.sourceDir, inputs.excludedFiles) + 1
    
    try {
        const copyFileEvent = copyFiles(inputs)

        copyFileEvent.on('fileCopied', (fileName: string) => {
            console.log(`${fileName}`);
            filesCopied++
            // calculate the folders and files that already been copied, then return it by percent
            // then add into event emmiter to pass the data
            const progress:number = Math.round((filesCopied / totalFiles) * 100);
            if (req.app.get('io')) {
                req.app.get('io').emit('progress', {filesCopied, totalFiles, progress});
            }
           
        })

        //indicate the process of copying in EventEmmiter is done or end
        copyFileEvent.on('end', () => {
            res.json({
                message: "Successfuly Copied all Files",
                success: true
            });
            console.log(filesCopied)
            res.end();
        })
    } catch (error) {
        res.status(500).send(error)
    }
}