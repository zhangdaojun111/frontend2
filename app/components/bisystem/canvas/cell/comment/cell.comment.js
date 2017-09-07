/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Mediator from '../../../../../lib/mediator';
import Quill from 'quill';

let config = {
    template: template,
    data:{
        comment:"",
        chartNameId:null,
    },
    actions:{},
    afterRender(){},
    firstAfterRender(){}
};


export class CellCommentComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart;
        super(config);
        this.data.comment = cellChart['chart']['data'];
        this.data.chartNameId = cellChart['chart']['chartName']['id'];
        this.data.chartVal = cellChart['chart']['data']['rows']['0']['0'] ? cellChart['chart']['data']['rows']['0']['0']:'';
    }
}
