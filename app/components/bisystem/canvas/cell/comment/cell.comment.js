/**
 * Created by birdyy on 2017/7/31.
 */

import {BiBaseComponent} from '../../../bi.base.component';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import {config as editDialogConfig} from "../edit/edit";
import {PMAPI} from '../../../../../lib/postmsg';

let config = {
    template: template,
    data:{
        comment:"",
    },
    actions:{},
    afterRender(){

    },
    firstAfterRender(){
        console.log('iiiiiiiiiiiiiiiiiiiiii')
        console.log(this.el);
    }
};


export class CellCommentComponent extends BiBaseComponent {
    constructor(cellChart) {
        config.data.cellChart = cellChart;
        super(config);
        this.data.comment = cellChart['chart']['data'];
    }
}
