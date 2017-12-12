/**
 * @author qiumaoyun and luyang
 * 工作审批记录component
 */

import Component from '../../../lib/component';
import template from '././approval-record.html';
import '././approval-record.scss';
import AttachmentList from "../../form/attachment-list/attachment-list";
import {PMAPI} from '../../../lib/postmsg';
import {workflowService} from '../../../services/workflow/workflow.service';
import QuillAlert from '../../form/quill-alert/quill-alert';

let config={
    template: template,
    data:{},
    binds: [
        {
            event: 'click',
            selector: '.comment-attachment',
            callback: function (e) {
                if(this.data.approve_tips[e.id].comment_attachment.length > 0) {
                    let params = {
                        file_ids: JSON.stringify(this.data.approve_tips[e.id].comment_attachment),
                        dinput_type: '9'
                    };
                    workflowService.getAttachmentList(params).then(res => {
                        if(res.success){
                            let list = res["rows"];
                            for( let data of list ){
                                //附件名称编码转换
                                let str = workflowService.getFileExtension( data.file_name );
                                if( workflowService.preview_file.indexOf( str.toLowerCase() ) !== -1 ){
                                    data["isPreview"] = true;
                                    if( workflowService.preview_file.indexOf(str.toLowerCase()) <4){
                                        data["isImg"] = true;
                                    }else{
                                        data["isImg"] = false;
                                    }
                                }else{
                                    data["isPreview"] = false;
                                }
                            }
                            AttachmentList.data.list = list;
                            AttachmentList.data.is_view = true;
                            // AttachmentList.data.dinput_type = '23';
                            PMAPI.openDialogByComponent(AttachmentList,{
                                width: 900,
                                height: 600,
                                title: '附件列表'
                            })
                        }
                    })
                }
            }
        },
        {
            event: 'click',
            selector: '.approval-comment',
            callback: function (e) {
                let id = $(e).attr('data-id');
                QuillAlert.data.value =this.data.approve_tips[id].comment.replace(/(\n)/g, '').replace(/(")/ig,'\\\"');
                    PMAPI.openDialogByComponent(QuillAlert,{
                        width: 1200,
                        height: 650,
                        title: '文本编辑器',
                        modal: true,
                        maxable: true,
                    })
                }
        },
    ],
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
        for(let k in this.data.approve_tips){
            let comment = this.data.approve_tips[k]['comment'];
            let commentM = comment.match(/<img(.*?)>/g);
            if(comment && commentM != null){
                $(this.el.find('.workflow-record-item').get(k)).find('.approval-comment1').children('.approval-comment').show();
            }
            if(comment && commentM == null){
                $(this.el.find('.workflow-record-item').get(k)).find('.approval-comment1').text(comment.replace(/<.*?>/ig,""));
                $(this.el.find('.workflow-record-item').get(k)).find('.approval-comment1').addClass('tipsText')
            }
            if(this.data.approve_tips[k]['comment_attachment'].length > 0){
                $(this.el.find('.workflow-record-item').get(k)).find('.comment-attachment').children('.comment-attachment1').show();
            }
        }

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
    }

};
let workflowRecord = Component.extend(config);
export default workflowRecord
