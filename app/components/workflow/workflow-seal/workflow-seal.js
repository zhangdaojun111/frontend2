import Component from '../../../lib/component';
import template from './workflow-seal.html';
import './workflow-seal.scss';
import msgBox from '../../../lib/msgbox';

import Mediator from '../../../lib/mediator';


let config = {
    template: template,
    data: {
    },
    actions: {
        addImg(e){
            let imgFile = this.el.find('.J_add')[0].files[0];
            // this.el.find('.J_add').val("");
            if(/\.(png|PNG)$/.test(imgFile.name)){
                if(imgFile){
                    let FR = new FileReader();
                    FR.onload = function (event){
                        var imgstr = event.target.result;
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
                html += "<li class='li-img'><span class='J_delImg' id="+msg.file_ids[i]+">X</span><img src='"+host+"/download_attachment/?file_id="+msg.file_ids[i]+"&download=0' data-id="+msg.file_ids[i]+" class='add-img'/></li>";
            }
            this.el.find('.J_ul-img').html(html);
        },

        dragimg(e){
            let imgLeft = $(e.target).offset().left;
            let imgTop = $(e.target).offset().top;
            let imgId =  $(e.target).attr("data-id");
            this.el.find('.J_dragimg').attr("data-id",imgId);
            let url = "http://"+window.location.host+"/download_attachment/?file_id="+imgId+"&download=0";
            this.el.find(".signatureMock").css('visibility','visible');
            this.el.find(".J_dragimg").attr("src",url);
            this.el.find(".J_dragimg").css({
                "left":imgLeft,
                "top":imgTop
            })
            let disX = e.clientX - $(e.target).offset().left;
            let disY = e.clientY - imgTop;
            this.el.find(".signatureMock").attr({
                "disX":disX,
                "disY":disY
            })
            console.log(disX+".."+disY); 
            let fromPlace =  $("#place-form").children(":first");
            // let fromPlace =  $("#place-form");
            console.log(fromPlace);
            if(fromPlace.length!=0){
                let fromClone = fromPlace.clone();
                let left =  parseInt(fromPlace.offset().left);
                let top = parseInt(fromPlace.offset().top);
                let width= fromPlace.css("width");
                let height= fromPlace.css("height");
                this.el.find(".fromClone").css({
                    "top":top,
                    "left":left,
                    "width":width,
                    "height":height,
                    "background": "#000"
                })
                this.el.find(".fromClone").children().remove();
                this.el.find(".fromClone").append(fromClone);
            }
            
        },
        Imgcoordinate(e){
            let offsetLeft = this.el.find(".signatureMock").attr("disX");
            let offsetTop = this.el.find(".signatureMock").attr("disY");
            let ox =  e.clientX - offsetLeft;
            let oy = e.clientY - offsetTop;
            $('.J_dragimg').css({
                "left":ox+"px",
                "top":oy+"px"
            })
        },
        delImg(e){
            let msg = $(e.target).attr("id");
            Mediator.publish("workflow:delImg",{"file_id":msg});
            Mediator.publish("workflow:getStamp");
        },
        //松开鼠标
        closeSeal(e){
            let from = this.el.find('.fromClone');
            //from的宽高
            console.log(from);
            let fromWidth = parseInt(from.outerWidth());
            console.log(fromWidth);
            let fromHeight = parseInt(from.outerHeight());
            //from表单距左上角的距离
            let fromOffleft = parseInt(from.offset().left);
            let fromOfftop = parseInt(from.offset().top);
            //点击时鼠标相对图片偏差
            let offsetLeft = parseInt(this.el.find(".signatureMock").attr("disX"));
            let offsetTop = parseInt(this.el.find(".signatureMock").attr("disY"));
            //图片的宽高
            let imgWidth = parseInt(this.el.find(".li-img").css('width'));
            let imgHeight = parseInt(this.el.find(".li-img").css("height"));
            //鼠标释放的位置
            let mouseLeft = e.clientX;
            let mouseTop = e.clientY;
            let imgId =$(e.target).attr("data-id");
            console.log(mouseLeft-fromOffleft);
            if(mouseLeft-offsetLeft>fromOffleft&&mouseTop-offsetTop>fromOfftop&&mouseLeft+imgWidth-offsetLeft<fromWidth+fromOffleft&&mouseTop+imgHeight-offsetTop<fromHeight+fromOfftop){
                let left = (mouseLeft-fromOffleft)/fromWidth;
                let top = (mouseTop-fromOfftop)/fromHeight;
                top= top.toFixed(6)*100;
                left= left.toFixed(6)*100;
                this.actions.createImg(top,left,280,140,imgId);
            }
            this.el.find(".signatureMock").css('visibility','hidden');
        },
        createImg(top,left,width,height,id){
            console.log(id);
            let viewLeft = left;
            let viewTop = top;
            let top1 = top+"%";
            let left1 = left+"%";
            let host = "http://"+window.location.host;
            let html = "<div class='imgseal' data-height="+height+" data-width="+width+" data-viewLeft="+viewLeft+" data-viewTop="+viewTop+" data-imgid="+id+" style='top:"+top1+";left:"+left1+";z-index:"+1002+";position:absolute;padding-top:15px;'><img  width=50 height=50 src='"+host+"/download_attachment/?file_id="+id+"&download=0'/><i class='J_del'  style='display: none;position: absolute;right: -22px;top: 0;width: 23px;height: 23px;background: url(assets/icon_del.png) no-repeat;'>X</i></div>";
            $('#place-form').children(":first").append(html);
        },
        showImgDel(e){
            let ev = $(e.target).children('i');
            ev.css("display","block");
        },
        toggImg(e){
            let ev =$(e.target);
            if(ev.hasClass("imgshow")){
                ev.removeClass('imgshow');
                ev.addClass('imghide');
                Mediator.publish("workflow:hideImg");
            }else{
                ev.removeClass('imghide');
                ev.addClass('imgshow');
                console.log(6496);
                Mediator.publish("workflow:showImg");
            }
        }
    },
    afterRender: function() {
        this.el.on('change','.J_add',(e)=>{
            this.actions.addImg(e);
        }),
        this.el.on('mousedown','.add-img',(e)=>{
            this.actions.dragimg(e);
        }),
        this.el.on("mouseup",'.signatureMock',(e)=>{
            this.actions.closeSeal(e);
        }),
        this.el.on("click",'.J_delImg',(e)=>{
            this.actions.delImg(e);
        }),
        this.el.on("mousemove",'.signatureMock',(e)=>{
            this.actions.Imgcoordinate(e);
        }),
        this.el.on("click",".J_toggImg",(e)=>{
            this.actions.toggImg(e);
        })
        // $(".approval-info-item").on("click",(e)=>{
        //     console.log(13265);
        //     this.actions.showImgDel(e);
        // })
        Mediator.subscribe('workflow:changeImg',(msg)=>{
            console.log(msg.file_ids);
            this.actions.changeImg(msg);
        })
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
            url['url']= "http://"+host+"/download_attachment/?file_id="+data.file_ids[i]+"&download=0",
            url["id"]=data.file_ids[i];
            obj.push(url);
        }
        data.url = obj;
        let component = new WorkflowSeal(data);
        let el = $('#workflow-seal');
        component.render(el);
    },
};
