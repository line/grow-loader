const testMethod = require('./util/testMethod');
const del = require('del');

describe('grow-loader should support:', () => {
    after(() => {
        del([`${__dirname}/util/tmp/**.js`])
    });


    it('single class + class methods', (done) => {
        testMethod({
            fixtureName: 'singleClass',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow1', 'methodToGrow2']
                }
            },
            done
        });
    });

    it('customizing method name', (done) => {
        testMethod({
            fixtureName: 'singleClass',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow1', 'methodToGrow2']
                }
            },
            growMethodName: 'mygrow',
            done
        });
    });

    it('customizing decorator name', (done) => {
        testMethod({
            fixtureName: 'decoratorName',
            growDecoratorName: 'mygrow',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow']
                }
            },
            done
        });
    });

    it('multiple class + class methods', (done) => {
        testMethod({
            fixtureName: 'multipleClass',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow1OfTest1', 'methodToGrow2OfTest1'],
                },
                Test2: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow1OfTest2', 'methodToGrow2OfTest2'],
                }
            },
            done
        });
    });

    it('multiple class + class property', (done) => {
        testMethod({
            fixtureName: 'classProperty',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow'],
                }
            },
            done
        });
    });

    it('jsx', (done) => {
        testMethod({
            fixtureName: 'jsx',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['renderMore', 'methodToBind'],
                }
            },
            done
        });
    });

    it('imports', (done) => {
        testMethod({
            fixtureName: 'imports',
            setting: {
                default: {
                    methodNamesToBundle: ['methodToBundle'],
                    methodNamesToGrow: ['methodToGrow1', 'methodToGrow1'],
                }
            },
            done
        });
    });
});
