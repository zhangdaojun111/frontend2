import Component from '../../../../lib/component';

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
            this.el.find('.hide_meun').fadeIn('normal');
            this.el.siblings().find('.hide_meun').fadeOut('normal');
            let top = this.el.offset().top;
            this.el.find('.hide_meun').css('top',top);
            if(top>872){
                this.el.find('.hide_meun').css('top',top-64);
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
            selector:'.btn_del',
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
    firstAfterRender() {
        //点击编辑删除隐藏
        $(document.body).bind('click.charts',()=>{
            this.el.find('.hide_meun').fadeOut('normal');
        });
    },
    beforeDestory() {
        //当destory时销毁全局document.body click事件
        $(document.body).off('click.charts');
    }
};


export class ChartsComponent extends Component{
    constructor(charts,events) {
        config.data = charts? charts : null;
        config.data.imgUrl = window.config.img_url;
        config.data.isIcon = charts['icon']? true:false;
        config.data.userSelf = charts['self'] == 1 ? true : false;
        super(config,charts,events);
    }
}