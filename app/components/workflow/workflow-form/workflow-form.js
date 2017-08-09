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
            el.remove();
        },
        //收集上传的信息给后台
        collectImg(){
            let imgNode = this.el.find('.imgseal');
            console.log(imgNode);
            let len = imgNode.length;
            let arr = new Array();
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
        },
        addImg(e){
            let imgInfo = e;
            let len =imgInfo.lenth;
            let html = " ";
            let host = window.location.host;
            for (let i=0;i<len;i++){
                let left = imgInfo[i].viewLeft+"%";
                let top = imgInfop[i].viewTop+"%";
                html += '<img class="oldImg" class="" src="'+host+'/data/download_attachment/?file_id='+imgInfo[i].file_id+'&download=0" style="position:absolute;z-index:100;left:'+left+';top:'+top+';height:'+imgInfo[i].height+';width:'+imgInfo[i].width+' " />'
            }
            this.el.find("#place-form").append(html);
        },
        hideImg(e){
            this.el.find(".oldImg").css("visibility","hidden");
        },
        showImg(e){
            this.el.find(".oldImg").css("visibility","visibility");
        }
    },
    afterRender: function() {
        this.el.on('click','.collapseFormBtn',()=>{
            this.el.find(".place-form").toggle();
        })
        this.el.on("mouseenter",".imgseal",(e)=>{
            this.actions.showImgDel(e);
        }),
        this.el.on("mouseleave",'.imgseal',(e)=>{
            this.actions.hideImgDel(e);
        })
        this.el.on("click",'.J_del',(e)=>{
            this.actions.delimg(e);
        })
        Mediator.subscribe('workflow:gotImgInfo',(e)=>{
            this.actions.addImg(e);
        });
        Mediator.subscribe('workflow:hideImg',(e)=>{
            this.actions.hideImg(e);
        });
        Mediator.subscribe('workflow:showImg',(e)=>{
            this.actions.showImg(e);
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
