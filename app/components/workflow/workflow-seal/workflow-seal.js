/**
 * author hufei
 * 工作流审批盖章的操作
 */
import Component from '../../../lib/component';
import template from './workflow-seal.html';
import './workflow-seal.scss';
import msgBox from '../../../lib/msgbox';
import Mediator from '../../../lib/mediator';
import Uploader from '../../../lib/uploader'
let config = {
    template: template,
    data: {
        // cloneImgId:0,
        // isClone:true,
    },
    actions: {
        addImg(e){
            let imgFile = this.el.find('.J_add')[0].files[0];
            // this.el.find('.J_add').val("");
            if(/\.(png|PNG)$/.test(imgFile.name)){
                if(imgFile){
                    let FR = new FileReader();
                    FR.onload = function (event){
                        let imgstr = event.target.result;
                        let imgstr2 = imgstr.substring(22,imgstr.length);
                        Mediator.publish("workflow:seal",{"base64":imgstr2});
                        // Mediator.publish("workflow:getStamp");
                    };
                    FR.readAsDataURL(imgFile);
                }
            }else{
                msgBox.showTips("图片类型错误");
            }
        },
        changeImg(msg){
            this.el.find(".J_ul-img").empty();
            let len = msg.file_ids.length;
            let html = " ";
            let host = "http://"+window.location.host;
            for (let i=0;i<len;i++){
                html += `<li class='li-img clearfix'><span class='J_delImg delImg' id=${msg.file_ids[i]}>X</span><img src='${host}/download_attachment/?file_id=${msg.file_ids[i]}&download=0' data-id=${msg.file_ids[i]} class='add-img'/></li>`;
            }
            this.el.find('.J_ul-img').html(html);
        },

        delImg(e){
            let msg = $(e.target).attr("id");
            Mediator.publish("workflow:delImg",{"file_id":msg});
            Mediator.publish("workflow:getStamp");
        },

        createImg(top,left,width,height,id){
            let viewLeft = left;
            let viewTop = top;
            let top1 = top+"%";
            let left1 = left+"%";
            let host = "http://"+window.location.host;
            let html = `<div class='imgseal noprint' data-height=${height} data-width=${width} data-viewLeft=${viewLeft} data-viewTop=${viewTop} data-imgid=${id} style='top:${top1};left:${left1}'>
                            <img  width=${width} height=${height} src='${host}/download_attachment/?file_id=${id}&download=0'/>
                                <i class='J_del'>X</i>
                         </div>`;
            html += `<img class="printS printimg" style="top:${top1};left:${left1};" width=${width} height=${height} src='${host}/download_attachment/?file_id=${id}&download=0'/>`;
            $('#place-form').children(":first").append(html);
        },
        showImgDel(e){
            let ev = $(e.target).children('i');
            ev.css("display","block");
        },
        toggImg(){
            if(this.showImg){
                this.showImg = false;
                Mediator.publish("workflow:hideImg");
            }else{
                this.showImg = true;
                Mediator.publish("workflow:showImg");
            }
        },
        dragImg(event,ui){
            let container = $("#place-form")[0];
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let top = ui.position.top/containerHeight;
            let left = ui.position.left/containerWidth;
            let id = ui.helper[0].dataset.id;
            top= top.toFixed(6)*100;
            left= left.toFixed(6)*100;
            this.actions.createImg(top,left,50,50,id);
            this.el.find(".signatureMock").css("visibility","hidden");
            $('#place-form').css("z-index",0);
        },
        init(){
            let that = this;
            this.el.find(".add-img").draggable({
                helper: "clone",
                appendTo:"#place-form",
                containment:"#place-form",
                revert: false,
                start:function (event, ui) {
                    that.el.find(".signatureMock").css("visibility","visible");
                    $('#place-form').css("z-index",105);
                },
                stop:function(event, ui){
                    that.actions.dragImg(event,ui);
                }
            });
        }
    },
    afterRender: function() {
        this.showImg = true;
        this.actions.init();

        this.el.on('change','.J_add',(e)=>{
            this.actions.addImg(e);
        }),
        this.el.on("click",'.J_delImg',(e)=>{
            this.actions.delImg(e);
        }),
        this.el.on("click",".J_toggImg",()=>{
            this.actions.toggImg();
        });
        $(".approval-info-item").on("click",(e)=>{
            this.actions.showImgDel(e);
        });
        Mediator.subscribe('workflow:changeImg',(msg)=>{
            this.actions.changeImg(msg);
            this.actions.init();
        });
    },
    beforeDestory: function(){
    }
}
class WorkflowSeal extends Component{
    constructor (data){
        super(config,data);
    }
}
export default {
    showheader(data){
        let host = window.location.host;
        let len = data.file_ids.length;
        let obj = new Array();
        for(let i=0;i<len;i++){
            let url = {};
            url['url']= `http://${host}/download_attachment/?file_id=${data.file_ids[i]}&download=0`,
                url["id"]=data.file_ids[i];
            obj.push(url);
        }
        data.url = obj;
        let component = new WorkflowSeal(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
}