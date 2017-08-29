import {Base} from '../base';
import template from './linebar.html';

let config = {
    template: template
}

class LineBarEditor extends Base {

    constructor() {
        super(config);
    }

}

export {LineBarEditor}