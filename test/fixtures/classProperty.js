export default class Test {
    testProperty = 'methodToGrow';
    

    methodToBundle() {
        return 'methodToBundle';
    }
    
    @grow
    methodToGrow = () => {
        return this.testProperty;
    }
}
