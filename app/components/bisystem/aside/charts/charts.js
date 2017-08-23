import {BiBaseComponent} from '../../bi.base.component';

import { AsideChartService } from "../../../../services/bisystem/bi.chart.del.service";
import template from "./charts.html";
import msgbox from "../../../../lib/msgbox";
import Mediator from '../../../../lib/mediator';

import "./charts.scss";

let config = {
    template:template,
    afterRender() {
        this.el.on('dragstart',(ev) =>{
            let event = ev.originalEvent;
            event.dataTransfer.setData("Text",JSON.stringify(this.data));
            return true;
        });
        let self = this;
        this.el.on('click','.btn_ripple',function(event){
            let flag = true;
            self.el.find('.hide_meun').fadeIn('normal');
            self.el.siblings().find('.hide_meun').fadeOut('normal');;
            let top = self.el.offset().top;
            if(top>872){
                console.log(self.el.find('.hide_meun'));
                self.el.find('.hide_meun').css('top',-64);
            }
            event.stopPropagation();
            //点击消失
            $(document).bind('click',()=>{
                if (flag){
                    self.el.find('.hide_meun').fadeOut('normal');
                    flag = false;
                }
            })
        }).on('click','.btn_del',async()=>{
            const ok = await msgbox.confirm('是否删除？');
            let data = {
                chart_id:''
            };
            if (ok){
                data.chart_id = this.data.id;
                console.log(data);
                AsideChartService.delChart(data).then((res)=>{
                    if (res['success']){
                        Mediator.emit('bi:aside:del', this.data);
                        this.destroySelf();
                    }else{
                        msgbox.alert(res['error'])
                    }
                });
            }
        }).on('click','.btn_change',()=>{
            // msgbox.alert('跳转至编辑')
        });
        //显示影藏图标
        this.el.find('li').hover(
            ()=>{
                this.el.find('.btn_ripple').show();
            },
            ()=>{
                this.el.find('.btn_ripple').hide();
            }
        );


    },
};


export class ChartsComponent extends BiBaseComponent{
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}