import * as t from 'babel-types';

import template from 'babel-template';
import traverse from 'babel-traverse';

/**
 * collect dynamic parts from an ast
 * @param {Object} ast
 * @param {string} options.filename - the name of this file
 * @param {string} options.growDecoratorName - the decorator name to detect
 * @param {string} options.growMethodName - method name as 'grow' in output
 * @param {string} options.distDir - dist dir of splitted methods
 */
export default (ast, { fileName, growDecoratorName, growMethodName, distDir }) => {
    let isGrowableMethodsFound = false;
    const importDeclarations = [];
    const dynamicFileASTs = {};

    traverse(ast, {
        // collect import declarations
        ImportDeclaration(path) {
            importDeclarations.push(path.node);
        },
        // check @grow in class methods or class expressions
        'ClassDeclaration|ClassExpression': (path) => {
            const dynamicFileName = `${fileName}_${path.node.id.name}`;
            const body = path.node.body.body;

            // find the growable class methods
            const growableClassMethods = body.filter(item => {
                return 'ClassMethod' === item.type &&
                    item.decorators &&
                    item.decorators.filter(decorator => decorator.expression.name === growDecoratorName)
                        .length > 0;
            });

            // find the growable class properties
            const growableClassProperties = body.filter(item => {
                return 'ClassProperty' === item.type &&
                    item.decorators &&
                    item.decorators.filter(decorator => decorator.expression.name === growDecoratorName)
                        .length > 0;
            });

            if (growableClassMethods.length > 0 || growableClassProperties.length > 0) {
                isGrowableMethodsFound = true;

                // transform class methods & properies to object methods
                const exportMethods = [
                    t.objectProperty(t.identifier('classMethods'), t.objectExpression(growableClassMethods.map(
                        (method) => {
                            body.splice(body.indexOf(method), 1);
                            return t.objectMethod(method.kind, method.key, method.params, method.body);
                        }
                    ))),
                    t.objectProperty(t.identifier('classProperties'), t.objectExpression(growableClassProperties.map(
                        (property) => {
                            body.splice(body.indexOf(property), 1);
                            return t.objectMethod('method', property.key, property.value.params, property.value.body);
                        }
                    )))
                ];

                dynamicFileASTs[dynamicFileName] = t.program([t.exportDefaultDeclaration(
                    t.objectExpression(exportMethods)
                )]);

                // and, add `grow()` to original class
                const methodGrow = t.ClassMethod('method',
                    t.identifier(growMethodName),
                    [],
                    t.blockStatement([
                        // `grow()` uses dynamic import in webpack
                        template(`
                            return import(
                                /* webpackChunkName: "${dynamicFileName}-grow" */ '${distDir}/${dynamicFileName}.js'
                            ).then(({default: sub}) => {
                                if (sub.classMethods) {
                                    Object.assign(this, sub.classMethods);
                                }

                                if (sub.classProperties) {
                                    Object.keys(sub.classProperties).forEach((key) => {
                                        this[key] = sub.classProperties[key].bind(this);
                                    });
                                }
                            });
                        `, {
                            allowImportExportEverywhere : true,
                            preserveComments: true,
                            plugins: ['dynamicImport']}
                        )()
                    ])
                );
                body.push(methodGrow);
            }
        }
    });

    return {
        isGrowableMethodsFound,
        importDeclarations,
        dynamicFileASTs
    };
};
