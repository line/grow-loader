import fs from 'fs';
import generate from 'babel-generator';

/**
 * write to files
 * @param {Object} options.asts - asts based on filename
 * @param {Array} options.importDeclarations
 * @param {Array} options.distDir
 */
export default function output({asts, importDeclarations, distDir}) {
    // add all the imports in dynamic part file
    Object.keys(asts).forEach((fileName) => {
        asts[fileName].body.unshift(...importDeclarations);
        // write dynamic parts into another file
        const dynamicFileCode = generate(asts[fileName], {}).code;
        if (!fs.existsSync(distDir)){
            fs.mkdirSync(distDir);
        }

        try {
            fs.writeFileSync(`${distDir}/${fileName}.js`, dynamicFileCode);
        } catch (err) {
            throw 'grow-loader cannot write files';
        }
    });
}
