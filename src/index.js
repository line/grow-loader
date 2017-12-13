import * as babylon from 'babylon';

import generate from 'babel-generator';
import loaderUtils from 'loader-utils';
import output from './output';
import path from 'path';
import traverse from './traverse';

export default function growLoader(source) {
    const fileName = path.parse(this.resourcePath).name;
    const loaderOptions = loaderUtils.getOptions(this);
    const growMethodName = loaderOptions && loaderOptions.methodName || 'grow';
    const growDecoratorName = loaderOptions && loaderOptions.decoratorName || 'grow';
    const distDir = path.resolve(__dirname, '../tmp');

    // parse source to ast
    const ast = babylon.parse(source, {
    plugins: [
            'jsx',
            'decorators',
            'dynamicImport',
            'classProperties',
            'objectRestSpread',
        ],
        allowImportExportEverywhere: true
    });

    // traverse ast, transform and collect methods that need to be splitted
    const traversedResult = traverse(ast, { fileName, growDecoratorName, growMethodName, distDir });

    if (traversedResult.isGrowableMethodsFound) {
        this.async();

        // generate result code
        const result = generate(ast, {comments: true}, source).code;

        // resolve all modules
        return Promise.all(traversedResult.importDeclarations.reverse().map(line => {
            return new Promise((resolve, reject) => {
                this.resolve(
                    this.context,
                    line.source.value,
                    (err, result) => {
                        line.source.value = result;

                        if (!err) {
                            resolve();
                        } else {
                            reject(err);
                        }
                    }
                );
            });
        })).then(() => {
            output({
                asts: traversedResult.dynamicFileASTs,
                importDeclarations: traversedResult.importDeclarations,
                distDir
            });
            this.callback(null, result);
        });
    } else {
        return source;
    }
}
