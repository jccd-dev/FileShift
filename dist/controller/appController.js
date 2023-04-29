"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyData = exports.home = void 0;
const transferProcess_1 = require("./../modules/transferProcess");
const transferProcess_2 = require("../modules/transferProcess");
const home = (req, res) => {
    res.render('home');
};
exports.home = home;
/**
 * @description receive and process the request of the user
 * @param req
 * @param res
 */
const copyData = (req, res) => {
    const inputs = {
        sourceDir: req.body.source,
        destinationDir: req.body.dest,
        excludedFiles: (0, transferProcess_2.convertToStringArray)(req.body.excluded)
    };
    let filesCopied = 0;
    const totalFiles = (0, transferProcess_1.countAllFiles)(inputs.sourceDir, inputs.excludedFiles) + 1;
    try {
        const copyFileEvent = (0, transferProcess_2.copyFiles)(inputs);
        copyFileEvent.on('fileCopied', (fileName) => {
            console.log(`${fileName}`);
            filesCopied++;
            // calculate the folders and files that already been copied, then return it by percent
            // then add into event emmiter to pass the data
            const progress = Math.round((filesCopied / totalFiles) * 100);
            if (req.app.get('io')) {
                req.app.get('io').emit('progress', { filesCopied, totalFiles, progress });
            }
        });
        //indicate the process of copying in EventEmmiter is done or end
        copyFileEvent.on('end', () => {
            res.json({
                message: "Successfuly Copied all Files",
                success: true
            });
            console.log(filesCopied);
            res.end();
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.copyData = copyData;
