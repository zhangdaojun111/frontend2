/**
 * Created by birdyy on 2017/7/31.
 */

import {CellBaseComponent} from '../base';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Mediator from '../../../../../../../lib/mediator';


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


export class CellCommentComponent extends CellBaseComponent {
    // constructor(cellChart) {
    //     config.data.cellChart = cellChart;
    //     super(config);
    //     this.data.comment = cellChart['chart']['data'];
    // }

    constructor(data,event) {
        data.cellChart = {
            cell: data.cell,
            chart: data.chart
        };
        super(config,data,event);
        this.data.comment = this.data.cellChart['chart']['data'];
    }
}
