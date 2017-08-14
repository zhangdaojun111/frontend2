/**
 * Created by birdyy on 2017/8/14.
 */
import {BiBaseComponent} from '../bi.base.component';
import template from './entry.html';

let config = {
    template: template,
    data: {
        components: ['雷达图', '表格', '柱状,折线图表','多表应用', '九宫图', '漏斗图', '图表注释', '饼图']
    },
    actions: {},
    afterRender() {},
    firstRender() {}
};

export class FormEntryComponent extends BiBaseComponent {
    constructor() {
        super(config)
    }
}