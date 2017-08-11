/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.comment.html';
import "./cell.comment.scss";

let config = {
    template: template,
    data:{
        comment:"",
    }
};

export class CellCommentComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.comment = cellChart['chart']['data'];
        super(config);
    }
}
