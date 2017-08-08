import {BiBaseComponent} from '../../bi.base.component';

import template from "./charts.html";
import "./charts.scss";

let config = {
    template:template,
};


export class ChartsComponent extends BiBaseComponent{
    constructor(charts) {
        config.data = charts? charts : null;
        super(config);
    }
}