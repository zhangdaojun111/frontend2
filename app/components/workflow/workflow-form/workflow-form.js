
/**
 *@author hufei
 * 对工作流表单的操作
 */

import Component from "../../../lib/component";
import template from './workflow-form.html';
import './workflow-form.scss';

import Mediator from '../../../lib/mediator';

let config = {
    template: template,
    actions: {
        showImgDel(e){
            let ev = $(e.target).children('i');
            ev.css("display","block");
        },
        hideImgDel(e){
            let ev = $(e.target).children('i');
            ev.css("display","none");
        },
        delimg(e){
            let el = $(e.target).parent();
            let em = el.next();
            em.remove();
            el.remove();
        },
        //收集上传的信息给后台
        collectImg(){
            let imgNode = this.el.find('.imgseal');
            let len = imgNode.length;
            let arr =[];
            for (let i=0;i<len;i++){
                let id = imgNode[i].dataset.imgid;
                let viewTop = imgNode[i].dataset.viewtop;
                let viewLeft = imgNode[i].dataset.viewleft;
                let width = imgNode[i].dataset.width;
                let height = imgNode[i].dataset.height;
                let obj = {
                    "height":height,
                    "width":width,
                    "file_id":id,
                    "viewTop":viewTop,
                    "viewLeft":viewLeft
                };
                arr.push(obj);
            }
            return arr;
        },
        addImg(e){
            let imgInfo = e.data[0].stamps;
            let len =imgInfo.length;
            var html = " ";
            let host = window.location.host;
            for (let i=0;i<len;i++){
                let left = imgInfo[i].viewLeft+"%";
                let top = imgInfo[i].viewTop+"%";
                html += `<img class="oldImg" src="http://${host}/download_attachment/?file_id=${imgInfo[i].file_id}&download=0" style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px " />`
            }
            this.el.find("#place-form").append(html);
        },
        hideImg(e){
            this.el.find(".oldImg").css("display","none");
        },
        showImg(e){
            this.el.find(".oldImg").css("display","block");
        },
        trans(){
            let ev = this.el.find('.collapseFormBtn');
            if(this.formTrans){
                ev.addClass("animat2");
                ev.removeClass("animat1");
                this.formTrans = false;
            }else{
                ev.addClass("animat1");
                ev.removeClass("animat2");
                this.formTrans = true;
            }
            this.el.find(".place-form").toggle();
        }
    },
    afterRender: function() {
        let __this=this;
        this.formTrans = false;
        this.el.on('click','.collapseFormBtn',()=>{
            this.actions.trans();
        }),
        this.el.on("mouseenter",".imgseal",function(e){
            let ev = $(this).find('.J_del');
            ev.css("display","block");
        }),
        this.el.on("mouseleave",'.imgseal',function(e){
            let ev = $(this).find('.J_del');
            ev.css("display","none");
           
        })
        this.el.on("click",'.J_del',(e)=>{
            this.actions.delimg(e);
        })
        Mediator.subscribe('workflow:getFormTrans',(e)=>{
            console.log(e+"............................");
            if(!e){
               if(this.formTrans) {
                   this.actions.trans();
               }
            }
        })
        Mediator.subscribe('workflow:getImgInfo',(e)=>{
            this.actions.addImg(e);
        });
        Mediator.subscribe('workflow:hideImg',(e)=>{
            this.actions.hideImg(e);
        });
        Mediator.subscribe('workflow:showImg',(e)=>{
            this.actions.showImg(e);
        });
        Mediator.subscribe("workflow:appPass",(e)=>{
            Mediator.publish('workflow:sendImgInfo',this.actions.collectImg());
        });
        //获取表名，通过form传给我们表名
        Mediator.subscribe("workflow:getWorkflowTitle",res=>{
           console.log("获取表头，通过form传给我们表头,发布为workflow:gotWorkflowTitle");
           if(res){
               this.el.find(".J_wfName").text(res);
           }else{
               this.el.find(".J_wfName").text("表名");
           }
        });
    }
}

class WorkFlowForm extends Component {
    constructor(data){
        config.data = data;
        super(config);
    }
}

export default {
     showForm(data) {
        let component = new WorkFlowForm();
        let el = $('#workflow-form');
        component.render(el);
     }
};
