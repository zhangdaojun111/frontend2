import Component from '../../../../lib/component';

import { AsideChartService } from "../../../../services/bisystem/bi.chart.del.service";
import template from "./charts.html";
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';

import "./charts.scss";
import {canvasCellService} from "../../../../services/bisystem/canvas.cell.service";

let config = {
    template:template,
    data:{
        charts:[],
    },
    actions:{
        /**
         * 显示删除/编辑
         */
        showMenu(event) {
            let chartTop = this.el.offset().top;
            let menuHeight = this.el.find('.hide_meun').height();
            let allHeight = this.el.find('.hide_meun').height() + chartTop;
            let bodyHeight = document.body.offsetHeight;
            this.el.find('.hide_meun').fadeIn();
            this.el.siblings().find('.hide_meun').fadeOut();
            this.el.find('.hide_meun').css('top',chartTop);
            if(allHeight > bodyHeight) {
                this.el.find('.hide_meun').css('top',bodyHeight - menuHeight);
            }
            event.stopPropagation();
        },
        /**
         * 是否删除
         */
        async confirmDel() {
            const ok = await msgbox.confirm('是否删除？');
            let data = {
                chart_id:''
            };
            if (ok){
                data.chart_id = this.data.id;
                AsideChartService.delChart(data).then((res)=>{
                    if (res['success']){
                        this.trigger('onDelete',this.data);
                        this.destroySelf();
                    }else{
                        msgbox.alert(res['error'])
                    }
                });
            }
        },
    },
    binds:[
        {   //滑上li显示提示图标
            event:'mouseover',
            selector:'li',
            callback: function () {
                this.el.find('.btn_ripple').show();
            }
        },
        {   //滑出li显示提示图标
            event:'mouseout',
            selector:'li',
            callback: function () {
                this.el.find('.btn_ripple').hide();
            }
        },
        {   //点击图标 显示删除/编辑按钮
            event:'click',
            selector:'li .btn_ripple',
            callback: function () {
                this.actions.showMenu(event);
            }
        },
        {   //删除图表
            event:'click',
            selector:'.btn_del',
            callback: function () {
                this.actions.confirmDel();
            }
        },
    ],
    beforeRender(){},
    afterRender() {
        // this.el.on('dragstart',(ev) =>{
        //     let event = ev.originalEvent;
        //     event.dataTransfer.setData("Text",JSON.stringify(this.data));
        //     return true;
        // });
        let __this = this;
        this.el.draggable({
            helper: "clone",
            cursor: "move",
            start:function () {
                canvasCellService.chartId = __this.data.id;
            }
        });
    },
    firstAfterRender() {
        //点击编辑删除隐藏
        $(document.body).bind('click.charts',()=>{
            this.el.find('.hide_meun').fadeOut();
        });
    },
    beforeDestory() {
        //当destory时销毁全局document.body click事件
        $(document.body).off('click.charts');
    }
};

export let ChartsComponent = Component.extend(config);

// export class ChartsComponent extends Component{
//     constructor(extendConfig) {
//         super($.extend(true,{},config,extendConfig));
//     }
// }