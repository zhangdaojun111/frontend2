/**
 * Created by zhaoyan on 2017/11/20.
 */
import {CellBaseComponent} from '../base';
import template from './cell.message.html';

let config = {
    template: template,
    data: {
        id: 'message',
        cellChart: {}
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {}
};

export class CellMessageComponent extends CellBaseComponent {
    constructor(data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event);
        this.data.id += this.componentId;
    }
}
