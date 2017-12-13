const webpack = require('webpack');
const path = require('path');
const { expect } = require('chai');

module.exports = function testMethod({
    fixtureName,
    setting,
    growDecoratorName,
    growMethodName,
    done
}) {
    const tmpName = Date.now();
    webpack({
        entry: path.join(__dirname, `../fixtures/${fixtureName}.js`),
        target: 'node',
        output: {
            path: path.join(__dirname, 'tmp'),
            filename: `${tmpName}.js`,
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: [
                        'babel-loader',
                        path.join(__dirname,
                            `../../lib/index.js${
                                growMethodName ? `?methodName=${growMethodName}` : ''}${
                                growDecoratorName ? `?decoratorName=${growDecoratorName}` : ''}`)
                    ],
                    exclude: () => false
                }
            ]
        }
    }, (err) => {
        const built = require(`${__dirname}/tmp/${tmpName}.js`);

        const objs = Object.keys(setting).map((key) => ({
            key,
            instance: new built[key]()
        }));

        objs.forEach((obj) => {
            setting[obj.key].methodNamesToBundle.forEach((name) => {
                expect(obj.instance[name]).to.not.be.undefined;
                expect(obj.instance[name]()).to.eq(name);
            });

            setting[obj.key].methodNamesToGrow.forEach((name) => {
                expect(obj.instance[name]).to.be.undefined;
            });
        });

        Promise.all(objs.map((obj) => obj.instance[growMethodName || 'grow']()))
            .then(() => {
                objs.forEach((obj) => {
                    setting[obj.key].methodNamesToBundle.forEach((name) => {
                        expect(obj.instance[name]).to.not.be.undefined;
                        expect(obj.instance[name]()).to.eq(name);
                    });

                    setting[obj.key].methodNamesToGrow.forEach((name) => {
                        expect(obj.instance[name]).to.not.be.undefined;
                        expect(obj.instance[name]()).to.eq(name);
                    });
                });

                done();
            });
    });
};

