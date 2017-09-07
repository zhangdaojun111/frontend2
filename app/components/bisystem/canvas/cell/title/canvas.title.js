/**
 * Created by birdyy on 2017/8/29.
 * 画布块标题
 */
import template from './canvas.title.html';
import {BiBaseComponent} from '../../../bi.base.component';
import './canvans.title.scss';
import Mediator from '../../../../../lib/mediator';

let config = {
    template: template,
    actions: {
        /**
         * 设置canvas title 的值
         * @param chart 初始数据
         */
        setValue(chart){
            this.data.charts = chart;
            this.data.title = chart['data']['chartName']['name'];
            this.data.isDeep = chart['data']['assortment'] === 'normal' || chart['data']['assortment'] === 'pie' ? true : false;
            this.data.newCell = true;
            this.data.icon = chart['data']['icon'];
            this.data.isIcon = chart['data']['icon'] ? true : false;
            if(this.data.isIcon){
                this.el.find('.title').addClass('no-title');
            }
            this.data.isEdit = chart['data']['assortment'] === 'comment' ? true : false;
            this.reload();
        },
        /**
         * 传递文本框数据
         */
        sendValue(){
            let views = {
                content: this.data.charts.data.data['rows']['0']['0'],
                field_id: this.data.charts.data.columns.dfield,
                table_id : this.data.charts.data.source.id,
                row_id: this.data.charts.data.data.rows['0']['1'],
            };
            return views;
        }
    },
    binds:[
        {
            event:'click',
            selector:'.edit-title',
            callback: function () {
                Mediator.emit("bi-edit-title:val",this.actions.sendValue());
            }
        }
    ],
    data: {
        title: '', // 画布块标题
        isDeep: false, // 是否显示上一层
        biUser: window.config.bi_user === 'manager' ? true : false, // 是否显示编辑，删除操作
        newCell: false, // 用来判断是否新建画布块
        imgUrl: window.config.img_url,
        isIcon: false,// 是否存在图标
        isEdit: false,
        editor:null,
    },
    afterRender() {

    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasCellTitleComponent extends BiBaseComponent {
        constructor() {
            super(config)
        }

}
