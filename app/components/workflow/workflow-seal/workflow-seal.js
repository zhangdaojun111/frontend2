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
                html += "<li class='li-img clearfix'><span class='J_delImg delImg' id="+msg.file_ids[i]+">X</span><img src='"+host+"/download_attachment/?file_id="+msg.file_ids[i]+"&download=0' data-id="+msg.file_ids[i]+" class='add-img'/></li>";
            }
            this.el.find('.J_ul-img').html(html);
        },
        /*cloneImg:function (el) {
            if(this.data.isClone){
                this.data.isClone=false;
                $(".cloneMask").show();
                let id=this.data.cloneImgId+=1;
                let cloneimgId=`cloneimgId${id}`;
                $(".cloneImgdiv").append(el.find('img').clone().addClass("cloneImg").attr('id',cloneimgId).css({
                    position: 'absolute',
                    zIndex: '99',
                    top:'50%',
                    left:'50%',
                    width:'100px',
                    height:'100px'
                }));
            }
        },
        cloneImgDrag:function (el) {
            var self=this;
           el.draggable({
               containment:'#detail-form',
               drag:function () {
                   $(".seal").css({
                       zIndex:60
                   })
               },
               stop: function() {
                   $(".seal").css({
                       zIndex:62
                   });
                   $(".cloneMask").hide();
                   self.data.isClone=true;
               }
           });
        },*/
        dragimg(e){
            let imgLeft = $(e.target).offset().left;
            let imgTop = $(e.target).offset().top;
            let imgId =  $(e.target).attr("data-id");
            this.el.find('.J_dragimg').attr("data-id",imgId);
            let url = "http://"+window.location.host+"/download_attachment/?file_id="+imgId+"&download=0";
            this.el.find(".signatureMock").css('visibility','visible');
            // this.el.find(".J_dragimg").attr("src",url);
            console.log(url);
            this.el.find(".J_dragimg").css({
                "left":imgLeft,
                "top":imgTop,
                "background-image":  `url(${url})`,
                "background-repeat":"no-repeat"
            })
            let disX = e.clientX - imgLeft;
            let disY = e.clientY - imgTop;
            this.el.find(".signatureMock").attr({
                "disX":disX,
                "disY":disY
            })
            console.log(disX+".."+disY);
            let fromPlace =  $("#place-form").children(":first");
            // let fromPlace =  $("#place-form");
            if(fromPlace.length!=0){
                let fromPlase = this.el.find(".fromClone");
                let fromClone = fromPlace.clone();
                let left =  parseInt(fromPlace.offset().left);
                let top = parseInt(fromPlace.offset().top);
                let width= fromPlace.css("width");
                let height= fromPlace.css("height");
                fromPlase.css({
                    "top":top,
                    "left":left,
                    "width":width,
                    "height":height,
                    "background": "#fff"
                })
                fromPlase.children().remove();
                fromPlase.append(fromClone);
                fromPlase.find(".imgseal").hide();
                fromPlase.find('.printS').hide();
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
            let leftout = mouseLeft-offsetLeft>fromOffleft;
            let rightout = mouseTop-offsetTop>fromOfftop;
            let topout = mouseTop+imgHeight-offsetTop<fromHeight+fromOfftop;
            let bottomout = mouseLeft+imgWidth-offsetLeft<fromWidth+fromOffleft;
            if(leftout&&rightout&&topout&&bottomout){
                let left = (mouseLeft-fromOffleft-offsetLeft)/fromWidth;
                let top = (mouseTop-fromOfftop-offsetTop)/fromHeight;
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
            let html = "<div class='imgseal noprint' data-height="+height+" data-width="+width+" data-viewLeft="+viewLeft+" data-viewTop="+viewTop+" data-imgid="+id+" style='top:"+top1+";left:"+left1+";z-index:"+1002+";position:absolute;padding-top:15px;'><img  width=228 height=148 src='"+host+"/download_attachment/?file_id="+id+"&download=0'/><i class='J_del'  style='display: none;position: absolute;right: -22px;top: 0;width: 23px;height: 23px;'>X</i></div>";
            html += `<img class="printS" style="top:${top1};left:${left1};position: absolute;margin-top: 17px;" width=228 height=148 src='${host}/download_attachment/?file_id=${id}&download=0'/>`;
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
        }
    },
    afterRender: function() {
        this.showImg = true;
        this.el.on('change','.J_add',(e)=>{
            this.actions.addImg(e);
        }),
        this.el.on('mousedown','.add-img',(e)=>{
            this.actions.dragimg(e);
        }),
        this.el.on("mouseup",'.signatureMock',(e)=>{
            this.actions.closeSeal(e);
            // e.stopPropagation(e);
        }),
        this.el.on("click",'.J_delImg',(e)=>{
            this.actions.delImg(e);
        }),
        this.el.on("mousemove",'.signatureMock',(e)=>{
            this.actions.Imgcoordinate(e);
            // e.stopPropagation(e);
        }),
        this.el.on("click",".J_toggImg",()=>{
            this.actions.toggImg();
        });
        // $(".approval-info-item").on("click",(e)=>{
        //     console.log(13265);
        //     this.actions.showImgDel(e);
        // })
        // this.el.on("click",'.li-img',function () {
        //     self.actions.cloneImg($(this));
        // });
        // this.el.parents("#approval-workflow").on('mousedown','.cloneImg',function () {
        //     self.actions.cloneImgDrag($(this));
        // });
        $(".approval-info-item").on("click",(e)=>{
            console.log(13265);
            this.actions.showImgDel(e);
        });
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
}