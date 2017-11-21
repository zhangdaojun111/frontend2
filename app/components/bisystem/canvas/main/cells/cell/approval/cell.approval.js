/**
 * Created by zhaoyan on 2017/11/20.
 */
import {CellBaseComponent} from '../base';
import template from './cell.approval.html';

let config = {
    template: template,
    data: {
        id: 'approval',
        cellChart: {}
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {}
};

export class CellApprovalComponent extends CellBaseComponent {
    constructor(data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event);
        this.data.id += this.componentId;
    }
}
