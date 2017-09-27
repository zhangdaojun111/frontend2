/**
 * Created by birdyy on 2017/9/18.
 * 数据源高级计算显示列表 item
 */
import Component from '../../../../../../../../../lib/component';
import template from './original.advanced.item.html';
import handlebars from 'handlebars';
import msgbox from '../../../../../../../../../lib/msgbox';
import {canvasCellService} from '../../../../../../../../../services/bisystem/canvas.cell.service';
let config = {
    template: template,
    actions: {
        update(data) {
            this.data.name = data.name;
            this.data.compute_model = data.compute_model;
            this.data.content = data.content;
            this.reload();
        }
    },
    data: {},
    binds:[
        {  //删除item
            event:'click',
            selector:'.remove-item-btn',
            callback: async function () {
                let res = await canvasCellService.removeAdvancedItemData({'chart_id':this.data.chart.chartName.id,id:this.data.itemId})
                if (res['success'] === 1) {
                    this.destroySelf();
                } else {
                    msgbox.alert(res['error'])
                };
                return false;
            }
        },
        {  //编辑item
            event:'click',
            selector:'.edit-item-btn',
            callback:function () {
                this.trigger('onEditItem', this.data);
                return false;
            }
        },
    ],
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasOriginalAdvancedItemComponent extends Component {
    constructor(data,events) {
        super(config,data,events);
    }
}