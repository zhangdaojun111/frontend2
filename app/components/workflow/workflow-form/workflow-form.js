
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

        /**
         * 收集上传的信息给后台
         * @returns {Array} 返回一个添加到form中的图片的信息
         */
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
        /**
         * 添加上次审批盖章图片
         * @param e 后端传过来json
         */
        addImg(e){
            let imgInfo = e.data[0].stamps;
            let len =imgInfo.length;
            let html = " ";
            let host = window.location.host;
            for (let i=0;i<len;i++){
                let left = imgInfo[i].viewLeft+"%";
                let top = imgInfo[i].viewTop+"%";
                let container = $(".form-print-position")[0];
                //容器的宽高
                let containerHeight = container.clientHeight/100;
                let containerWidth = container.clientWidth/100;
                let left1 = parseFloat(left)*containerWidth+248;
                let top1 = parseFloat(top)*containerHeight;
                html += `<img class="oldImg noprint" src="http://${host}/download_attachment/?file_id=${imgInfo[i].file_id}&download=0" style="left:${left};top:${top};height:${imgInfo[i].height}px;width:${imgInfo[i].width}px " />`;
                html += `<img class="printimg printS" src="http://${host}/download_attachment/?file_id=${imgInfo[i].file_id}&download=0" style="left:${left1}px;top:${top1}px;height:${imgInfo[i].height}px;width:${imgInfo[i].width}px " />`;

            }
            this.el.find(".form-print-position").append(html);
        },
        /**
         * 隐藏原来的图片
         */
        hideImg(){
            this.el.find(".oldImg").css("display","none");
        },
        /**
         * 显示原来的图片
         */
        showImg(){
            this.el.find(".oldImg").css("display","block");
        },
        /**
         * 收缩和展开form表单
         */
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
    binds:[
        {
            event:'click',
            selector:'.collapseFormBtn',
            callback:function(){
                this.actions.trans();
            }
        },
    ],
    afterRender: function() {
        // this.showLoading();
        let __this=this;
        this.formTrans = false;
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
            if(!e){
               if(this.formTrans) {
                   this.actions.trans();
               }
            }
        })
        Mediator.subscribe('workflow:getImgInfo',(e)=>{
            this.actions.addImg(e);
        });
        Mediator.subscribe('workflow:hideImg',()=>{
            this.actions.hideImg();
        });
        Mediator.subscribe('workflow:showImg',()=>{
            this.actions.showImg();
        });
        Mediator.subscribe("workflow:appPass",(e)=>{
            Mediator.publish('workflow:sendImgInfo',this.actions.collectImg());
        });
        //获取表名，通过form传给我们表名
        Mediator.subscribe("workflow:getWorkflowTitle",res=>{
           if(res){
               this.el.find(".J_wfName").text(res);
           }else{
               this.el.find(".J_wfName").text("表名");
           }
        });
        Mediator.subscribe("form:formAlreadyCreate",(e)=>{
            // this.hideLoading();
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
     showForm() {
         let component = new WorkFlowForm();
         let el = $('#workflow-form');
         component.render(el);
     }

};
