"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countAllFiles = exports.convertToStringArray = exports.copyFiles = void 0;
const events_1 = __importDefault(require("events"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 *
 * @param data
 */
const copyFiles = (data) => {
    const sourceDir = data.sourceDir;
    const sourceDirName = path_1.default.basename(data.sourceDir);
    const destinationWithSourceDir = path_1.default.join(data.destinationDir, sourceDirName);
    const foldertoExclude = data.excludedFiles;
    const copyOptions = {
        recursive: true,
        preserveTimestamps: true,
        filter: (src) => {
            return !foldertoExclude.some((foldertoExclude) => src.includes(foldertoExclude));
        }
    };
    const fileCopiedEvent = new events_1.default();
    fs_extra_1.default.copy(sourceDir, destinationWithSourceDir, Object.assign(Object.assign({}, copyOptions), { overwrite: false, errorOnExist: true, filter: (src, dest) => {
            const isCopy = !foldertoExclude.some((foldertoExclude) => src.includes(foldertoExclude));
            if (isCopy)
                fileCopiedEvent.emit('fileCopied', path_1.default.basename(src));
            return isCopy;
        } }), (err) => {
        if (err) {
            fileCopiedEvent.emit('error', err);
        }
        else {
            fileCopiedEvent.emit('end');
        }
    });
    return fileCopiedEvent;
};
exports.copyFiles = copyFiles;
/**
 * @description: trimmed the string to remove the space between commas then
 *               convert the trimmed string into array
 * @param excludeFiles
 * @returns {StringArray} excludedFilesArray
 */
const convertToStringArray = (excludeFiles) => {
    const excludedFilesString = excludeFiles;
    const excludeFilesTrimmed = excludedFilesString.replace(/\s*,\s*/g, ",");
    const excludedFilesArray = excludeFilesTrimmed.split(",");
    return excludedFilesArray;
};
exports.convertToStringArray = convertToStringArray;
/**
 * @description: count and return all files in the provided directory
 *               besides the excluded files
 * @param {string }sourceDir
 * @param {string} excludedFiles
 * @returns {number} totalFiles : total number of files inside the directory
 */
const countAllFiles = (sourceDir, excludedFiles) => {
    let totalFiles = 0;
    const files = fs_extra_1.default.readdirSync(sourceDir);
    files.forEach((file) => {
        const filepath = path_1.default.join(sourceDir, file);
        if (fs_extra_1.default.statSync(filepath).isDirectory()) {
            // check if the directory should be excluded
            //then increment the totalfile if it is a folder
            if (!excludedFiles.includes(file)) {
                totalFiles++;
                totalFiles += (0, exports.countAllFiles)(filepath, excludedFiles);
            }
        }
        else {
            if (!excludedFiles.some((excludedFile) => filepath.includes(excludedFile))) {
                totalFiles++;
            }
        }
    });
    return totalFiles;
};
exports.countAllFiles = countAllFiles;
