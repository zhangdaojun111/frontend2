/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Mediator from '../../../../../lib/mediator';


let config = {
    template: template,
    data:{
        comment:"",
    },
    actions:{},
    afterRender(){

    },
    firstAfterRender(){}
};


export class CellCommentComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart;
        super(config);
        this.data.comment = cellChart['chart']['data'];
    }
}
