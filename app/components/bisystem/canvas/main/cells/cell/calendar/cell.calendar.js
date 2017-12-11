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
    beforeRender(){
        this.data.id += this.componentId;
    },
    afterRender() {},
    firstAfterRender() {}
};

export let CellCalendarComponent = CellBaseComponent.extend(config);

// export class CellCalendarComponent extends CellBaseComponent {
//     constructor(data,event,extendConfig) {
//         super($.extend(true,{},config,extendConfig),data,event);
//         this.data.id += this.componentId;
//     }
// }
