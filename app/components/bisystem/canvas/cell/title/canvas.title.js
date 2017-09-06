/**
 * Created by birdyy on 2017/8/29.
 * 画布块标题
 */
import template from './canvas.title.html';
import {BiBaseComponent} from '../../../bi.base.component';
import './canvans.title.scss';
import {config as editDialogConfig} from "./edit/edit";
import {PMAPI} from '../../../../../lib/postmsg';
import {ViewsService} from "../../../../../services/bisystem/views.service";

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
            // if(this.data.isEdit){
            //     this.data.edits = chart['data']['data']['rows']['0'];
            // }
            this.reload();
        }
    },
    events:{
        onChange:null,
    },
    binds:[
        {
            event:'click',
            selector:'.edit-title',
            callback: async function () {
                this.events.onChange();
                editDialogConfig.data.view = this.data.charts;
                const res = await PMAPI.openDialogByComponent(editDialogConfig,{
                    width: 740,
                    height: 442,
                    title: '注释编辑',
                });
                ViewsService.setEditData(res).then((val)=>{
                    if(val['success']===1){
                        alert(val['success']);
                    }else{
                        alert(val['error']);
                    }
                })
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
        edits: '',
    },
    afterRender() {

    },
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasCellTitleComponent extends BiBaseComponent {
        constructor(event) {
            config.events.onChange = event;
            super(config)
        }

}
