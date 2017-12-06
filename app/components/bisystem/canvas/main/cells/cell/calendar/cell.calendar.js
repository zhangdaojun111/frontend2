/**
 * Created by zhaoyan on 2017/11/20.
 */
import {CellBaseComponent} from '../base';
import template from './cell.calendar.html';

let config = {
    template: template,
    data: {
        id: 'calendar',
        cellChart: {}
    },
    actions: {},
    afterRender() {},
    firstAfterRender() {}
};

export class CellCalendarComponent extends CellBaseComponent {
    constructor(data,event,extendConfig) {
        super($.extend(true,{},config,extendConfig),data,event);
        this.data.id += this.componentId;
    }
}
