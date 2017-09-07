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
    actions:{
        /**
         * 新建文本编译器
         */
        newEditor(id) {
            this.data.toolbarOptions = [
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link','image','code-block'],
                ['clean']
            ];
            let conId = '.editor-content'+id;
            this.data.editor = new Quill( conId , {
                modules: {
                    toolbar: this.data.toolbarOptions
                },
                theme: 'snow',
            });
        }
    },
    afterRender(){
        // this.actions.newEditor(this.data.chartNameId);
        // this.data.editor.root.innerHTML = this.data.chartVal;
    },
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
