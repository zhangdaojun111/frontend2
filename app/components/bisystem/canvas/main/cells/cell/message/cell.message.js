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
    beforeRender(){
        this.data.id += this.componentId;
    },
    afterRender() {},
    firstAfterRender() {}
};

export let CellMessageComponent = Component(config);

// export class CellMessageComponent extends CellBaseComponent {
//     constructor(data,event,extendConfig) {
//         super($.extend(true,{},config,extendConfig),data,event);
//
//     }
// }
