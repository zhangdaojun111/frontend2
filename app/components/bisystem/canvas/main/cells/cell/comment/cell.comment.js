/**
 * Created by birdyy on 2017/7/31.
 */

import {CellBaseComponent} from '../base';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Mediator from '../../../../../../../lib/mediator';
import Quill from 'quill';


let config = {
    template: template,
    data:{
        comment:"",
    },
    actions:{
        showQuill() {
            this.el.find('.editor').show();
        }
    },
    binds:[
        {// 当mousedown富文本编辑器时，获取焦点
            event: 'click',
            selector: '.comment',
            callback: function (context,event) {
                this.data.quill.focus();
            }
        },
        {// 保存富文本编辑器内容到服务器
            event: 'click',
            selector: '.save-rich-btn',
            callback: function (context,event) {
                let quillContent = this.data.quill.container.firstChild.innerHTML;
                console.log(quillContent);
                return false;
            }
        },
        {// 隐藏富文本编辑器，返回注释内容界面
            event: 'click',
            selector: '.cancel-rich-btn',
            callback: function (context,event) {
                this.el.find('.editor').hide();
                this.data.quill.blur();
                this.data.quill.container.firstChild.innerHTML = '';
                return false;
            }
        },
    ],
    afterRender(){
        let toolbarOptions = [{ size: [ 'small', false, 'large', 'huge' ]},{ 'header': [1, 2, 3, 4, 5, 6]},{ 'list': 'ordered'}, { 'list': 'bullet' },'image'];
        // console.log(this.data);
        this.data.quill = new Quill(`#comment${this.componentId}`, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions
            }
        });
        this.data.quill.getSelection();
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
            chart: data.chart,
        };
        super(config,data,event);
        this.data.comment = this.data.cellChart['chart']['data'];
        this.data.componentId = this.componentId;
    }
}
