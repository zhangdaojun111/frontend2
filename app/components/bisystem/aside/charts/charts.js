import {BiBaseComponent} from '../../bi.base.component';

import { AsideChartService } from "../../../../services/bisystem/bi.chart.del.service";
import template from "./charts.html";
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';

import "./charts.scss";

let config = {
    template:template,
    data:{
      charts:[],
    },
    actions:{
        /**
         * 隐藏删除/编辑
         */
        fadeOI(event) {
            let flag = true;
            this.el.find('.hide_meun').fadeIn('normal');
            this.el.siblings().find('.hide_meun').fadeOut('normal');
            let top = this.el.offset().top;
            if(top>872){
                this.el.find('.hide_meun').css('top',-64);
            }
            event.stopPropagation();
            //点击消失
            $(document).bind('click',()=>{
                if (flag){
                    this.el.find('.hide_meun').fadeOut('normal');
                    flag = false;
                }
            })
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
                        Mediator.emit('bi:aside:del', this.data);
                        this.destroySelf();
                    }else{
                        msgbox.alert(res['error'])
                    }
                });
            }
        }

    },
    binds:[
        {
            event:'mouseover',
            selector:'li',
            callback: function () {
                this.el.find('.btn_ripple').show();
            }
        },
        {
            event:'mouseout',
            selector:'li',
            callback: function () {
                this.el.find('.btn_ripple').hide();
            }
        },
        {
            event:'click',
            selector:'li .btn_del',
            callback: function () {
                this.actions.confirmDel();
            }
        },
        {
            event:'click',
            selector:'li .btn_ripple',
            callback: function () {
               this.actions.fadeOI(event);
            }
        },
    ],
    afterRender() {
        this.el.on('dragstart',(ev) =>{
            let event = ev.originalEvent;
            event.dataTransfer.setData("Text",JSON.stringify(this.data));
            return true;
        });
    },
};


export class ChartsComponent extends BiBaseComponent{
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}