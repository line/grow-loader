import _Test from './classProperty.js';
import mygrow from '../../lib/grow';

export default class Test {
    methodToBundle() {
        return new _Test().methodToBundle();
    }

    @grow
    methodToGrow1() {
        return 'methodToGrow1';
    }

    @grow
    methodToGrow2() {
        return 'methodToGrow2';
    }
}
