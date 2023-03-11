import { Inputs } from './../interfaces/DirInputs';
import { Request, Response, Application } from "express"
import { copyFiles, convertToStringArray } from "../modules/transferProcess"
import { EventEmitter } from 'events';

export const home = (req: Request, res: Response) => {
    res.render('home')
}

export const copyData = (req: Request, res: Response) => {

    const inputs: Inputs = {
        sourceDir: req.body.source,
        destinationDir: req.body.dest,
        excludedFiles: convertToStringArray(req.body.excluded)
    }
    
    let filesCopied = 0
    try {
        const copyFileEvent = copyFiles(inputs)

        copyFileEvent.on('fileCopied', (fileName: string) => {
            console.log(`File ${fileName} has been copied`);
            filesCopied++
            const progress:number = Math.round((filesCopied / 100) * 100);
            if (req.app.get('io')) {
                req.app.get('io').emit('progress', progress);
            }
            console.log(progress)
        })

        copyFileEvent.on('end', () => {
            res.send('Directory copied successfully');
            res.end();
        })
    } catch (error) {
        res.status(500).send(error)
    }
}