/**
 * @author hufei
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
        /**
         * 上传图片
         */
        addImg(){
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
                msgBox.alert("图片类型错误");
            }
        },
        /**
         * 修改盖章图片列表
         * @param msg 后台传递过来的包含图片的信息的一个数组
         */
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
        /**
         *
         * @param stmp 点击的dom节点
         */
        delImg(stmp){
            let msg = $(stmp).attr("id");
            Mediator.publish("workflow:delImg",{"file_id":msg});
            Mediator.publish("workflow:getStamp");
        },
        /**
         * 创建一个图片的的dom的节点，定位在form中
         * @param top 图片的定位的top百分比
         * @param left 图片的定位的left百分比
         * @param width 图片的宽度
         * @param id 图片的id
         */
        createImg(top,left,width,id){
            let viewLeft = left;
            let viewTop = top;
            let top1 = top+"%";
            let left1 = left+"%";
            let host = "http://"+window.location.host;
            let html = `<div class='imgseal noprint'  data-width=${width} data-viewLeft=${viewLeft} data-viewTop=${viewTop} data-imgid=${id} style='top:${top1};left:${left1}'>
                            <img  width=${width} style="max-height:150px" src='${host}/download_attachment/?file_id=${id}&download=0'/>
                                <i class='J_del'>X</i>
                         </div>`;
            html += `<img class="printS printimg" style="top:${top1};left:${left1};max-height: 150px" width=${width} src='${host}/download_attachment/?file_id=${id}&download=0'/>`;
            $('#place-form').find(".form-print-position").append(html);
        },
        /**
         * 是否显示隐藏form中已有的图片
         */
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
            let container = $(".form-print-position")[0];
            //容器的宽高
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let id = ui.helper[0].dataset.id;
            //容器的偏移量
            let offsetleft = $('.form-print-position').offset().left;
            let offsettop = $('.form-print-position').offset().top;
            //判断图片放置位置是否在容器区域
            let leftout = ui.position.left > offsetleft;
            let topout = ui.position.top > offsettop;
            let bottomout = ui.position.top < offsettop+containerHeight;
            let rightout = ui.position.left < offsetleft+containerWidth-248;
            if(leftout && topout && bottomout && rightout){
                let top = (ui.position.top-offsettop)/containerHeight;
                let left = (ui.position.left-offsetleft)/containerWidth;
                top = top.toFixed(6)*100;
                left = left.toFixed(6)*100;
                this.actions.createImg(top,left,248,id);
            }
            this.el.find(".signatureMock").css("visibility","hidden");
            $('.form-print-position').css("z-index",0);
        },
        /**
         * 初始化，是图片具有可拖拽属性
         */
        init(){
            let that = this;
            this.el.find(".add-img").draggable({
                helper: "clone",
                appendTo:"#approval-workflow",
                containment:"#approval-workflow",
                revert: false,
                start:function (event, ui) {
                    that.el.find(".signatureMock").css("visibility","visible");
                    $('.form-print-position').css({
                                                    "z-index":105,
                                                    "background":"#fff"
                                                    });
                },
                stop:function(event, ui){
                    that.actions.dragImg(event,ui);
                }
            });
        }
    },
    binds:[
        {
            event:'change',
            selector:'.J_add',
            callback:function(){
                this.actions.addImg();
            }
        },
        {
            event:'click',
            selector:'.J_toggImg',
            callback:function(){
                this.actions.toggImg();
            }
        },
        {
            event:'click',
            selector:'.J_delImg',
            callback:function(stmp =this){
                this.actions.delImg(stmp);
            }
        }

    ],
    afterRender: function() {
        //是否隐藏显示盖章图片
        this.showImg = true;
        this.actions.init();
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
        let host = window.location.origin;
        let len = data.file_ids.length;
        let obj = new Array();
        for(let i=0;i<len;i++){
            let url = {};
            url['url']= `${host}/download_attachment/?file_id=${data.file_ids[i]}&download=0`,
                url["id"]=data.file_ids[i];
            obj.push(url);
        }
        data.url = obj;
        let component = new WorkflowSeal(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
}