import {BiBaseComponent} from '../../bi.base.component';

import template from "./view.list.html";
import "./view.list.scss";

let config = {
    template:template,
};


export class ViewListComponent extends BiBaseComponent{
    constructor(views) {
        config.data = views? views : null;
        super(config);
    }
}