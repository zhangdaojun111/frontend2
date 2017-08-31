/**
 * Created by birdyy on 2017/8/29.
 * 画布块标题
 */
import template from './canvas.title.html';
import {BiBaseComponent} from '../../../bi.base.component';
import './canvans.title.scss';

let config = {
    template: template,
    actions: {
        setValue(){

        }
    },
    data: {
        title: '', // 画布块标题
        isDeep: false, // 是否显示上一层
        biUser: window.config.bi_user === 'manager' ? true : false, // 是否显示编辑，删除操作
        newCell: false, // 用来判断是否新建画布块
        imgUrl: window.config.img_url,
        isIcon: false,// 是否存在图标
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
