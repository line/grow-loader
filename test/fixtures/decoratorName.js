import mygrow from '../../lib/grow';

export default class Test {
    methodToBundle() {
        return 'methodToBundle';
    }

    @mygrow
    methodToGrow() {
        return 'methodToGrow';
    }
}
