/**
 * Created by birdyy on 2017/8/29.
 * 画布块标题
 */
import template from './canvas.title.html';
import Component from '../../../../../../../lib/component';
import './canvans.title.scss';
import {PMAPI,PMENUM} from '../../../../../../../lib/postmsg';
import Mediator from '../../../../../../../lib/mediator';

let config = {
    template: template,
    actions: {

        /**
         * 设置canvas title 的值
         * @param chart 初始数据
         */
        setValue(chart,viewId){
            this.data.viewId = viewId ? viewId : '';
            this.data.userSelf = chart['data']['self'] == 1 ? true : false;
            this.data.chart = chart;
            this.data.title = chart['data']['chartName']['name'];
            this.data.isDeep = chart['data']['assortment'] === 'normal' || chart['data']['assortment'] === 'pie' ? true : false;
            this.data.richText = chart['data']['assortment'] === 'comment' ? true : false;
            this.data.newCell = true;
            this.data.icon = chart['data']['icon'];
            this.data.nonPdf = !window.config.pdf;
            if (this.data.icon){
                this.el.find('.title').addClass('no-title');
            }
            this.reload();
            if(window.config.bi_user === 'client'){
                this.el.find('.title-tips').addClass('client-click');
            }
        },
        /**
         * 客户模式下允许点击画布标签打开数据源tab页
         */
        jumpToSourceTab(){
            if(window.config.bi_user !== 'client'){
                return;
            }
            let sources = this.data.chart.data.source || this.data.chart.data.sources;
            let idArr = [];

            if(sources){
                if(!$.isArray(sources) && sources.hasOwnProperty('id') && sources['id'] !== ''){
                    idArr.push(sources.id);
                }else{
                    if(sources.length && sources[0].sources.id){
                        idArr.push(sources[0].sources.id);
                    }
                }
                PMAPI.sendToParent({
                    type:PMENUM.open_iframe_by_id,
                    id:idArr
                });
            }
        },

        /**
         * 设置下穿title
         * @param data = 下穿title数据
         */
        setDeepTitle(data) {
            let title = '';
            if (data.xOld.length > 0) {
                data.xOld.map((item,index,items) => {
                    if (index === items.length -1) {
                        title += ` ${item.name}:${item.xName}`
                    } else {
                        title += ` ${item.name}:${item.xName} /`
                    }
                });
            }
            this.el.find('.deep-title').html(title ? '/ '+title : title)
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
        {
            event:'click',
            selector:'.title-tips',
            callback:function () {
                this.actions.jumpToSourceTab();
            }
        }
    ],
    data: {
        title: '', // 画布块标题
        isDeep: false, // 是否显示上一层
        editMode: window.config.bi_user === 'manager' ? true : false, // 是否显示编辑，删除操作
        newCell: false, // 用来判断是否新建画布块
        imgUrl: window.config.img_url,
        userSelf: true
    },
    afterRender() {},
    firstAfterRender() {},
    beforeDestory() {}
};

export class CanvasCellTitleComponent extends Component {
        constructor(data,event,extendConfig) {
            super($.extend(true,{},config,extendConfig),data,event)
        }
}
