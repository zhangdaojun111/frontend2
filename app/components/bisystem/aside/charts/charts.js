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
        }).on('click','.btn_ripple',()=>{
            alert(1);
            // const ok = await msgbox.confirm('是否删除？');
            // let data = {
            //     chart_id:''
            // };
            // if(ok){
            //     data.chart_id = this.data.id;
            //     AsideChartService.delChart(data).then((res)=>{
            //         if(res['success']===1){
            //             // Mediator.publish('bi:aside:chart_del',this.data);
            //             this.destroySelf();
            //             this.reload();
            //         }else{
            //             alert(res['error']);
            //         }
            //     })
            // }
        })
    }
};


export class ChartsComponent extends BiBaseComponent{
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}