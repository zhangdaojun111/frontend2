/**
 * Created by birdyy on 2017/7/31.
 */
import {BiBaseComponent} from '../../bi.base.component';
import template from './canvas.header.html';


let config = {
    template: template
};

export class CanvasHeaderlComponent extends BiBaseComponent {
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}