/**
 * Created by birdyy on 2017/7/31.
 */

import {CellBaseComponent} from '../base';
import template from './cell.comment.html';
import "./cell.comment.scss";
import Mediator from '../../../../../../../lib/mediator';
import Quill from 'quill';
import {ViewsService} from '../../../../../../../services/bisystem/views.service';
import msgbox from '../../../../../../../lib/msgbox';

let config = {
    template: template,
    data:{
        comment:"",
    },
    actions:{
        showQuill() {
            this.data.quill.container.firstChild.innerHTML = this.data.comment.rows[0][0];
            this.el.find('.editor').show();
            this.el.find('.comment-ql-content').hide();
        }
    },
    binds:[
        {// 设置富文本编辑器，获取焦点
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
                $(context).prop('disabled',true);
                this.data.quill.blur();
                let quillContent = this.data.quill.container.firstChild.innerHTML;
                const data = {
                    content: quillContent,
                    field_id: this.data.chart.columns.dfield,
                    row_id: this.data.chart.data.rows['0']['1'],
                    table_id: this.data.chart.source.id
                };
                ViewsService.saveRichText(data).then((res)=>{
                   $(context).prop('disabled',true);
                   if(res['success']===1){
                       $(context).prop('disabled',false);
                       this.el.find('.editor').hide();
                       this.data.comment.rows[0][0] = data.content;
                       this.reload();
                   } else {
                       msgbox.alert(res['error']);
                   }
                });
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
                this.el.find('.comment-ql-content').show();
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
