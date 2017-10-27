/**
 * @author qiumaoyun and luyang
 * 工作审批记录component
 */

import Component from '../../../lib/component';
import template from '././approval-record.html';
import '././approval-record.scss';
import AttachmentList from "../../form/attachment-list/attachment-list";
import {PMAPI} from '../../../lib/postmsg';

let config={
    template: template,
    data:{},
    actions:{
        tipsMouseover:function (pos,txt,event) {
            if(txt!=''){
                let tooltip = $('<div id="J_tooltip"></div>');
                $("body").append(tooltip);
                let tooltipDiv=$("#J_tooltip");
                tooltipDiv.css({
                    top: (event.pageY+pos.y) + "px",
                    left:  (event.pageX+pos.x)  + "px"
                }).show("fast").text(txt);
            }
        },
        tipsMouseout:function (el) {
            el.remove()
        },
        tipsMousemove:function (pos,el,event) {
            el.css({
                top: (event.pageY+pos.y) + "px",
                left:  (event.pageX+pos.x)  + "px"
            })
        }
    },
    /**
     * @author luyang
     * @method tipsMouseover 鼠标移入创建dom，tipsMouseout 鼠标移入删除dom，tipsMousemove 鼠标移动该改变位置
     * @param  tipsMouseover(初始偏移，提示框dom文字,event对象) tipsMouseout(提示框dom对象,event对象) tipsMousemove(初始偏移，提示框dom对象，event对象)
     */
    afterRender(){
        this.showLoading();
        let self=this;
        const pos={x:10,y:20};
        this.el.on("mouseover",".tipsText",function (e) {
             let elDiv=$(this);
             let elDivText=elDiv.text();
            self.actions.tipsMouseover(pos,elDivText,e)
        });
        this.el.on("mouseout",".tipsText",function () {
            let J_tooltip=$("#J_tooltip");
            self.actions.tipsMouseout(J_tooltip)
        });
        this.el.on("mousemove",".tipsText",function (e) {
            let J_tooltip=$("#J_tooltip");
            self.actions.tipsMousemove(pos,J_tooltip,e)
        });
        this.el.on('click', '.comment-attachment', () => {
            console.log("++++++++++++++++++++")
            console.log("++++++++++++++++++++")
            console.log("++++++++++++++++++++")
            console.log(this.data.comment_attachment);
            if(this.data.comment_attachment.length > 0) {
                AttachmentList.data.list = this.data.comment_attachment;
                AttachmentList.data.is_view = true;
                PMAPI.openDialogByComponent(AttachmentList,{
                    width: 900,
                    height: 600,
                    title: '附件列表'
                })
            }
        })
    }

};
class workflowRecord extends Component{
    // constructor (data){
    //     super(config,data);
    // }

    constructor(data,newConfig){
        super($.extend(true,{},config,newConfig,{data:data||{}}));
    }
}

export default {
    showRecord(data){
        let component = new workflowRecord(data);
        let el = $('#workflow-record');
        component.render(el);
        component.hideLoading()

    },
};

