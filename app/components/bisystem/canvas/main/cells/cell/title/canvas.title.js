/**
 * Created by birdyy on 2017/8/29.
 * 画布块标题
 */
import template from './canvas.title.html';
import Component from '../../../../../../../lib/component';
import './canvans.title.scss';
import {PMAPI} from '../../../../../../../lib/postmsg';

let config = {
    template: template,
    actions: {
        /**
         * 设置canvas title 的值
         * @param chart 初始数据
         */
        setValue(chart,viewId){
            this.data.viewId = viewId ? viewId : '';
            this.data.chart = chart;
            this.data.title = chart['data']['chartName']['name'];
            this.data.isDeep = chart['data']['assortment'] === 'normal' || chart['data']['assortment'] === 'pie' ? true : false;
            this.data.newCell = true;
            this.data.icon = chart['data']['icon'];
            if (this.data.icon){
                this.el.find('.title').addClass('no-title');
            };
            this.reload();
        }
    },
    binds:[
        {
            event:'click',
            selector:'.original-data-btn',
            callback:function () {
                this.trigger('onShowOriginal');
            }
        },
    ],
    data: {
        title: '', // 画布块标题
        isDeep: false, // 是否显示上一层
        editMode: window.config.bi_user === 'manager' ? true : false, // 是否显示编辑，删除操作
        newCell: false, // 用来判断是否新建画布块
        imgUrl: window.config.img_url,
    },
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasCellTitleComponent extends Component {
        constructor(data,event) {
            super(config,data,event)
        }
}
