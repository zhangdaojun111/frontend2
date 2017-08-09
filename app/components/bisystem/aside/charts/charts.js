import {BiBaseComponent} from '../../bi.base.component';

import template from "./charts.html";
import "./charts.scss";

let config = {
    template:template,
    afterRender() {
        this.el.on('dragstart',(ev) =>{
            let event = ev.originalEvent;
            event.dataTransfer.setData("Text",JSON.stringify(this.data));
        })
    }
};


export class ChartsComponent extends BiBaseComponent{
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}